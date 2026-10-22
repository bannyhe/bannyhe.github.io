import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles/globals.css'
import './styles/locale.css'
import { languageTag } from './i18n/locale'

document.documentElement.lang = languageTag

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
