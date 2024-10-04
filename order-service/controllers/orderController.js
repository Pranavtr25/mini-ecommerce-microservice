const Order = require('../models/order');
const Cart = require('../models/cart'); 
const { producer, consumer } = require('../config/kafka');

const placeOrder = async (req, res) => {
  console.log("Reached placeOrder");

  const { userId, products } = req.body;

  try {
    // Create a new order
    const newOrder = await Order.create({
      userId,
      products,
      createdAt: new Date(),
    });
    
    console.log('Order created:', newOrder);

    await Cart.findOneAndUpdate(
      { userId },
      { $set: { products: [] } }, 
      { new: true }
    );
    console.log(`Cart cleared (products array emptied) for userId: ${userId} in order-service`);

    const message = {
      userId: userId,
    };

    await producer.send({
      topic: 'cart-clear',
      messages: [{ value: JSON.stringify({ userId }) }],
    });
    console.log('Cart clear message sent to Kafka for cart-service.');

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error });
  }
};


const consumeCartUpdate = async () => {
  try {
    await consumer.connect();  
    await consumer.subscribe({ topic: 'clear-cart', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const cartData = JSON.parse(message.value.toString());
        const { userId } = cartData;

        await Cart.deleteOne({ userId });
        console.log(`Cart cleared for userId: ${userId} in order-service`);
      },
    });

    console.log('Consumer is running and listening to clear-cart messages.');
  } catch (error) {
    console.error('Error consuming cart updates:', error);
  }
};

const getOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  placeOrder,
  consumeCartUpdate,
  getOrders
};
