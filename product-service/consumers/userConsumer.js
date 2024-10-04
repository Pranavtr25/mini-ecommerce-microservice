const { userConsumer } = require('../config/kafka');
const User = require('../models/user');

const consumeUserRegistration = async () => {
  try {
    await userConsumer.subscribe({ topic: 'user-registration', fromBeginning: true });

    await userConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const userData = JSON.parse(message.value.toString());
        const { userId, username, email } = userData;

        const userExists = await User.findOne({ _id: userId });
        if (!userExists) {
          const newUser = new User({ _id: userId, username, email });
          await newUser.save();
          console.log('User added to cart-service database');
        } else {
          console.log('User already exists in cart-service database');
        }
      },
    });
  } catch (error) {
    console.error('Error in user consumer:', error);
  }
};

module.exports = { consumeUserRegistration };
