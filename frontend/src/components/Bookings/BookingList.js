import React from "react"
import "./BookingList.css"

const bookingList = props => {
    return (
        <ul className="booking__list">
            {
                props.bookings.map(booking => {
                    return (
                        <li key={booking._id} className="booking__item">
                            <div className="booking__item-data">
                                {booking.event.title} - {' '}
                                { new Date(booking.createdAt).toLocaleDateString()}
                            </div>
                            <div className="booking__item-action">
                                <button onClick={props.cancelBooking.bind(this, booking._id)} className="events-btn">Cancel</button>
                            </div>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default bookingList;