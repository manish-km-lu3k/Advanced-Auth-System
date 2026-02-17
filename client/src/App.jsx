import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import SecurityDashboard from './Components/Dashboard';
import Login from './Components/Login';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<SecurityDashboard />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App;
