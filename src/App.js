
import { useState } from 'react';
import Spotify from './Spotify.js'
import UserProfile from './UserProfile/UserProfile';
import ProfilePic from '../icons/default_profile96.png'
import './App.css';

function App() {

  const [profilePic, setProfilePic] = useState(ProfilePic)
  const [userName, setUserName] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const login = () => {
    Spotify.getAccessToken().then(setIsLoggedIn(true))
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
      <h1>Please Log In</h1>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
          <button onClick={login}>LOGIN</button>
          {userProfile}
      </header>
    </div>
  );
}

export default App;
