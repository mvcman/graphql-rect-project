const Event = require('../../models/event');
const Booking = require('../../models/booking'); 
const { transformBooking, user } = require("./merge");

module.exports = {
    booking: async (res, req) => {
        console.log("My request Auth ", req.isAuth);
        if (!req.isAuth){
            throw new Error('Unauthenticated!');
        }
        try {
            const bookings = await Booking.find({ user: req.userId });
            const allBookings = await bookings.map(booking => {
                return transformBooking(booking);
            });
            return allBookings;
        }catch (err) {
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth){
            throw new Error('Unauthenticated!');
        }
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            console.log(fetchedEvent);
            const booking = await new Booking({
                user: req.userId,
                event: fetchedEvent
            });
            const bookingResult = await booking.save();
            return transformBooking(bookingResult);
        }catch (err) {
            throw err;
        }
    },
    cancelBooking: async (args, req) => {
        if (!req.isAuth){
            throw new Error('Unauthenticated!');
        }
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