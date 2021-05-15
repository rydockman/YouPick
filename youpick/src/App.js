import './Bootstrap.min.css';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home } from './components/Home'
import { Login } from './components/Login'
import { SignUp } from './components/SignUp'
import { UserProfile } from './components/UserProfile'
import { FarmerProfile } from './components/FarmerProfile'
import { FarmForm } from './components/FarmForm'
import { NavMenu } from './components/NavMenu'
import './App.css';

class App extends Component {
render() {
    const App = () => (
      <div>
        <NavMenu/>
        <Switch>
          <Route exact path = '/' component={Home}/>
          <Route path = '/login' component={Login}/>
          <Route path = '/signup' component={SignUp}/>
          <Route path = '/userprofile' component={UserProfile}/>
          <Route path = '/farmerprofile' component={FarmerProfile}/>
          <Route path = '/farmform' component={FarmForm}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;
