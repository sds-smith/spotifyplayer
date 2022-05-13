import { Redirect, Link } from 'react-router-dom';
import './App.css'

function Login(props) {

        if (props.authStatus === 'token') {
            return <Redirect to='/profile' />
        }
      
        return (
        <div >
            <h1>Please Log In</h1>
            <button onClick={props.authorize}>LOGIN</button>
        </div>
        );
}
  
  export default Login;
  