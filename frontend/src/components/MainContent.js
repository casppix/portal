import React, {useState, useEffect, useContext} from "react";
import { axiosInstance } from "./axios";
import SearchQueryContext from "./contexts/SearchContext";
import useDebounce from "./debounce";
import {Link} from "react-router-dom";
import "./MainContent.css";
import "./Home.css";
import CommentIcon from '@mui/icons-material/Comment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useNavigate} from "react-router-dom";
import AuthContext from "./contexts/AuthContext";

const MainContent = () => {
    const [reviews, setReviews] = useState([]);
    const { searchQuery, selectedGenre } = useContext(SearchQueryContext);
    const debounce = useDebounce(searchQuery,500) // here we set time delay; 500 = half a second
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchReviews = async () => {

            let endpoint;
            if (selectedGenre) {
                endpoint = `http://localhost:8000/portal/search_genre?search=${selectedGenre}`;
            } else {
                endpoint = `http://localhost:8000/portal/review?search=${searchQuery}`;
            }
            try {
                const response = await axiosInstance.get(endpoint);
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [selectedGenre, debounce]);  // [selectedGenre, searchQuery] if debounce not in program!

    const handleAddReviewClick = () => {
    if (user) {
      navigate("/review/add"); // does not work - to use we need to pass context to Login.js page
    } else {
      navigate("/login");
    }
  };

    return (
        <div class="main-content">
            <div class="reviewHeader">
                <h1>Reviews</h1>
                <div className="button" onClick={handleAddReviewClick}>
                    Add Review
                </div>
            </div>

                {reviews.map((review) => (
                    <Link key={review.id} to={`/review/${review.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div class="reviewBody">
                            <div class="reviewListHeader">
                                <div class="reviewAuthor"><AccountCircleIcon fontSize="small"/>{review.host.email}</div>
                                {review.timesinceCreated} ago
                            </div>
                            <div class="reviewListContent">
                                <p>{review.name}</p>
                            </div>
                            <div class="reviewListMeta">
                                <div class="reviewComment"><CommentIcon fontSize="small"/>{review.comments_count}</div>
                                <p class="reviewListGenre">{review.genre.name}</p>
                            </div>
                        </div>
                    </Link>
                ))}

        </div>
    );
};

export default MainContent;
