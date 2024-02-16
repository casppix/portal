import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from './contexts/AuthContext';
import Cookies from 'js-cookie';
import {alpha, InputBase, styled} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SearchQueryContext from "./contexts/SearchContext";
import "./Home.css";
import "./Header.css";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import logo from '../static/books.png';
import {useToast} from "./contexts/ToastContext";


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '35ch',
    },
  },
}));


const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useContext(SearchQueryContext);
  const showToast = useToast();

  const handleLogout = async () => {
    try {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');

      setUser(null);

      navigate('/');
      showToast("Logged out successfully", 250);
      // change status code because it is not valid!

    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header class="header">
      <div class="home-container">
        <div class="header-logo">
          <Link class="link" to="/">
            Find books for you!
          </Link>
          <img src={logo} alt="Logo" width="50" height="50"/>
        </div>
        <div class="header-search">
          <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Search>
        </div>
        <div class="header-menu">
            {user ? (
                <React.Fragment>
                <Link key={user.email} to={`/user/${user.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <PersonOutlineIcon style={{ fontSize: 50, color: 'white' }}/>
              </Link>
              <div class="button" onClick={handleLogout}>
                Logout
              </div>
              </React.Fragment>
        ) : (

            <Link to="/login">
              <div class="button">Login</div>
            </Link>
        )}
        </div>
      </div>
    </header>

  );
};

export default Header;
