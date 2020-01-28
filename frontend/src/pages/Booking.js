import React, { Component } from "react"
import AuthContext from "../context/auth-context"
import Spinner from "../components/spinner/spinner"
import BookingList from "../components/Bookings/BookingList"

class Booking extends Component {
    state = {
        isLoading: false,
        bookings: [],
    }

    static contextType = AuthContext;

    componentDidMount = async () => {
        console.log("my context is =", this.context);
        await this.fetchBookings();
    }

    fetchBookings = () => {
        console.log(this.context);
        const requestBookings = {
            query: `query {
                booking {
                    _id
                    createdAt
                    event {
                        _id
                        title
                        date
                    }
                }
            }`
        };

        this.setState({
            isLoading: false
        });

        fetch('http://localhost:3002/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBookings),
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
                bookings: res.data.booking,
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

    cancelBooking = (bookingId) => {
        const cancelBookings = {
            query: `mutation {
                cancelBooking(bookingId: "${bookingId}") {
                    _id
                    title
                }
            }`
        };
        this.setState({
            isLoading: true
        });
        fetch('http://localhost:3002/graphql', {
            method: 'POST',
            body: JSON.stringify(cancelBookings),
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
                const updatedBooking = prevState.bookings.filter(booking => {
                    return booking._id !== bookingId;
                });
                return {
                    bookings: updatedBooking, isLoading: false
                };
            });
        })
        .catch(err => {
           console.log(err);
           this.setState({
               isLoading: false
           });
        });

    }

    render() {
        return (
            <React.Fragment>
                { this.state.isLoading ? 
                <Spinner ></Spinner> :
                <BookingList bookings={this.state.bookings} cancelBooking={this.cancelBooking}/>
                }
            </React.Fragment>
        );
    }
}

export default Booking;
