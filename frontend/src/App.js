import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import Welcome from './layouts/Welcome';
import Home from './layouts/Home';
import Helmet from 'react-helmet';
import Capture from './layouts/Capture';
import Result from './layouts/Result';
import Loading from './layouts/Loading';
import Redirection from './routing/Redirection';

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
            <PublicRoute exact path="/" component={Welcome} />
            <PublicRoute exact path="/home" component={Home}/>
            <PublicRoute path="/capture" component={Capture} />
            <PublicRoute path="/redirect" component={Redirection} />
            <PublicRoute path="/loading" component={Loading} />
            <PublicRoute path="/result" component={Result}/>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
