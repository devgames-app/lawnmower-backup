import { useState } from 'react';

const useFetch = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (
    path: string,
    options: { [key: string]: unknown } = {}
  ) => {
    let response;
    let json;
    try {
      setLoading(true);
      response = await fetch(window.location.origin + path, options);
      if (!response.ok) {
        json = await response.json();
        throw new Error(json.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    return { response, json };
  };

  return { loading, fetchData };
};

export default useFetch;
