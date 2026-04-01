import { useState, useEffect } from "react";
const useFetch = (apiMethod, data = {}, useEffectDependenices = []) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [serverError, setServerError] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await apiMethod(data);
      setApiData(result);
      setIsLoading(false);
    } catch (error) {
      setServerError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, useEffectDependenices);

  return { isLoading, apiData, serverError };
};

export default useFetch;
