import { generateRandomString, base64urlencode, generateCodeChallenge, base64URL, pkce_challenge_from_verifier } from './random'

let authCode
let codeVerifier = process.env.REACT_APP_AUTH_VERIFIER
let codeChallenge = process.env.REACT_APP_AUTH_CHALLENGE
let accessToken
let refreshToken
const clientId = process.env.REACT_APP_CLIENT_ID
const clientSecret = process.env.REACT_APP_CLIENT_SECRET
const state = process.env.REACT_APP_AUTH_STATE
const redirectURI = process.env.REACT_APP_REDIRECT_URI_LOCALHOST
const scope = process.env.REACT_APP_EXPANDED_SCOPE

const Spotify = {

    getAccessToken() {
        if (accessToken) {
            return accessToken
        } else {
            // return this.getImplicitToken()
                return this.getCodeToken()
        }
    },

    getImplicitToken() {
        if (accessToken) {
            return accessToken
        }
        if (this.parseWindow()) { 
            return this.parseWindow()                  
        } else {
            window.location = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectURI}`
            return this.parseWindow()    
        }             
    },

    getCodeToken() {
        if (accessToken) {
            return accessToken
        } else {
            authCode = this.getAuthCode()
            const authorization = base64urlencode(`${clientId}:${clientSecret}`)
            const headers = {
                'Authorization' : authorization,
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
            try {
                fetch(`https://accounts.spotify.com/api/token`,
                {
                    headers : headers,
                    method : 'POST',
                    body : `grant_type=authorization_code&code=${authCode}&redirect_uri=${redirectURI}&client_id=${clientId}&code_verifier=${codeVerifier}`
                })
                .then(response => response.json())                
                .then(jsonResponse => {
                    if (!jsonResponse.error) {
                        accessToken = jsonResponse.access_token
                        refreshToken = jsonResponse.refresh_token
                    }
                })   
            } catch(error) {
                console.log(error)
            } 
        }           
    },

    getAuthCode() {
        if (authCode) {
            return authCode
        } else if (this.parseWindow()) { 
            return authCode                  
        } else {
            // codeChallenge = this.getCodeChallenge()
            window.location = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256&redirect_uri=${redirectURI}`
            return this.parseWindow()
        }  
    },

    // getCodeChallenge() {
        // if (codeChallenge) {
            // return codeChallenge
        // } else {
            // codeVerifier = this.getCodeVerifier()
            // codeChallenge = generateCodeChallenge(codeVerifier)
            // return codeChallenge
        // }
    // },
// 
    // getCodeVerifier() {
        // if (codeVerifier) {
            // return codeVerifier
        // } else {
            // codeVerifier = generateRandomString()
            // return codeVerifier
        // }
    // },

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
            if (authStateMatch[1] === state) {
                authCode = authCodeMatch[1]
                return authCode
            }
        }
        if (accessTokenMatch && expiresInMatch) { 
            accessToken = accessTokenMatch[1]
            const expiresIn = Number(expiresInMatch[1])
            window.setTimeout(() => accessToken = '', expiresIn * 1000)
            window.history.pushState("Access Token", null, "/")
            return accessToken  
        }     
    },

    hasAccessToken() {
        if (accessToken) {
            return true
        } else {
            return false
        }
    }
}

export default Spotify
