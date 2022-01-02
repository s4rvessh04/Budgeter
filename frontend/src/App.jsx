import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { ErrorPage, Login, SignUp, User, Settings, Homepage } from 'pages';
import { UserContext } from 'context/UserContext';

function App() {
  const [, , isAuthenticated] = useContext(UserContext);
  return (
    <>
      <div className='subpixel-antialiased font-inter bg-gray-100 select-none'>
        <Switch>
          <Route path='/' exact>
            {!isAuthenticated ? <Homepage /> : <Redirect to='/user' />}
          </Route>
          <Route path='/login'>
            {!isAuthenticated ? <Login /> : <Redirect to='/user' />}
          </Route>
          <Route path='/signup'>
            {!isAuthenticated ? <SignUp /> : <Redirect to='/user' />}
          </Route>
          <Route path='/user'>{isAuthenticated && <User />}</Route>
          <Route path='/settings'>{isAuthenticated && <Settings />}</Route>
          <Route path='*' component={ErrorPage} />
        </Switch>
      </div>
    </>
  );
}

export default App;
