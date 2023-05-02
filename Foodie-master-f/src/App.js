import React from 'react';
import LoginPage from './pages/LoginPage'
import Hotels from './pages/Hotels'
import Orders from './pages/Orders'
import Transport from './pages/Transport';
import Weather from './pages/Weather';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
      <Switch>
        <Route exact path="/" component={LoginPage}></Route>
        <Route exact path="/hotels" component={Hotels}></Route>
        <Route exact path="/order/:id" component={Orders}></Route>
        <Route exact path="/transport" component={Transport}></Route>
        <Route exact path="/weather" component={Weather}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
