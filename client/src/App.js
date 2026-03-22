import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import ForgotPassword from './components/password/ForgotPassword';
import ResetPassword from './components/password/ResetPassword';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
