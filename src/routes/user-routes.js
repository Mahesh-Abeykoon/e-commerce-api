const express = require('express');
const userController = require('../controllers/user-controller');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.post('/logoutAll', auth, userController.logoutAll);
router.get('/profile', auth, userController.getProfile);


module.exports = router;

