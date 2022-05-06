import { generateRandomString, pkce_challenge_from_verifier } from './random'

let authCode
let accessToken
let state 
const redirectURI = process.env.REACT_APP_REDIRECT_URI_LOCALHOST
const scope = process.env.REACT_APP_EXPANDED_SCOPE

const Spotify = {

    getAccessToken() {
        // return this.getImplicitToken()
        return this.getCodeToken()
    },

    getImplicitToken() {
        if (accessToken) {
            return accessToken
        }
        if (this.parseWindow()) { 
            return this.parseWindow()                  
        } else {
            window.location = `https://accounts.spotify.com/authorize?response_type=token&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=${scope}&redirect_uri=${redirectURI}`
            return this.parseWindow()    
        }             
    },

    getCodeToken() {
        if (accessToken) {
            return accessToken
        } else {
            authCode = this.getAuthCode()

        }           
    },

    getAuthCode() {
        console.log('state ', this.getAuthState())
        if (this.parseWindow()) { 
            return this.parseWindow()                  
        } else {
            console.log('state inside else ', this.getAuthState())
            window.location = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=${scope}&state=${this.getAuthState()}&redirect_uri=${redirectURI}`
            return this.parseWindow()    
        }  
    },

    getProfileInfo() {
        const accessToken = this.getAccessToken()
        const headers = { Authorization : `Bearer ${accessToken}` }

        return fetch('https://api.spotify.com/v1/me',{headers : headers}
        ).then(response => response.json()
            ).then(jsonResponse => {
                return jsonResponse
            })
    },

    parseWindow() {
        const authCodeMatch = window.location.href.match(/code=([^&]*)/)
        const authStateMatch = window.location.href.match(/state=([^&]*)/)
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
        if (authCodeMatch && authStateMatch) {
                console.log('state in the parse ', state)
                console.log('authStateMatch ',authStateMatch[1])
                authCode = authCodeMatch[1]
                return authCode

        }
        if (accessTokenMatch && expiresInMatch) { 
            accessToken = accessTokenMatch[1]
            const expiresIn = Number(expiresInMatch[1])
            window.setTimeout(() => accessToken = '', expiresIn * 1000)
            window.history.pushState("Access Token", null, "/")
            return accessToken  
        }     
    },

    getAuthState() {
        if (!state) {
            state = generateRandomString()
        }
        return state
    },

    hasAccessToken() {
        if (accessToken) {
            return true
        } else if (this.parseWindow()) {
            return true
        } else {
            return false
        }
    }
}

export default Spotify