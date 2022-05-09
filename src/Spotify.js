import { base64urlencode } from './random'

let authCode
let accessToken
const codeVerifier = process.env.REACT_APP_AUTH_VERIFIER
const codeChallenge = process.env.REACT_APP_AUTH_CHALLENGE
const clientId = process.env.REACT_APP_CLIENT_ID
const clientSecret = process.env.REACT_APP_CLIENT_SECRET
const state = process.env.REACT_APP_AUTH_STATE
const redirectURI = process.env.REACT_APP_REDIRECT_URI_LOCALHOST
const scope = process.env.REACT_APP_EXPANDED_SCOPE

const Spotify = {

    getAccessToken() {
            const authCode = this.getAuthCode()
            const authorization = base64urlencode(`${clientId}:${clientSecret}`)
            const headers = {
                'Authorization' : authorization,
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
            try {
                return fetch(`https://accounts.spotify.com/api/token`,
                {
                    headers : headers,
                    method : 'POST',
                    body : `grant_type=authorization_code&code=${authCode}&redirect_uri=${redirectURI}&client_id=${clientId}&code_verifier=${codeVerifier}`
                })
                .then(response => response.json())                
                .then(jsonResponse => {
                    this.resetAuthCode()
                    if (!jsonResponse.error) {
                        accessToken = jsonResponse.access_token
                        // authCode = jsonResponse.refresh_token
                        const expiresIn = jsonResponse.expires_in
                        window.setTimeout(() => {
                            accessToken = ''
                            this.getAccessToken()
                        }, expiresIn * 1000)
                        return accessToken
                    }
                })   
            } catch(error) {
                console.log(error)
            }         
    },

    getAuthCode() {
        console.log('getAuthCode')
        if (authCode) {
            return authCode
        } else if (this.parseWindow()) { 
            authCode = this.parseWindow()
            return authCode                  
        } else {
            window.location.replace(`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256&show_dialog=false&redirect_uri=${redirectURI}`)
            
        }  
    },

    resetAuthCode() {
        authCode = ''
    },

    getProfileInfo() {            
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

        if (authCodeMatch && authStateMatch) {
            if (authStateMatch[1] === state) {
                const authCode = authCodeMatch[1]
                return authCode
            }
        } 
    },

    hasAccessToken() {
        if (accessToken) {
            return true
        } else {
            return false
        }
    },

    hasAuthCode() {
        if (authCode) {
            return true
        } else {
            return false
        }
    },

}

export default Spotify
