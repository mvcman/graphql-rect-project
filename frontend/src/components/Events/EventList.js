import React from "react"

const EventItem = ({ index, event, userId, showEvent }) => {
    return (
        <li key={index} className="event-list-item">
            <div>
                <h1>{event.title}</h1>
                <h2>Price: ${event.price} - {new Date(event.date).toLocaleDateString()}</h2>
            </div>
            <div>   
                { 
                    userId !== event.creator._id ?
                    <button className="btn" onClick={showEvent.bind(this, event._id)}>View Details</button>:
                    <p>You are the owner of this event</p>
                }
            </div>
        </li>
    );
}

export default EventItem;