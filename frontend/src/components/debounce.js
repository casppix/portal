import {useState, useEffect} from 'react';

// this is created to delay requests to database during search

const useDebounce = (val, delay) => {
    const [debounceVal, setDebounceVal] = useState(val);

    useEffect(() => {
        const handler = setTimeout(()=>{
            setDebounceVal(val);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [val]);
    return debounceVal;
};

export default useDebounce;
