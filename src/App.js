import {Route, Routes} from 'react-router-dom'
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Account from './components/Account';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/NavbarSidebar/Navbar';

function App() {
  return (
    <div >
     
    <AuthContextProvider>
    <Navbar/>
    <Routes>
        <Route path='/' element={<SignIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='account' element={<ProtectedRoute><Account/></ProtectedRoute>}/>
      </Routes>
     
      </AuthContextProvider>
    </div>
  );
}

export default App;
