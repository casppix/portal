import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {axiosInstance} from "./axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CommentIcon from "@mui/icons-material/Comment";
import "./MainContent.css"
import "./Home.css"
import AuthContext from "./contexts/AuthContext";
import DeleteIcon from '@mui/icons-material/Delete';
import {useToast} from "./contexts/ToastContext";

// this page will display all reviews for current user
// in url: /user/user_email   to try it
// works only for authenticated users !!!
// you cannot delete reviews that are not yours

const UserReviews = () => {
    const { reviewUser } = useParams();
    const [reviews, setReviews] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { user } = useContext(AuthContext);
    const showToast = useToast();

     const handleDelete = async (reviewToDeleteId, reviewOwnerEmail) => {
        try {
            if (user.email === reviewOwnerEmail) {
                const confirmed = window.confirm("Are you sure you want to delete this review?");
                if (confirmed) {
                    await axiosInstance.delete(`http://localhost:8000/portal/review/delete/${reviewToDeleteId}`);
                    setReviews(reviews.filter(review => review.id !== reviewToDeleteId));
                    showToast("Review deleted successfully", 204);
                }
            } else {
                console.log("You are not authorized to delete this review.");
                showToast("You are not authorized to delete this review!");
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8000/portal/user/${reviewUser}`);
                setReviews(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReview();
    }, [reviewUser]);

    return (
        <div class="user-content">
            <div class="reviewHeader">
                <h1>My Reviews</h1>
            </div>

                {isAuthenticated ? (
                <>
                    {reviews.map((review) => (

                            <div className="reviewBody">
                                <div className="reviewListHeader">
                                    <div className="reviewAuthor"><AccountCircleIcon fontSize="small"/>{review.host.email}</div>
                                    <DeleteIcon fontSize="large" onClick={() => handleDelete(review.id, review.host.email)}/>
                                </div>
                                <Link key={review.id} to={`/review/${review.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="reviewListContent">
                                    <p>{review.name}</p>
                                </div>
                                <div className="reviewListMeta">
                                    <div className="reviewComment"><CommentIcon fontSize="small"/>{review.comments_count}</div>
                                    <p className="reviewListGenre">{review.genre.name}</p>
                                </div>
                                </Link>
                            </div>
                    ))}
                </>
            ) : (
                <p>You need to log in to see reviews</p>
            )}

        </div>
    );
};

export default UserReviews;