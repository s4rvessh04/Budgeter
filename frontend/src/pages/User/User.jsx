import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { Navbar } from 'components';
import { Main } from 'pages';
import { Friends } from 'pages';
import { NewExpense } from 'pages';

export const User = () => {
  const { path, url } = useRouteMatch();

  return (
    <div className='h-screen w-screen flex'>
      <Navbar url={url} />
      <Switch>
        <Route path={path} exact component={Main} />
        <Route path={`${path}/new`} exact component={NewExpense} />
        <Route path={`${path}/friends`} exact component={Friends} />
      </Switch>
    </div>
  );
};
