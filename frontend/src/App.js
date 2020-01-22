import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom"

import MainNavigation from "./components/Navigation/MainNavigation"
import AuthPage from  "./pages/Auth"
import Events from  "./pages/Events"
import Booking from  "./pages/Booking"
import AuthContext from "./context/auth-context"


class App extends React.Component {

  state = {
    token: null,
    userId: null,
    tokenExpiration: 1
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({
      token: token,
      userId: userId,
      tokenExpiration: tokenExpiration
    });
  }

  logout = () => {
    this.setState({
      token: null,
      userId: null
    });
  }

  render() {
    return (
      <Router>
        <AuthContext.Provider value={{ token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout }}>
          <MainNavigation />
            <main className="main-content">
              <Switch>
                {!this.state.token && <Redirect from="/" to="/auth" exact/>}
                { this.state.token && <Redirect from="/" to="/events" exact/>}
                { this.state.token && <Redirect from="/auth" to="/events" exact/>}
                {!this.state.token && <Route path="/auth" component={AuthPage} />}
                <Route path="/events" component={Events} />
                {this.state.token && <Route path="/bookings" component={Booking} />}
              </Switch>
            </main>
        </AuthContext.Provider>
      </Router>
    );
  }
}

export default App;
