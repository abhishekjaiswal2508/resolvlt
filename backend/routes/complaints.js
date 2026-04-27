const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// @route POST /api/complaints
// @desc Create a new complaint with optional file upload
router.post('/', protect, upload.single('proof'), async (req, res) => {
    try {
        const { title, description, category_id } = req.body;
        const filePath = req.file ? `/uploads/${req.file.filename}` : null;

        const [result] = await pool.query(
            'INSERT INTO complaints (title, description, user_id, category_id, file_path) VALUES (?, ?, ?, ?, ?)',
            [title, description, req.user.id, category_id || null, filePath]
        );

        res.status(201).json({ message: 'Complaint filed successfully', complaintId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route GET /api/complaints
// @desc Get all complaints (Admin/Staff) or only user's complaints (Student)
router.get('/', protect, async (req, res) => {
    try {
        let query = `
            SELECT c.*, u.username as student_name, cat.category_name 
            FROM complaints c 
            LEFT JOIN users u ON c.user_id = u.user_id
            LEFT JOIN categories cat ON c.category_id = cat.category_id
        `;
        let params = [];

        if (req.user.role === 'Student') {
            query += ' WHERE c.user_id = ?';
            params.push(req.user.id);
        } else if (req.user.role === 'Maintenance') {
            // Staff only sees assigned complaints
            query += `
                INNER JOIN assignments a ON c.complaint_id = a.complaint_id
                WHERE a.assigned_to_user_id = ?
            `;
            params.push(req.user.id);
        }

        query += ' ORDER BY c.created_at DESC';

        const [complaints] = await pool.query(query, params);
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route GET /api/complaints/categories
// @desc Get all categories
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM categories');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==============================================================================
// VIVA REQUIREMENT: "Updating Status" Logic
// ==============================================================================
// Endpoint: PUT /api/complaints/:id/status
// Access: STAFF ONLY (or ADMIN)
// Description: This endpoint allows maintenance staff to update a complaint's status.
router.put('/:id/status', protect, async (req, res) => {
    try {
        // Step 1: Extract the complaint ID from the URL parameters
        const complaintId = req.params.id;
        
        // Step 2: Extract the new status from the request body
        const { status } = req.body;

        // Step 3: Validate the status against allowed values
        if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Step 4: Ensure the user is authorized to update status (Staff or Admin)
        if (req.user.role !== 'Maintenance' && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to update status' });
        }

        // Step 5: If the user is Staff, ensure they are actually assigned to this complaint
        if (req.user.role === 'Maintenance') {
            const [assignments] = await pool.query(
                'SELECT * FROM assignments WHERE complaint_id = ? AND assigned_to_user_id = ?',
                [complaintId, req.user.id]
            );
            
            if (assignments.length === 0) {
                return res.status(403).json({ message: 'You can only update complaints assigned to you' });
            }
        }

        // Step 6: Update the complaint status in the database
        const [updateResult] = await pool.query(
            'UPDATE complaints SET status = ? WHERE complaint_id = ?',
            [status, complaintId]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Step 7: Send a success response
        res.json({ message: 'Status updated successfully', currentStatus: status });

    } catch (error) {
        // Step 8: Handle errors gracefully
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
