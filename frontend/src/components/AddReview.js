import React, {useContext, useState} from 'react';
import { axiosInstance } from "./axios";
import AuthContext from "./contexts/AuthContext";
import {useToast} from "./contexts/ToastContext";

const AddReview = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const { user } = useContext(AuthContext);
    const showToast = useToast();
    const genres = [
        'Fantasy', 'Science Fiction', 'Romance', 'Science',
        'History', 'Mystery', 'Essay', 'Travel', 'Religion',
        'Cookbook', 'Biography', 'Poetry', 'Adventure'
    ].sort();

    // ALL OPTIONS ARE ALSO DEFINED IN DJANGO PORTAL MODELS !!!
    // TO ADD NEW OPTIONS ADD THEM ALSO TO MODEL !!!
    // WILL NOT WORK IF YOU DON'T DO IT

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('http://localhost:8000/portal/review/add', {
                name: name,
                description: description,
                host: user.email,
                genre_name: genre
            });
            console.log(response.data);
            showToast("Review created successfully!", 201);
            setName('');
            setDescription('');
            setGenre('');
        } catch (error) {
            console.error('Error while publishing review:', error);
        }
    };

    return (
        <div>
            <h2>Add review</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Book name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <br/>
                <div>
                    <label htmlFor="description">Your thoughts...</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ resize: 'vertical', width: '600px', height: '300px' }}
                    />
                </div>
                <br/>
                <div>
                    <label htmlFor="genre">Genre:</label>
                    <select
                        id="genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}>
                        <option value="">Choose genre</option>
                        {genres.map((genre, index) => (
                            <option key={index} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>
                <br/>
                <button type="submit">Publish review!</button>
            </form>
        </div>
    );
};

export default AddReview;

