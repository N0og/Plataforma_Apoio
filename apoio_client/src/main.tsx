import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './root.css'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Fragment>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
    <ToastContainer />
  </React.Fragment >,
)
