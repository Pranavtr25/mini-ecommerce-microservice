const { cartConsumer } = require('../config/kafka'); // Assuming kafka config has cartConsumer
const Cart = require('../models/cart');

const consumeCartClear = async () => {
  try {
    // Ensure the consumer is connected before running
    await cartConsumer.connect();
    console.log("Cart Consumer Connected");
    
    await cartConsumer.subscribe({ topic: 'cart-clear', fromBeginning: false });
    console.log("Subscribed to cart-clear topic");

    await cartConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const parsedMessage = JSON.parse(message.value.toString());
        const { userId } = parsedMessage;

        console.log(`Consumed message: ${JSON.stringify(parsedMessage)}`);

        // Empty the cart for the user in MongoDB
        const updatedCart = await Cart.findOneAndUpdate(
          { userId }, 
          { $set: { products: [] } },
          { new: true }
        );

        if (updatedCart) {
          console.log(`Cart cleared for userId: ${userId}`);
        } else {
          console.log(`No cart found for userId: ${userId}`);
        }
      },
    });
  } catch (error) {
    console.error('Error in cart consumer:', error);
  }
};

module.exports = { consumeCartClear };
