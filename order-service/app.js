const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConnect');
const { connectProducer, connectUserConsumer, connectCartConsumer } = require('./config/kafka');
const { consumeUserRegistration } = require('./consumers/userConsumer');
const { consumeCartUpdate } = require('./consumers/cartConsumer');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(cors());
app.use(express.json());

connectDB().then(async () => {
  try {
    await connectProducer();
    await connectUserConsumer();
    await connectCartConsumer();
    console.log('Kafka consumers running in Order Service');

    consumeUserRegistration();
    consumeCartUpdate();
  } catch (err) {
    console.error('Failed to connect to Kafka:', err);
  }
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

app.use('/order', orderRoutes);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
