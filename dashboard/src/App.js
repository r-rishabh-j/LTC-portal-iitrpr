import { BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login'
import HeaderComponent from './Components/Header/HeaderComponent';

function App() {
  return (
    <Router>
      {/* <HeaderComponent/> */}
      {!token && token!=="" &&token!== undefined?  
        <Login setToken={setToken}/>
        :(
          <>
            <Routes>
              <Route exact path="/profile" element={<Profile token={token} setToken={setToken}/>}></Route>
            </Routes>
          </>
        )}
    </Router>
  );
}

export default App;
