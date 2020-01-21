const userResolver = require("./user");
const eventsResolver = require("./events");
const bookingResolver = require("./booking");

const rootResolver = {
    ...userResolver,
    ...eventsResolver,
    ...bookingResolver
};

module.exports = rootResolver;

// const bcrypt = require('bcryptjs');
// const Event = require('../../models/event');
// const User = require('../../models/user');
// const Booking = require('../../models/booking'); 
// const { dateToString } = require("../../helpers/date");

// const user = async userId => {
//     try {
//         const user = await User.findById(userId);
//         return  { 
//             ...user._doc, 
//             createdEvents: events.bind(this, user._doc.createdEvents)
//         };
//     }catch(err){
//         throw err;
//     }
// }

// const events = async eventIds => {
//     try {
//         const events = await Event.find({ _id: {$in: eventIds }});
//         return allEvents = await events.map(event => {
//             return transformEvent(event);
//         });  
//     }catch (err){
//         throw err;
//     }
// }

// const singleEvent = async eventId => {
//     try {
//         const event = await Event.findById(eventId);
//         return {
//             ...event._doc,
//             creator: user.bind(this, event.creator)
//         }
//     }catch (err) {
//         throw err;
//     }
// }

// const transformEvent = event => {
//     return { 
//         ...event._doc, 
//         date: dateToString(event._doc.date), 
//         creator: user.bind(this, event._doc.creator)
//     };
// }

// const transformBooking = booking => {
//     return { 
//         ...booking._doc,
//         user: user.bind(this, booking._doc.user),
//         event: singleEvent.bind(this, booking._doc.event),
//         createdAt: dateToString(booking._doc.createdAt),
//         updatedAt: dateToString(booking._doc.updatedAt)
//     };
// }

// module.exports = {
//     events: async () => {
//         try {
//             const events = await Event.find().populate('creator');
//             const allEvents = await events.map(event => {
//                 return transformEvent(event);
//             });
//             return allEvents;
//         }catch(err){
//             throw err;
//         }
//     },
//     createUser: async args => {
//         try {
//             const existingUser = await User.findOne({ email: args.userInput.email});

//             if (existingUser){
//                 throw new Error('User already Exists!');
//             }
//             const hash = await bcrypt.hash(args.userInput.password, 12);
//             const user = new User({
//                 email: args.userInput.email,
//                 password: hash
//             });
//             const result = await user.save();
//             return {
//                 ...result._doc, 
//                 password: null
//             };
//         }   
//         catch(err) { 
//             throw err;
//         };
//     },
//     createEvent: async args => {
//         let createdEvent;
//         const event = new Event({
//             title: args.eventInput.title,
//             description: args.eventInput.description,
//             price: +args.eventInput.price,
//             date: dateToString(args.eventInput.date),
//             creator: '5e254b9f1fa6c53a6e516caa'
//         });
//         try {
//             const result1 = await event.save();
//             createdEvent = transformEvent(result1);
//             const creator = await User.findById('5e254b9f1fa6c53a6e516caa');

//             if (!creator){
//                 throw new Error('User not exists.');
//             }

//             await creator.createdEvents.push(event);
//             await creator.save();
//             return createdEvent;
//         }
//         catch (err){ 
//             throw err;
//         }
//     },
//     booking: async () => {
//         try {
//             const bookings = await Booking.find();
//             const allBookings = await bookings.map(booking => {
//                 return transformBooking(booking);
//             });
//             return allBookings;
//         }catch (err) {
//             throw err;
//         }
//     },
//     bookEvent: async args => {
//         try {
//             const fetchedEvent = await Event.findOne({ _id: args.eventId });
//             const booking = await new Booking({
//                 user: '5e254b9f1fa6c53a6e516caa',
//                 event: fetchedEvent
//             });
//             const bookingResult = await booking.save();
//             return transformBooking(bookingResult);
//         }catch (err) {
//             throw err;
//         }
//     },
//     cancelBooking: async args => {
//         try {
//             const getBooking = await Booking.findById(args.bookingId).populate('event');
//             if (!getBooking){
//                 throw new Error('No such booking available!');
//             }
//             const bookedEvent = {
//                 ...getBooking.event._doc,
//                 creator: user.bind(this, getBooking.event._doc.creator)
//             }
//             await Booking.deleteOne({ _id: args.bookingId });
//             return bookedEvent;
//         }catch (err) {
//             throw err;
//         }
//     }
// }