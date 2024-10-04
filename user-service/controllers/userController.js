const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const connectRabbitMQ = require('../config/rabbitmq');
// const amqp = require('amqplib');

const { Kafka } = require('kafkajs');

// Initialize Kafka client and producer
const kafka = new Kafka({ clientId: 'userService', brokers: ['localhost:9092'] });
const producer = kafka.producer();

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Send Kafka message with user data, excluding password
    await producer.connect();
    const message = JSON.stringify({ userId: newUser._id, username, email });
    await producer.send({
      topic: 'user-registration',
      messages: [{ value: message }],
    });
    console.log('User registration message sent to Kafka.');

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
        userId: user._id
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const kafka1 = new Kafka({ clientId: 'cartService', brokers: ['localhost:9092'] });
const consumer = kafka1.consumer({ groupId: 'cart-group' });

const dummy = async (req, res) => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'user-registrations', fromBeginning: true });

    console.log('Waiting for messages in user-registrations...');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const userInfo = JSON.parse(message.value.toString());
        console.log('Received user info:', userInfo);
      },
    });

    res.send('sucesssssssssssssssssssssssss.');
  } catch (error) {
    console.error(`error : ${error}`)
  }
}

module.exports = {
  registerUser,
  loginUser,
  dummy
}
