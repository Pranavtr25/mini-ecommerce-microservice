const express = require('express');
const { 
    placeOrder,
    getOrders
 } = require('../controllers/orderController');

const router = express.Router();

router.post('/', placeOrder);

router.get('/:userId', getOrders);

module.exports = router;
