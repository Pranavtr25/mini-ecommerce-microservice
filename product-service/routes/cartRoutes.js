const express = require('express');
const router = express.Router();
const {
    dummy,
    addToCart,
    displayCart
} = require('../controllers/cartController');



router.get('/dummys', dummy);

router.post('/', addToCart);

router.get('/:userId', displayCart);

module.exports = router;
