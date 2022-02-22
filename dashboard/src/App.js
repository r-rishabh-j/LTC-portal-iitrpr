import { BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login'
import HeaderComponent from './Components/Header/HeaderComponent';
import useToken from './Components/Tokens/useToken';

function App() {
  const { token, removeToken, setToken } = useToken();
  return (
    <Router>
      {/* <HeaderComponent/> */}
      {!token && token !== "" && token !== undefined ? (
        <Login setToken={setToken} />
      ) : (
        <HeaderComponent />
      )}
    </Router>
  );
}

export default App;
