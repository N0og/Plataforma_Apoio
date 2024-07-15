import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css';
import './root.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <ToastContainer/>
  </React.StrictMode>,
)
