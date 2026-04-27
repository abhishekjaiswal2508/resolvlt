const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ==============================================================================
// VIVA REQUIREMENT: "Assigning a Complaint" Logic
// ==============================================================================
// Endpoint: POST /api/assignments
// Access: ADMIN ONLY
// Description: This endpoint handles the assignment of a complaint to a staff member.
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        // Step 1: Destructure required fields from the request body
        const { complaint_id, assigned_to_user_id, admin_notes } = req.body;

        // Step 2: Validate that both complaint ID and the staff user ID are provided
        if (!complaint_id || !assigned_to_user_id) {
            return res.status(400).json({ message: 'Complaint ID and Staff User ID are required' });
        }

        // Step 3: Insert the assignment record into the 'assignments' table
        const [assignmentResult] = await pool.query(
            'INSERT INTO assignments (complaint_id, assigned_to_user_id, admin_notes) VALUES (?, ?, ?)',
            [complaint_id, assigned_to_user_id, admin_notes]
        );

        // Step 4: (Optional but recommended) Update the complaint status to 'In Progress' 
        // to show that it is no longer just 'Pending'
        await pool.query(
            'UPDATE complaints SET status = "In Progress" WHERE complaint_id = ?',
            [complaint_id]
        );

        // Step 5: Send a success response back to the client
        res.status(201).json({ 
            message: 'Complaint assigned successfully', 
            assignmentId: assignmentResult.insertId 
        });

    } catch (error) {
        // Step 6: Handle any server or database errors
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route GET /api/assignments/staff
// @desc Get all staff members for dropdown
router.get('/staff', protect, adminOnly, async (req, res) => {
    try {
        const [staff] = await pool.query('SELECT user_id, username, email FROM users WHERE role = "Maintenance"');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
