import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import AdminPage from './pages/adminPage'
import HomePage from './pages/home'
import LogInPage from './pages/logIn'
import RegisterPage from './pages/register'
import TestPage from './pages/testPage'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'


function App() {
  

  return (
  <GoogleOAuthProvider clientId="490059930683-h5l2p0p227g9jm3l3vjdpr5qtp72ue3q.apps.googleusercontent.com">
   <BrowserRouter>
      <div>
        <Toaster/>
        <Routes path='/*'>
          <Route path='/login' element={<LogInPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/admin/*' element={<AdminPage />} />
          <Route path='/test' element={<TestPage />} />
          <Route path='/*' element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  </GoogleOAuthProvider>
  )
}

export default App
