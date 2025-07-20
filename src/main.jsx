import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/main.css'
import './assets/validation.css'
import App from './App.jsx'
import { AppConfigProvider } from "./context/AppConfigContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppConfigProvider>
    <App />
    </AppConfigProvider>
  </StrictMode>,
)
