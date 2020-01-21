const Event = require('../../models/event');
const Booking = require('../../models/booking'); 
const { transformBooking, user } = require("./merge");

module.exports = {
    booking: async () => {
        try {
            const bookings = await Booking.find();
            const allBookings = await bookings.map(booking => {
                return transformBooking(booking);
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
            return transformBooking(bookingResult);
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