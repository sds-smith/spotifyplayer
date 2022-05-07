
import { useState, useEffect } from 'react';
import Spotify from './Spotify.js'
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

  let userProfile

    if (isLoggedIn) {
      userProfile = (
        <UserProfile 
          getProfileInfo={getProfileInfo}
          profilePic={profilePic}
          userName={userName}
        />  
      ) 
    } else {
      userProfile = (
        <div>
          <h1>Please Log In</h1>
          <button onClick={login}>LOGIN</button>
        </div>
      )
    }

    useEffect(() => {
      Spotify.getAuthCode()
    }, [])

  return (
    <div className="App">
      <header className="App-header">
        { userProfile }
      </header>
    </div>
  );
}

export default App;
