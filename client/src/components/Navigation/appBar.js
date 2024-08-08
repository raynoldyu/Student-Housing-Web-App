import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useUserAuth } from '../../contexts/AuthContext';
import { auth } from '../Firebase/config';
import Badge from '@mui/material/Badge';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SwipeIcon from '@mui/icons-material/Swipe';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import PostAddIcon from '@mui/icons-material/PostAdd';


function ResponsiveAppBar() {
  const navigate = useNavigate();

  const { user, userData, logOut, numMatches, setNumMatches } = useUserAuth();

  const [pages, setPages] = React.useState([]); //the pages we want to display in the navbar
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [userDropDown, setUserDropDown] = React.useState(['Login']);
  
  const userFirstName = sessionStorage.getItem('firstName');

  React.useEffect(() => {
    const userRole = userData[0]?.userRole
    if (userRole === 'Landlord') {
      const pagesObj = [
        { name: 'Listings', icon: <HomeIcon /> },
        { name: 'Students', icon: <SchoolIcon /> },
        { name: 'My Postings', icon: <PostAddIcon /> },
        { name: 'Match Maker', icon: <SwipeIcon /> },
        { name: 'Matches', icon: <HandshakeIcon /> },
      ];
      setPages(pagesObj);

    } else if (userRole === 'Student') {

      const pagesObj = [
        { name: 'Listings', icon: <HomeIcon /> },
        { name: 'Shortlist', icon: <BookmarksIcon /> },
        { name: 'Match Maker', icon: <SwipeIcon /> },
        { name: 'Matches', icon: <HandshakeIcon /> },
      ];
      setPages(pagesObj);
    }
  }, []);

  React.useEffect(() => {
    

    const userRole = userData[0]?.userRole
    if (userRole === 'Landlord') {
      getNumberOfLandlordMatches().then((data) => {setNumMatches(JSON.parse(data.express).length)})
      const pagesObj = [
        { name: 'Listings', icon: <HomeIcon /> },
        { name: 'Students', icon: <SchoolIcon /> },
        { name: 'My Postings', icon: <PostAddIcon /> },
        { name: 'Match Maker', icon: <SwipeIcon /> },
        { name: 'Matches', icon: <HandshakeIcon /> },
      ];
      setPages(pagesObj);
    } else if (userRole === 'Student') {
      getNumberOfStudentMatches().then((data) => {setNumMatches(JSON.parse(data.express).length)})
      const pagesObj = [
        { name: 'Listings', icon: <HomeIcon /> },
        { name: 'Shortlist', icon: <BookmarksIcon /> },
        { name: 'Match Maker', icon: <SwipeIcon /> },
        { name: 'Matches', icon: <HandshakeIcon /> },
      ];
      setPages(pagesObj);
    } else {
      setPages([]);
    }
  }, [userData]);

  //if logged in already set the drop down menu to have logout, otherwise set it as log in
  React.useEffect(() => {
    if (user) {
      setUserDropDown(['Logout']);
    } else {
      //What to change when user logs out
      setUserDropDown(['Login']);
    }
  }, [user]);

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDropDownButtons = async setting => {
    //if the menuitem they clicked is login go to signup/login page
    if (setting == 'Login') {
      navigate(`/SignIn`);
    } else if (setting == 'Logout') {
      try {
        await logOut();
        setPages(['']);
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const getNumberOfLandlordMatches = async () => {
    const url = '/api/getLandlordMatches';
    const userToken = sessionStorage.getItem('userToken');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken,
      },
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  const getNumberOfStudentMatches = async () => {
    const url = '/api/getStudentMatches';
    const userToken = sessionStorage.getItem('userToken');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken,
      },
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  return (
    <AppBar position="static" sx={{backgroundColor: 'black'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>


          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(page => (
              <Button
                key={page.name}
                onClick={() => navigate(`/${page.name}`)}
                sx={{ my: 2, color: 'white', display: 'block', ':hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              }, }}
              >
                <Box display="flex" alignItems="center">
                  {page.name === 'Matches' ? (
                    <Badge badgeContent={numMatches} color="error">
                      <HandshakeIcon />
                    </Badge>
                  ) : page.icon}
                  <Typography variant="button" component="div" style={{ marginLeft: '5px' }}>
                    {page.name}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Box>

          <Box
            sx={{
              flexGrow: 0,
              display: {
                marginLeft: 'auto',
                paddingRight: '16px',
                xs: 'none',
                md: 'flex',
              },
            }}
          >
            <h2 style={{color: 'white'}}>Welcome Back, {userFirstName}!</h2>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userDropDown.map(setting => (
                <MenuItem key={setting}>
                  <Button
                    onClick={() => handleDropDownButtons(setting)}
                    textAlign="center"
                  >
                    {setting}
                  </Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
