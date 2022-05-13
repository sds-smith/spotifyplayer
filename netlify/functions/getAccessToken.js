const axios = require('axios')
const querystring = require('node:querystring')

exports.handler = async function (event, context) {

    const { authCode } = event.queryStringParameters
    console.log("HEYYYYY ", authCode)
    const authorization =   'Basic ' + Buffer.from(process.env.REACT_APP_CLIENT_ID + ':' + process.env.REACT_APP_CLIENT_SECRET).toString('base64')
    const headers = {
        'Authorization' : authorization,
        'Content-Type' : 'application/x-www-form-urlencoded'
    }
    const data = querystring.stringify({
        grant_type : 'authorization_code',
        code : authCode,
        redirect_uri : process.env.REACT_APP_REDIRECT_URI_NETLIFY_CLI,
        client_id : process.env.REACT_APP_CLIENT_ID,
        code_verifier : process.env.REACT_APP_AUTH_VERIFIER
    })
    try {
        const response = await axios.post(`https://accounts.spotify.com/api/token`,
            data,
            {
                headers : headers,
                json : true
            });
        console.log(response)
        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        }
 
    } catch(err) {
        console.log('nopers')
        console.log(err)
        return {
            statusCode: 404,
            body: err.toString()
        }
    }

}
