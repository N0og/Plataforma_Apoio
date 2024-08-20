import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Usa o localStorage como padrão
import { rootReducer } from './root-reducer'; // Importa o seu rootReducer e o tipo

// Configuração do redux-persist
const persistConfig = {
  key: 'root',
  storage,
};

// Cria o persistReducer tipado corretamente
const persistedReducer = persistReducer<rootReducer>(persistConfig, rootReducer);

// Cria a store
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
