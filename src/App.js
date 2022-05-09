
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import Spotify from './Spotify.js'
import Login from './Login.js';
import UserProfile from './UserProfile/UserProfile';
import ProfilePic from './icons/default_profile96.png'
import './App.css';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profilePic, setProfilePic] = useState(ProfilePic)
  const [userName, setUserName] = useState('')


  const login = () => {
    Spotify.getAccessToken()
    .then(() => {
      if (Spotify.hasAccessToken()) {
      setIsLoggedIn(true)
      }
    })
  }

  const getProfileInfo = () => {
    Spotify.getProfileInfo().then(user => {
      if (user.images.length) {
        setProfilePic(user.images[0].url)
      }
      setUserName(user.display_name)
    })
  }

    // useEffect(() => {
      // Spotify.getAuthCode()
    // }, [])

  return (
    <Routes >
        <Route >
          <Login login={login} />
        </Route>

        <Route >
          <UserProfile 
            getProfileInfo={getProfileInfo}
            profilePic={profilePic}
            userName={userName}
          /> 
        </Route>
    </Routes>

  );
}

export default App;
