import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login'
import GoogleLogin from './Components/Login/GoogleLogin';
import HeaderComponent from './Components/Header/HeaderComponent';
import useToken from './Components/Tokens/useToken';
import Logout from './Components/Body/Dashboard/Logout';
import useAuthCookie from './Components/Login/useAuthCookie';
import AdminPage from './Components/Body/Dashboard/Admin/AdminPage';

function App() {
  const { token, removeToken, setToken } = useToken();
  const [isLoggedIn, profileInfo] = useAuthCookie();
  return (
    <Router>
      {/* <HeaderComponent/> */}
      {/* <Login setToken={setToken}/> */}
      {!isLoggedIn && isLoggedIn !== true && isLoggedIn !== undefined ? (
        <GoogleLogin />
      ) : profileInfo.permission == 1 ? (
        <HeaderComponent
          token={token}
          setToken={setToken}
          profileInfo={profileInfo}
        />
      ) : (
        <AdminPage />
      )

      // <AdminPage />
      }
    </Router>
  );
}

export default App;
