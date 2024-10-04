const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConnect');
const { connectProducer, connectUserConsumer, connectCartConsumer } = require('./config/kafka');
const { consumeUserRegistration } = require('./consumers/userConsumer');
const { consumeCartClear } = require('./consumers/cartConsumer');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
app.use(cors());
app.use(express.json());

connectDB().then(async () => {
  try {
    await connectProducer();
    await connectUserConsumer();
    await connectCartConsumer();
    console.log('Kafka consumers running in Cart Service');

    consumeUserRegistration();
    consumeCartClear();
  } catch (err) {
    console.error('Failed to connect to Kafka:', err);
  }
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

app.use('/cart', cartRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Cart Service running on port ${PORT}`);
});
