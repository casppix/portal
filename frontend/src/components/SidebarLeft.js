import React, {useContext, useEffect, useState} from "react";
import { axiosInstance } from "./axios";
import SearchQueryContext from "./contexts/SearchContext";

const SidebarLeft = () => {
    const [genres, setGenres] = useState([]);
    const [totalReviewCount, setTotalReviewCount] = useState(0);
    const { setSelectedGenre } = useContext(SearchQueryContext);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axiosInstance.get('http://localhost:8000/portal/genre');
                //setGenres(response.data);
                setGenres(response.data.filter(genre => genre.reviews_count > 0));
                if (response.data.length > 0) {
                    setTotalReviewCount(response.data[0].reviews_all_count);
                }
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        fetchGenres();
    }, []);

    return (
        <div>
            <h2>Browse by genre</h2>
            <div onClick={() => setSelectedGenre("")} style={{ cursor: 'pointer', marginBottom: '10px' }}>
                All reviews [{totalReviewCount}]
            </div>
            {genres.map(genre => (
                <div key={genre.id} onClick={() => setSelectedGenre(genre.name)} style={{ cursor: 'pointer', marginBottom: '5px' }}>
                    {genre.name} [{genre.reviews_count}]
                </div>
            ))}
        </div>
    );
};

export default SidebarLeft;