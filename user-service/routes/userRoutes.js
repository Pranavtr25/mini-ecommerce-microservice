const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    dummy
} = require('../controllers/userController');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/dummy', dummy);

module.exports = router;
