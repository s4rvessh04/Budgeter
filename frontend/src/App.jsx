import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Login, SignUp, User, Settings } from 'pages';
import { UserContext } from 'context/UserContext';

function App() {
  const [, , isAuthenticated] = useContext(UserContext);
  return (
    <>
      <div className='subpixel-antialiased font-inter bg-gray-100'>
        <Switch>
          <Route
            path='/'
            exact
            render={() => <h1 className='text-center text-9xl'>Homepage</h1>}
          />
          <Route path='/login'>
            {!isAuthenticated ? <Login /> : <Redirect to='/user' />}
          </Route>
          <Route path='/signup'>
            {!isAuthenticated ? <SignUp /> : <Redirect to='/user' />}
          </Route>
          <Route path='/user'>{isAuthenticated && <User />}</Route>
          <Route path='/settings'>{isAuthenticated && <Settings />}</Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
