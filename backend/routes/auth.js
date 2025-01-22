const express = require('express');
const router = express.Router();

router.get('/checkAuth', (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ isAuthenticated: true });
  }
  return res.status(200).json({ isAuthenticated: false });
});

module.exports = router;
