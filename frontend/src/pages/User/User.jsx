import React, { useState } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { Navbar } from 'components';
import { Main } from 'pages';
import { Friends } from 'pages';
import { NewExpense } from 'pages';

export const User = () => {
  const { path, url } = useRouteMatch();

  // Navbar Utils

  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768 ? true : false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  // END

  return (
    <div className='md:flex min-h-screen relative'>
      <Navbar url={url} isOpen={isOpen} toggle={toggle} />
      <Switch>
        <Route path={path} exact component={Main} />
        <Route path={`${path}/new`} exact component={NewExpense} />
        <Route path={`${path}/friends`} exact component={Friends} />
      </Switch>
    </div>
  );
};
