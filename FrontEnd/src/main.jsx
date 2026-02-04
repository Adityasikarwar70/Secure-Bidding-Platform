import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthProvider } from './Context/AuthContext.jsx';
import { LoaderProvider } from './Context/LoaderContext.jsx';



createRoot(document.getElementById('root')).render(


  <StrictMode>
    <AuthProvider>
      <LoaderProvider>
      <App />
      </LoaderProvider>
    </AuthProvider>
  </StrictMode>

)
