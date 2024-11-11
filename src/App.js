import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Dashboard from './Components/Pages/Dashboard';
import Signup from './Components/Pages/Signup';
import { ToastContainer} from 'react-toastify';


function App() {
  return (
    <>
    <ToastContainer/>
    <Router>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
