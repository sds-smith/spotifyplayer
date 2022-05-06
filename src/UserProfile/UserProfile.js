import React from 'react'
import './UserProfile.css'

class UserProfile extends React.Component {
    constructor(props) {
        super(props)

        this.getProfileInfo = this.getProfileInfo.bind(this)
    }

    getProfileInfo() {
        this.props.getProfileInfo()
    }
    componentDidMount() {
        this.getProfileInfo()
    }

    render() {
        return (
            <a className='Profile' href={`https://open.spotify.com/user/${this.props.userName}`} target='_blank' rel="noreferrer">
                <img src={this.props.profilePic} alt='users Spotify profile pic'/>
                <h2>{this.props.userName}</h2>
            </a>
        )
    }
}

export default UserProfile