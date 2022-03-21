import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import GoogleLogin from './Components/Login/GoogleLogin';
import HeaderComponent from './Components/Header/HeaderComponent';
import useAuthCookie from './Components/Login/useAuthCookie';
import AdminPage from './Components/Body/Dashboard/Admin/AdminPage';
import EstablishmentPage from './Components/Body/Dashboard/Establishment/EstablishmentPage';
import AccountsPage from './Components/Body/Dashboard/Accounts/AccountsPage';
import LoadingPage from './Components/Login/LoadingPage';
import { Typography } from '@material-ui/core';
import DeanPage from './Components/Body/Dashboard/DeanFA/DeanPage';
import AuditPage from './Components/Body/Dashboard/Audit/AuditPage';
import RegistrarPage from './Components/Body/Dashboard/Registrar/RegistrarPage';

function App() {
  const [isLoggedIn, profileInfo] = useAuthCookie();
  // const profileInfo = JSON.parse(sessionStorage.getItem('profile'));
  const role = profileInfo.permission;
  let view;
  switch (role) {
    case "client":
      view = <HeaderComponent profileInfo={profileInfo} />;
      break;
    case "admin":
      view = <AdminPage profileInfo={profileInfo} />;
      break;
    case "accounts":
      view = <AccountsPage profileInfo={profileInfo} />;
      break;
    case "establishment":
      view = <EstablishmentPage profileInfo={profileInfo} />;
      break;
    case "deanfa":
      view = <DeanPage profileInfo={profileInfo} />;
      break;
    case "registrar":
      view = <RegistrarPage profileInfo={profileInfo} />;
      break;
    case "audit":
      view = <AuditPage profileInfo={profileInfo} />;
      break;
    default:
      view = (
        <Typography>
          Error identifying user permission, please try again
        </Typography>
      ); //make a default page for now
      break;
  }
  return (
    <Router>
      {isLoggedIn === null ? (<LoadingPage />) :
        (isLoggedIn === false ? (<GoogleLogin />) :
          (
            // profileInfo.permission === "client" ? (
            //   <HeaderComponent
            //     profileInfo={profileInfo}
            //   />
            // ) : (
            //   <AdminPage profileInfo={profileInfo}/>
            // )
            view
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
