import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
// strict mode hataya hai 
    <Provider store={store}>
      <App />
    </Provider>
// strict mode hataya hai 
)
