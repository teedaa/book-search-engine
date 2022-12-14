const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models/');
const { countDocuments } = require('../models/User');

const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
  
          return userData;
        }
  
        throw new AuthenticationError('Need to be logged in');
      },
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {token,user};
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Invalid email')
            
            }

            const correctPass = await user.isCorrectPass(password);

            if(!correctPass) {
                throw new AuthenticationError('Incorrect password')
            }
            const token = signToken(user);
            return { token, user}
        },
        saveBook: async (parent, {bookData}, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: countDocuments.user._id},
                    { $push: {savedBooks: bookData }},
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('Need to be logged in!')
        }
    }
}

module.exports = resolvers;