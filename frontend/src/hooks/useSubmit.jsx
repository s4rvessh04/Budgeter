import { useState } from 'react';

export const useSubmit = ({ url, requestOptions }) => {
  const [data, setData] = useState(null);

  const submitRequest = async () => {
    const response = await fetch(url, requestOptions);
    const data = await response.json();

    if (response.ok) setData(data);

    return { response, data };
  };
  return { submitRequest, data };
};
