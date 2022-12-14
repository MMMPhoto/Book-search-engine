const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // Query to see if logged in and view user's profile
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findById(context.user._id);
            }
            throw new AuthenticationError('You must be logged in!');
        }
    },
    Mutation: {
        // Create new user
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return {token, user};
        },
        // Log in user
        login: async (parent, { email, password }) => {
            const user = await User.findOne( {email} );

            if (!user) {
                throw new AuthenticationError('There is no user found with this email!');
            }
            console.log(user);

            const correctPassword = await user.isCorrectPassword(password);

            if (!correctPassword) {
                throw new AuthenticationError('Password Incorrect!');
            }

            const token = signToken(user);
            console.log(token);
            return { token, user };
        },
        // Add Book to user's favorites
        addBook: async (parent, { bookData }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookData }},
                    {
                        new: true,
                        runValidators: true
                    }
                );
            };
            throw new AuthenticationError('You must be logged in!');
        },
        // Remove Book from user's favorites
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId }}},
                    { new: true }
                );
            };
            throw new AuthenticationError('You must be logged in!');
        }
    }
};

module.exports = resolvers;