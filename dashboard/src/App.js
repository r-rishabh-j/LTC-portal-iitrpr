import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import GoogleLogin from './Components/Login/GoogleLogin';
import HeaderComponent from './Components/Header/HeaderComponent';
import useAuthCookie from './Components/Login/useAuthCookie';
import AdminPage from './Components/Body/Dashboard/Admin/AdminPage';
import LoadingPage from './Components/Login/LoadingPage';

function App() {
  const [isLoggedIn, profileInfo] = useAuthCookie();
  // const profileInfo = JSON.parse(sessionStorage.getItem('profile'));
  return (
    <Router>
      {isLoggedIn === null ? (<LoadingPage />) :
        (isLoggedIn === false ? (<GoogleLogin />) :
          (
            profileInfo.permission === "client" ? (
              <HeaderComponent
                profileInfo={profileInfo}
              />
            ) : (
              <AdminPage profileInfo={profileInfo}/>
            )
          )

        )

      }

      {/* {!isLoggedIn && isLoggedIn !== true && isLoggedIn !== undefined ? (
        <GoogleLogin />
      ) : profileInfo.permission == "client" ? (
        <HeaderComponent
          token={token}
          setToken={setToken}
          profileInfo={profileInfo}
        />
      ) : (
        <AdminPage />
      )

        // <AdminPage />
      } */}
      </Router>
  );
}

export default App;
