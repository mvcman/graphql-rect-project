const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require("jsonwebtoken");

module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email});

            if (existingUser){
                throw new Error('User already Exists!');
            }
            const hash = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hash
            });
            const result = await user.save();
            return {
                ...result._doc, 
                password: null
            };
        }   
        catch(err) { 
            throw err;
        };
    },
    login: async args => {
        try {
            const isUser = await User.findOne({ email: args.email });
            console.log(isUser);
            if (!isUser){
                throw new Error('User does not exists!');
            }
            const isEqual = await bcrypt.compare(args.password, isUser.password);
            if (!isEqual){
                throw new Error('Password is incorrect!');
            }
            const token = await jwt.sign({ userId: isUser._id, email: isUser.email}, 
                'mandarwaghe', {
                    expiresIn: '1h'
                });
            return {
                userId: isUser._id,
                token: token,
                tokenExpiration: 1
            };
        }catch (err){
            throw err;
        }
    }
}