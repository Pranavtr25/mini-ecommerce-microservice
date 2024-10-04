// config/kafka.js
const { Kafka, Partitioners } = require('kafkajs');

// Kafka connection
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['localhost:9092'],
});

// Producer setup
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner, // Use the legacy partitioner for backward compatibility
});

// Consumer setup for user-registration
const userConsumer = kafka.consumer({ groupId: 'order-group-user' });

// Consumer setup for cart-update
const cartConsumer = kafka.consumer({ groupId: 'order-group-cart' });

// Connect the producer
const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Kafka producer connected');
  } catch (error) {
    console.error('Error connecting producer:', error);
  }
};

// Connect the consumers
const connectUserConsumer = async () => {
  try {
    await userConsumer.connect();
    console.log('User consumer connected');
  } catch (error) {
    console.error('Error connecting user consumer:', error);
  }
};

const connectCartConsumer = async () => {
  try {
    await cartConsumer.connect();
    console.log('Cart consumer connected');
  } catch (error) {
    console.error('Error connecting cart consumer:', error);
  }
};

module.exports = {
  producer,
  userConsumer,
  cartConsumer,
  connectProducer,
  connectUserConsumer,
  connectCartConsumer
};
