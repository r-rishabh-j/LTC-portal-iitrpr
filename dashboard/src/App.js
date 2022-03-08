import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login'
import GoogleLogin from './Components/Login/GoogleLogin';
import HeaderComponent from './Components/Header/HeaderComponent';
import useToken from './Components/Tokens/useToken';
import Logout from './Components/Body/Dashboard/Logout';
import useAuthCookie from './Components/Login/useAuthCookie';

function App() {
  const { token, removeToken, setToken } = useToken();
  const { isLoggedIn } = useAuthCookie();
  return (
    <Router>
      {/* <HeaderComponent/> */}
      {/* <Login setToken={setToken}/> */}
      {!isLoggedIn && isLoggedIn !== true && isLoggedIn !== undefined ?
        <GoogleLogin />
        : (
          <HeaderComponent token={token} setToken={setToken} />
        )}
    </Router>
  );
}

export default App;
