const express = require('express');
const { registerUser, loginUser, logoutUser, updateUser, newUserName, checkAuth, getUser, updateName } = require('../controllers/userController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.put('/update', ensureAuthenticated, updateUser);
router.post('/:newUsername', newUserName);
router.get('/checkAuth', checkAuth);
router.get('/user', getUser);
router.put('/update-name', ensureAuthenticated, updateName);

module.exports = router;
