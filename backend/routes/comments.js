const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @route POST /api/comments
// @desc Add a comment to a complaint
router.post('/', protect, async (req, res) => {
    try {
        const { complaint_id, comment_text } = req.body;
        const [result] = await pool.query(
            'INSERT INTO comments (complaint_id, user_id, comment_text) VALUES (?, ?, ?)',
            [complaint_id, req.user.id, comment_text]
        );
        res.status(201).json({ message: 'Comment added successfully', commentId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route GET /api/comments/:complaintId
// @desc Get all comments for a complaint
router.get('/:complaintId', protect, async (req, res) => {
    try {
        const [comments] = await pool.query(`
            SELECT c.*, u.username, u.role
            FROM comments c
            JOIN users u ON c.user_id = u.user_id
            WHERE c.complaint_id = ?
            ORDER BY c.posted_at ASC
        `, [req.params.complaintId]);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
