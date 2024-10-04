const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://localhost'; 

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    return { connection, channel };
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
}

module.exports = connectRabbitMQ;
