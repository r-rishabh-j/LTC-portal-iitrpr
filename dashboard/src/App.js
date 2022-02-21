import { BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import HeaderComponent from './Components/Header/HeaderComponent';

function App() {
  return (
    <Router>
      <HeaderComponent/>
    </Router>
  );
}

export default App;
