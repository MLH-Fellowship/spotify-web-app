import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import Login from './pages/Login'
import Home from './pages/Home'
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
            <PublicRoute path="/login" component={Login} />

            <PrivateRoute exact path="/" component={Home}/>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
