
import { useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Spotify from './Spotify.js'
import Login from './Login.js';
import UserProfile from './UserProfile/UserProfile';
import ProfilePic from './icons/default_profile96.png'
import './App.css';

function App() {

  const [authStatus, setAuthStatus] = useState('gate')
  const [profilePic, setProfilePic] = useState(ProfilePic)
  const [userName, setUserName] = useState('')

  const authorize = () => {
    if (authStatus === 'token') {
      return <Redirect to='/profile' />
    }
    Spotify.getAuthCode()
    if (Spotify.hasAuthCode()) {
      login()
    }
  }

  const login = () => {
    Spotify.getAccessToken()
    .then(() => {
      if (Spotify.hasAccessToken()) {
      setAuthStatus('token')
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

  return (
    <Router >

        <Route exact path='/'>
          <Login 
            authorize={authorize} 
            authStatus={authStatus} 
          />
        </Route>

        <Route 
          path='/callback/' 
          component={authorize}
        />

        <Route path='/profile' >
          <UserProfile 
            getProfileInfo={getProfileInfo}
            profilePic={profilePic}
            userName={userName}
          /> 
        </Route>
    </Router>

  );
}

export default App;
