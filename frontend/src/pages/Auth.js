import React, { Component } from "react"
import "./Auth.css"
import AuthContext from "../context/auth-context"

class AuthPage extends Component {
    state = {
        isLogin: true
    }

    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.email = React.createRef();
        this.password = React.createRef();
    }
    switchModeHandler = () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin};
        });
    }
    submitHandler = (e) => {
        e.preventDefault();
        let email = this.email.current.value;
        let password = this.password.current.value;
        if (email.trim().length === 0 || password.trim().length === 0){
            return;
        }
        console.log(email, password);
        let requestBody = {
            query: `query {
                login(email: "${email}", password: "${password}"){
                    userId
                    token
                    tokenExpiration
                }
            }`
        };
        if(!this.state.isLogin){
            requestBody = {
                query: `mutation {
                    createUser(userInput: {
                        email: "${email}",
                        password: "${password}"
                    }){
                        _id
                        email
                    }
                }`
            }
        }
        fetch('http://localhost:3002/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(res => {
            if (res.data.login.token){
                this.context.login(
                    res.data.login.token, 
                    res.data.login.userId,
                    res.data.login.tokenExpiration
                );
            }
            console.log(res);
            alert("Login successful!");
        })
        .catch(err => {
            alert(err);
        });
        this.email.current.value = "";
        this.password.current.value = "";
    }

    render() {
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label for="email">Email</label>
                    <input type="email" id="email" ref={this.email}/>
                </div>
                <div className="form-control">
                    <label for="password">Password</label>
                    <input type="password" id="password" ref={this.password}/>
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? "SignUp": "SignIn"}</button>
                </div>
            </form>
        );
    }
}

export default AuthPage;
