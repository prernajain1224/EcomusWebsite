import { useState, useCallback } from "react";

export default function useSubmit(apiMethod) {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [data, setData] = useState({});

  const makeRequest = useCallback(
    async (requestData) => {
      setIsSubmitLoading(true);
      setSubmitError(null);
      try {
        const response = await apiMethod(requestData);
        setData(response);
      } catch (err) {
        setSubmitError(err);
      }
      setIsSubmitLoading(false);
    },
    [apiMethod],
  );

  return { makeRequest, data, isSubmitLoading, submitError };
}
