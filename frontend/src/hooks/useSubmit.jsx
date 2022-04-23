import { useContext, useState } from 'react';

import { UserContext } from 'context';

export const useSubmit = ({
  url,
  method = 'POST',
  headers = null,
  body = null,
}) => {
  const [token] = useContext(UserContext);
  const [data, setData] = useState(null);

  const defaultRequestParams = {
    method: method,
    headers: headers
      ? headers
      : {
          'Content-Type': 'application/json',
          allow_redirects: true,
          Authorization: 'Bearer ' + token,
        },
    body: JSON.stringify(body),
  };

  const submitRequest = async () => {
    await token;
    const response = await fetch(url, defaultRequestParams);
    const data = await response.json();

    if (response.ok) setData(data);

    return { response, data };
  };
  return { submitRequest, data };
};
