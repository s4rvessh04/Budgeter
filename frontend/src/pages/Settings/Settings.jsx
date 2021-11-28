import React, { useState } from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';

import { Navbar } from 'components';
import { Profile, Account, Security } from 'pages';

export const Settings = () => {
  const { path, url } = useRouteMatch();

  // Navbar Utils

  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768 ? true : false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  // END

  return (
    <div className='md:flex min-h-screen relative'>
      <Navbar url={url} isOpen={isOpen} toggle={toggle} type={'settings'} />
      <Switch>
        <Redirect from={path} exact to={`${path}/profile`} />
        <Route path={`${path}/profile`} component={Profile} />
        <Route path={`${path}/account`} component={Account} />
        <Route path={`${path}/security`} component={Security} />
      </Switch>
    </div>
  );
};
