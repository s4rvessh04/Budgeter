import { FC, createContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const UserContext = createContext<Array<any>>([]);

export const UserProvider: FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('userToken')
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    if (token) {
      localStorage.setItem('userToken', token);
      setIsAuthenticated(true);
    }
    setTimeout(() => {
      setIsAuthenticated(false);
      localStorage.removeItem('userToken');
      history.push('/');
    }, 1800000);
  }, [token, history]);

  const logout = (): void => {
    localStorage.setItem('userToken', '');
    setIsAuthenticated(false);
    localStorage.clear();
    history.push('/');
  };

  return (
    <UserContext.Provider
      value={[token, setToken, isAuthenticated, setIsAuthenticated, logout]}>
      {children}
    </UserContext.Provider>
  );
};
