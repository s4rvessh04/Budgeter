import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem('userToken') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('userToken', token);
      setIsAuthenticated(true);
    }
  }, [token]);

  const logout = () => {
    localStorage.setItem('userToken', null);
    setIsAuthenticated(false);
    localStorage.clear();
  };

  return (
    <UserContext.Provider
      value={[token, setToken, isAuthenticated, setIsAuthenticated, logout]}>
      {props.children}
    </UserContext.Provider>
  );
};
