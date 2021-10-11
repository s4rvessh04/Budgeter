import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Login } from 'pages';
import { SignUp } from 'pages';
import { User } from 'pages';

function App() {
  return (
    <>
      <div className='subpixel-antialiased font-inter bg-gray-100'>
        <Switch>
          <Route path='/signup' exact component={SignUp} />
          <Route path='/login' exact component={Login} />
          <Route path='/user' component={User} />
        </Switch>
      </div>
    </>
  );
}

export default App;
