import { useState } from 'react';

export const useSubmit = ({ url, requestOptions }) => {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const submitRequest = async () => {
    const response = await fetch(url, requestOptions);
    const data = await response.json();

    if (response.ok) setData(data);
    else setErrorMessage(data.detail);

    return { response, data, errorMessage };
  };
  return { submitRequest, data };
};
