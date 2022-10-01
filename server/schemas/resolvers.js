const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findById(context.user._id);
            }
            throw new AuthenticationError('You must be logged in!');
        }
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne( {email} );

            if (!user) {
                throw new AuthenticationError('There is no user found with this email!');
            }

            const correctPassword = await User.isCorrectPassword(password);

            if (!correctPassword) {
                throw new AuthenticationError('Password Incorrect!');
            }

            const token = signToken(user);
            return { token, user };
        },
        addBook: {

        },
        removebook: {

        }
    }
};

module.exports = resolvers;