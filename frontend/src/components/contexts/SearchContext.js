import React, { createContext, useState } from 'react';

const SearchQueryContext = createContext();

export const SearchQueryProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');

    return (
        <SearchQueryContext.Provider value={{ searchQuery, setSearchQuery, selectedGenre, setSelectedGenre }}>
            {children}
        </SearchQueryContext.Provider>
    );
};

export default SearchQueryContext;
