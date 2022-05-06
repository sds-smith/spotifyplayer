import { generateRandomString, base64urlencode, pkce_challenge_from_verifier } from './random'

let authCode
let accessToken
const clientId = process.env.REACT_APP_CLIENT_ID
const clientSecret = process.env.REACT_APP_CLIENT_SECRET
const randomString = generateRandomString()
const codeVerifier = ''.concat(randomString)
console.log('codeVerifier at step 1 ',codeVerifier)
const codeChallenge = pkce_challenge_from_verifier(codeVerifier)
console.log(codeChallenge)
const state = process.env.REACT_APP_AUTH_STATE
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
            console.log('codeVerifier at step 2 ',codeVerifier)
            return fetch(`https://accounts.spotify.com/api/token`,
            {
                headers : headers,
                method : 'POST',
                body : `grant_type=authorization_code&code=${authCode}&redirect_uri=${redirectURI}&client_id=${clientId}&code_verifier=${codeVerifier}`
            })
            .then(response => response.json())                
            .then(jsonResponse => {
                console.log('codeVerifier at step 3 ',codeVerifier)
                console.log(jsonResponse)
            })
        }           
    },

    getAuthCode() {
        if (this.authCode) {
            return authCode
        } else if (this.parseWindow()) { 
            return this.parseWindow()                  
        } else {
            window.location = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256&redirect_uri=${redirectURI}`
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
        } else if (this.parseWindow()) {
            return true
        } else {
            return false
        }
    }
}

export default Spotify