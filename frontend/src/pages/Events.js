import React, { Component } from "react"
import "./Events.css"
import Modal from "../components/modal/Modal"
import Backdrop from "../components/Backdrop/Backdrop"
import AuthContext from "../context/auth-context"
import EventItem from "../components/Events/EventList"
import Spinner from "../components/spinner/spinner"

class Events extends Component {
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null,
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleRef = React.createRef();
        this.priceRef = React.createRef();
        this.dateRef = React.createRef();
        this.descriptionRef = React.createRef();
    }

    componentDidMount = async () => {
        await this.fetchEvents();
    }

    fetchEvents = () => {
        const requestEvents = {
            query: `query {
                    events {
                    _id
                    title
                    description
                    price
                    date
                    creator {
                        _id
                        email
                    }
                }
            }`
        };

        this.setState({
            isLoading: false
        });

        fetch('http://localhost:3002/graphql', {
            method: 'POST',
            body: JSON.stringify(requestEvents),
            headers: {
                'Content-Type': 'application/json',      
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(res => {
            console.log(res);
            this.setState({
                events: res.data.events,
                isLoading: false
            });
        })
        .catch(err => {
           console.log(err);
           this.setState({
               isLoading: false
           });
        });
    }
    
    startCreateEvent = () => {
        this.setState({
            creating: true
        });
    }

    cancelModal = () => {
        this.setState({
            creating: false,
            selectedEvent: null,
        });
    }

    showEvent = (eventId) => {
        console.log(eventId);
        this.setState(prevState => {
            const selectedEv = prevState.events.find(e => e._id === eventId);
            return { selectedEvent: selectedEv };
        })
    }

    BookEventHandler = () => {
        if(!this.context.token){
            this.setState({
                selectedEvent: null
            });
            alert('You are not authorized to book event, Login first!');
            return;
        }
        const requestBody = {
            query: `mutation {
                bookEvent(eventId: "${this.state.selectedEvent._id}"){
                    _id
                    createdAt
                    updatedAt
                }
            }`
        };
        fetch('http://localhost:3002/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token            
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(res => {
            console.log(res);
            this.setState({
                selectedEvent: null
            });
            alert("Event booked successfuly!");
        })
        .catch(err => {
            console.log(err);
        });
    }

    confirmModal = async () => {
        this.setState({
            creating: false
        });
        const title = this.titleRef.current.value;
        const price = +this.priceRef.current.value;
        const date = this.dateRef.current.value;
        const description = this.descriptionRef.current.value;

        if(title.trim().length === 0 || price === null || date.trim().length === 0 || description.trim().length === 0)
        {
            return;
        }

        const requestBody = {
            query: `mutation {
                createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}" }){
                    _id
                    title
                    description
                    price
                    date
                }
            }`
        };

        fetch('http://localhost:3002/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token            
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(res => {
            console.log(res);
            this.setState(prevState => {
                const updateEvents = [...prevState.events];
                updateEvents.push({
                    _id: res.data.createEvent._id,
                    title: res.data.createEvent.title,
                    description: res.data.createEvent.description,
                    price: res.data.createEvent.price,
                    date: res.data.createEvent.date,
                    creator: {
                        _id: this.context.userId,
                    }
                });
                return { events: updateEvents };
            });
            alert("Event Added successfuly!");
        })
        .catch(err => {
            console.log(err);
        });
    }
    render() {
        console.log(this.context);
        const eventList = this.state.events.map((event, i) => <EventItem key={i} index={i} userId={this.context.userId} event={event} showEvent={this.showEvent}/>);
        return (
            <React.Fragment>
            { (this.state.creating || this.state.selectedEvent) && <Backdrop /> }
                { this.state.creating && (
                <Modal title="Create your event!" oncancel={this.cancelModal} onconfirm={this.confirmModal} confirmText="Confirm">
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.titleRef}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={this.priceRef}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="date" id="date" ref={this.dateRef}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">description</label>
                            <textarea rows="4" id="description" ref={this.descriptionRef}></textarea>
                        </div>
                    </form>
                </Modal>)}
                {
                    this.state.selectedEvent && (
                        <Modal 
                            title={this.state.selectedEvent.title} 
                            oncancel={this.cancelModal} 
                            onconfirm={this.BookEventHandler} 
                            confirmText={this.context.token ? "Book": "Confirm"}
                            >
                            <div>
                                <h1>{this.state.selectedEvent.title}</h1>
                                <h2>${this.state.selectedEvent.price} - { new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                                <p>{this.state.selectedEvent.description}</p>
                            </div>
                        </Modal>
                    )
                }
                { 
                this.context.token && (<div className="events-control">
                        <p>Share your events!</p>
                        <button className="events-btn" onClick={this.startCreateEvent}>Create a Event</button>
                    </div>)
                }
                { 
                    this.state.isLoading ? 
                    <Spinner /> :
                    <ul className="event-list">
                        {eventList}
                    </ul>
                }
            </React.Fragment>
        );
    }
}

export default Events;
