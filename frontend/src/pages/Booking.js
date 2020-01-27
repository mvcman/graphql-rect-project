import React, { Component } from "react"
import AuthContext from "../context/auth-context"

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

        // this.setState({
        //     isLoading: false
        // });

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
    render() {
        return (
            <ul>
                {this.state.bookings.map((b, i) => <li key={i}>{new Date(b.createdAt).toLocaleDateString()}</li>)}
            </ul>
        );
    }
}

export default Booking;
