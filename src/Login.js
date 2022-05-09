import './App.css'

function Login(props) {
      
        return (
        <div className='App-header'>
            <h1>Please Log In</h1>
            <button onClick={props.login}>LOGIN</button>
        </div>
        );
}
  
  export default Login;
  