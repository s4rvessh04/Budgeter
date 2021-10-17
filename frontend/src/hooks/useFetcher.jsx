import { useContext, useEffect, useState } from 'react';

import { UserContext } from 'context';

export const useFetcher = ({ url, requestOptions = null }) => {
  const [token, setToken, , setIsAuthenticated] = useContext(UserContext);
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const makeRequest = async () => {
      const defaultRequestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          allow_redirects: true,
          Authorization: 'Bearer ' + token,
        },
      };
      const response = await fetch(
        url,
        requestOptions === null ? defaultRequestOptions : requestOptions
      );
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.detail);
        localStorage.setItem('userToken', null);
        setToken(null);
        setIsAuthenticated(false);
      } else setData(data);
    };
    if (token) makeRequest();

    return () => setData(null);
  }, [token, url, requestOptions, setIsAuthenticated, setToken]);

  return { data, errorMessage };
};
