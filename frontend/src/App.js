import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Header from './components/Header';
import {useContext} from "react";
import AuthContext from "./components/contexts/AuthContext";
import Register from "./components/Register";
import AddReview from "./components/AddReview";
import BrowseReview from "./components/BrowseReview";
import UserReviews from "./components/UserReviews";

function App() {
    const { user } = useContext(AuthContext);
  return (
    <div className="App">
      <Router>
          <Header/>
          <Routes>
              <Route exact path="/" element={<Home/>}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/register" element={user ? <Navigate to="/" /> : <Register />}/>

              <Route path="review/add" element={<AddReview/>}/>
              <Route path="review/:reviewId" element={<BrowseReview />} />
              <Route path="user/:reviewUser" element={<UserReviews />} />
          </Routes>

      </Router>
    </div>
  );
}

export default App;