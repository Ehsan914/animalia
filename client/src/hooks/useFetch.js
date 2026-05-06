import { useState, useCallback } from "react";

const useFetch = () => {
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const execute = useCallback( async (fetchFunction, ...args) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await fetchFunction(...args);
            setData(result);
            return result;
        } catch (err) {
            const message = typeof err === "string" ? err : (err.message ?? "Unknown error");
            setError(message);
            throw message;
        } finally {
            setLoading(false);
        }

    }, []);

    const reset = useCallback(() => {
        setData(null);
        setLoading(false);
        setError(null);
    }, [])

    return {
        data,
        loading,
        error,
        execute,
        reset
    }
}

export default useFetch;