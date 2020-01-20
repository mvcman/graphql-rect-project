const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return  { 
            ...user._doc, 
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    }catch(err){
        throw err;
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: {$in: eventIds }});
        const allEvents = await events.map(event => {
            return { 
                ...event._doc, 
                date: new Date(event._doc.date).toISOString(), 
                creator: user.bind(this, event.creator)
            };
        });  
        return allEvents;
    }catch (err){
        throw err;
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            creator: user.bind(this, event.creator)
        }
    }catch (err) {
        throw err;
    }
}

module.exports = {
    events: async () => {
        try {
            const events = Event.find().populate('creator');
            const allEvents = await events.map(event => {
                return { 
                    ...event._doc, 
                    date: new Date(event._doc.date).toISOString(), 
                    creator: user.bind(this, event._doc.creator)
                };
            });
            return allEvents;
        }catch(err){
            throw err;
        }
    },
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
    createEvent: async args => {
        let createdEvent;
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5e254b9f1fa6c53a6e516caa'
        });
        try {
            const result1 = await event.save();
            createdEvent = { 
                ...result1._doc,
                date: new Date(event._doc.date).toISOString(), 
                creator: user.bind(this, result1._doc.creator) 
            };
            const creator = await User.findById('5e254b9f1fa6c53a6e516caa');

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
    },
    booking: async () => {
        try {
            const bookings = await Booking.find();
            const allBookings = await bookings.map(booking => {
                return { 
                    ...booking._doc,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                };
            });
            return allBookings;
        }catch (err) {
            throw err;
        }
    },
    bookEvent: async args => {
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            const booking = await new Booking({
                user: '5e254b9f1fa6c53a6e516caa',
                event: fetchedEvent
            });
            const bookingResult = await booking.save();
            return {
                ...bookingResult._doc,
                user: user.bind(this, bookingResult._doc.user),
                event: singleEvent.bind(this, bookingResult._doc.event),
                createdAt: new Date(bookingResult._doc.createdAt).toISOString(),
                updatedAt: new Date(bookingResult._doc.updatedAt).toISOString()
            };
        }catch (err) {
            throw err;
        }
    },
    cancelBooking: async args => {
        try {
            const getBooking = await Booking.findById(args.bookingId).populate('event');
            if (!getBooking){
                throw new Error('No such booking available!');
            }
            const bookedEvent = {
                ...getBooking.event._doc,
                creator: user.bind(this, getBooking.event._doc.creator)
            }
            await Booking.deleteOne({ _id: args.bookingId });
            return bookedEvent;
        }catch (err) {
            throw err;
        }
    }
}