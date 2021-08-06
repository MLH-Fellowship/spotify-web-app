import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import Welcome from './layouts/Welcome';
import Login from './layouts/Login';
import Home from './layouts/Home';
import Helmet from 'react-helmet';

import PrivateRoute from './routing/PrivateRoute';
import PublicRoute from './routing/PublicRoute';

import './App.css';

function App() {  
  return (
    <div className="App">
      <Helmet>
          <title>SpotiME</title>
      </Helmet>
      <Router>
        <Switch>
            <PublicRoute path="/login" component={Welcome} />
            <PrivateRoute exact path="/" component={Home}/>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
