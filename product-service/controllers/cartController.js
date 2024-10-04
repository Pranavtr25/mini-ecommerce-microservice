const Cart = require('../models/cart');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { producer, connectProducer } = require('../config/kafka');



const dummy = async (req, res) => {
  console.log("gfudjh")
}

const addToCart = async (req, res) => {
  const { userId, product } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ 
          ...product,
          quantity: product.quantity || 1  
        }],
      });
    } else {
      const existingProduct = cart.products.find(p => p.name === product.name);
      if (existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 0) + (product.quantity || 1);
      } else {
        cart.products.push({ 
          ...product,
          quantity: product.quantity || 1  
        });
      }
    }

    await cart.save();

    // Send updated cart (products array) to Kafka
    await producer.connect();
    const cartUpdateMessage = JSON.stringify({ userId, products: cart.products }); // Sending the entire products array
    await producer.send({
      topic: 'cart-update',
      messages: [{ value: cartUpdateMessage }],
    });
    console.log('Cart update message sent to Kafka.');

    res.status(201).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const displayCart = async (req, res) => {
  console.log("userrr reaached display cartttttttt")
  console.log("Reached display cart items controller");

  const { userId } = req.params; 

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error('Error retrieving cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  dummy,
  addToCart,
  displayCart
}
