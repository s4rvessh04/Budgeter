import { useContext, useEffect, useState } from 'react';

import { UserContext } from 'context';

export const useFetcher = ({
  url,
  method = 'GET',
  headers = null,
  body = null,
}) => {
  const [token] = useContext(UserContext);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const makeRequest = async () => {
      setLoading(true);
      try {
        const requestOptions = {
          method: method,
          headers: headers
            ? headers
            : {
                'Content-Type': 'application/json',
                allow_redirects: true,
                Authorization: 'Bearer ' + token,
              },
          body: body,
        };
        const response = await fetch(url, requestOptions);
        if (response.ok) {
          setData(await response.json());
        } else {
          setErrorMessage(await response.json().detail);
        }
      } catch (err) {
        console.error(err);
        console.log('Error Occured');
      } finally {
        setLoading(false);
      }
    };

    if (token) makeRequest();

    return () => setData([]);
  }, [token, url, body, headers, method]);

  return { data, errorMessage, isLoading };
};
