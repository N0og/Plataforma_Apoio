//IMPORTS
//CSS
import './root.css'
import 'react-toastify/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.css';
//REACT
import React from 'react'
import ReactDOM from 'react-dom/client'
//COMPONENTS
import App from './app/App.tsx'
import { ToastContainer } from 'react-toastify'
//REDUX
/**
 * Utilização do Redux para o gerenciamento de estados
 * globais dentro da aplicação.
 */
import { Provider } from 'react-redux';
/**
 * Utilizando o PersistGate do Redux para garantir a
 * persistência dos estados diante a reinicialização
 * ou intercorrência do navegador durante o uso da aplicação.
 */
import { PersistGate } from 'redux-persist/integration/react';
import {
  store,
  persistor
} from './redux/store.ts';

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
