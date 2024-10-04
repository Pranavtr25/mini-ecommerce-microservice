const { cartConsumer } = require('../config/kafka');
const Cart = require('../models/cart');

const consumeCartUpdate = async () => {
  try {
    await cartConsumer.subscribe({ topic: 'cart-update', fromBeginning: true });

    await cartConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const cartData = JSON.parse(message.value.toString());
        const { userId, products } = cartData;

        console.log(`Received cart data in consumer: ${JSON.stringify(cartData)}`);

        let userCart = await Cart.findOne({ userId });
        if (!userCart) {
          userCart = new Cart({ userId, products });
          await userCart.save();
          console.log('Cart created for user in order-service database');
        } else {
          userCart.products = products;
          await userCart.save();
          console.log('Cart updated in order-service database');
        }
      },
    });
  } catch (error) {
    console.error('Error in cart consumer:', error);
  }
};

module.exports = { consumeCartUpdate };
