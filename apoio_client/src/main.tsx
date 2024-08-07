import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css';
import './root.css'
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Fragment>
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer />
  </React.Fragment>,
)
