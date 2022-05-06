

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

    search(term, type='track') {
        const accessToken = this.getAccessToken()
        const headers = { Authorization : `Bearer ${accessToken}` }
        return fetch(`https://api.spotify.com/v1/search?type=${type}&q=${term}`, {headers: headers}
        ).then(response => {
            return response.json()
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return []
            }
            return jsonResponse.tracks.items.map(track => ({
                id : track.id,
                name : track.name,
                artist : track.artists[0].name,
                album : track.album.name,
                uri : track.uri
            }))
        }).catch((error) => {
            console.error('Error: ', error)
            window.location = redirectURI
        })
    },

    getRecommendations(seeds, tunerAttributes) {
        const accessToken = this.getAccessToken()
        const headers = { Authorization : `Bearer ${accessToken}` }
        const baseUrl = 'https://api.spotify.com/v1/recommendations?'
        const seedTracks = `seed_tracks=${seeds}`
        const [acousticness, danceability, instrumentalness, energy, liveness, tempo] = tunerAttributes
        const recommendationsTuner = `&target_acousticness=${acousticness}&target_danceability=${danceability}&target_instrumentalness=${instrumentalness}&target_energy=${energy}&target_liveness=${liveness}&target_tempo=${tempo}`
        const endpoint = baseUrl + seedTracks + recommendationsTuner
        return fetch(endpoint, {headers : headers}
        ).then(response => {
            return response.json()
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return []
            }
            return jsonResponse.tracks.map(track => ({
                id : track.id,
                name : track.name,
                artist : track.artists[0].name,
                album : track.album.name,
                uri : track.uri
            }))
        }).catch((error) => {
            console.error('Error: ', error)
        })
    },

    savePlaylist(name, trackURIs) {
        if ((!name) || (!trackURIs.length)) {
            return
        }
        const accessToken = Spotify.getAccessToken()
        const headers = { Authorization : `Bearer ${accessToken}` }
        let userId
        return fetch('https://api.spotify.com/v1/me', {headers : headers}
        ).then(response => response.json()
            ).then(jsonResponse => {
                userId = jsonResponse.id
                console.log('userId', userId)
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    headers : headers,
                    method : 'POST',
                    body : JSON.stringify({
                        name : name,
                    })
                }).then(response => response.json()
                ).then(jsonResponse => {
                    const playlistID = jsonResponse.id
                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,
                    {
                        headers : headers,
                        method : 'POST',
                        body : JSON.stringify({
                            uris : trackURIs
                        })
                    })
                })
            })
    },
    
    play(id, {
            spotify_uri,
            playerInstance:  {
                _options: {
                  getOAuthToken
                }
            }
      }) {
        getOAuthToken(access_token => {
          fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotify_uri] }),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`
            },
          });
        });
      },
      
      getLikeStatus(trackId) {
        const accessToken = this.getAccessToken()
        const headers = { Authorization : `Bearer ${accessToken}` }
          return fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${trackId}`, {headers : headers})
            .then(response => response.json()
            ).then(jsonResponse => {
                const status = jsonResponse[0]
                return status
            })
      },

      addLike(trackId) {
        const accessToken = Spotify.getAccessToken()
        const headers = { 
            'Content-Type' : 'application/json',
            Authorization : `Bearer ${accessToken}`,
        }
        return fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`,
        {
            headers : headers,
            method : 'PUT',
        })
      },

      deleteLike(trackId) {
        const accessToken = Spotify.getAccessToken()
        const headers = { 
            'Content-Type' : 'application/json',
            Authorization : `Bearer ${accessToken}`,
        }
        return fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`,
        {
            headers : headers,
            method : 'DELETE',
        })
      } 
}

export default Spotify