import { BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login'
import HeaderComponent from './Components/Header/HeaderComponent';
import useToken from './Components/Tokens/useToken';
import Logout from './Components/Body/Dashboard/Logout';

function App() {
  const { token, removeToken, setToken } = useToken();
  return (
    <Router>
      {/* <HeaderComponent/> */}
      {/* <Login setToken={setToken}/> */}
      {!token && token!=="" &&token!== undefined?  
        <Login setToken={setToken} />
        :(
          <HeaderComponent token={token} setToken={setToken}/>
        )}
        <Logout token={removeToken}/>
    </Router>
  );
}

export default App;
