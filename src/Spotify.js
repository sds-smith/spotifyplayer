

let accessToken
const redirectURI = process.env.REACT_APP_REDIRECT_URI_LOCALHOST
const scope = process.env.REACT_APP_EXPANDED_SCOPE



const Spotify = {

    hasAccessToken() {
        if (accessToken) {
            return true
        } else if (this.parseAccessToken()) {
            return true
        } else {
            return false
        }
    },

    parseAccessToken() {
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
        if (accessTokenMatch && expiresInMatch) { 
            accessToken = accessTokenMatch[1]
            const expiresIn = Number(expiresInMatch[1])
            window.setTimeout(() => accessToken = '', expiresIn * 1000)
            window.history.pushState("Access Token", null, "/")
            return accessToken  
        }     
    },

    getAccessToken() {
        if (accessToken) {
            return accessToken
        }
        if (this.parseAccessToken()) { 
            return this.parseAccessToken()                  
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&scope=${scope}&redirect_uri=${redirectURI}`
            return this.parseAccessToken()    
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
}

export default Spotify