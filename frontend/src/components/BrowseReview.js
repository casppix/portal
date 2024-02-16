import React, {useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from "./axios";
import AuthContext from "./contexts/AuthContext";
import {useToast} from "./contexts/ToastContext";

const BrowseReview = () => {
    const [review, setReview] = useState(null);
    const [body, setBody] = useState('');
    const { reviewId } = useParams();
    const { user } = useContext(AuthContext);
    const showToast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('http://localhost:8000/portal/comment', {
                user: user.email,
                body: body,
                review: reviewId
            });
            console.log(response.data);
            showToast("Comment added successfully!", 255);

        } catch (error) {
            console.error('Error while adding comment:', error);

        }
    };

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8000/portal/review/${reviewId}/`);
                setReview(response.data);
            } catch (error) {
                console.error('Error fetching review:', error);
            }
        };

        fetchReview();
    }, [reviewId]);

    if (!review) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{review.name}</h2>
            <p>Description: {review.description}</p>
            <br/>
            <p>Genre: {review.genre.name}</p>
            <br/>
            <p>Review by: {review.host.email}</p>
            <br/>
            <h3>| Add comment |</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your comment here..."
                    required
                    disabled={!user}
                    style={{ resize: 'vertical', width: '300px', height: '200px' }}
                />
                <button type="submit" disabled={!user}>Submit</button>
            </form>

            <h3>Comments:</h3>
            {review.comments.map((comment) => (
                <div key={comment.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
                    <p>User: {comment.user.email}</p><br/>
                    <p>{comment.body}</p>

                </div>
            ))}
        </div>
    );
};

export default BrowseReview;
