import React, { createContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem('userToken') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (token) {
      localStorage.setItem('userToken', token);
      setIsAuthenticated(true);
    }
    setTimeout(() => {
      setIsAuthenticated(false);
      localStorage.removeItem('userToken');
      history.push('/login');
    }, 1800000);
  }, [token]);

  const logout = () => {
    localStorage.setItem('userToken', null);
    setIsAuthenticated(false);
    localStorage.clear();
    history.push('/login');
  };

  return (
    <UserContext.Provider
      value={[token, setToken, isAuthenticated, setIsAuthenticated, logout]}>
      {props.children}
    </UserContext.Provider>
  );
};
