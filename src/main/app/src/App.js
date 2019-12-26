import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';

class App extends Component {
  
  render() {
    return (
    <Router>
        {/* <Link to={'/about'} className="nav-link">About</Link> */}
          <Switch>
              <Route exact path='/' component={Dashboard} />
              <Route path='/signin' component={SignIn} />
          </Switch>
      </Router>
    );
  }
}

export default App;
