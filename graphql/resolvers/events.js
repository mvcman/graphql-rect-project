const Event = require('../../models/event');
const User = require('../../models/user');

const { dateToString } = require("../../helpers/date");
const { transformEvent } = require("./merge");

module.exports = {
    events: async () => {
        try {
            const events = await Event.find().populate('creator');
            const allEvents = await events.map(event => {
                return transformEvent(event);
            });
            return allEvents;
        }catch(err){
            throw err;
        }
    },
    createEvent: async (args, req) => {
        let createdEvent;
        if (!req.isAuth){
            throw new Error('Unauthenticated!');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: req.userId
        });
        try {
            const result1 = await event.save();
            createdEvent = transformEvent(result1);
            const creator = await User.findById(req.userId);

            if (!creator){
                throw new Error('User not exists.');
            }

            await creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        }
        catch (err){ 
            throw err;
        }
    }
}