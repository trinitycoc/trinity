import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CWLProvider } from './contexts/CWLContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CWLProvider>
      <App />
    </CWLProvider>
  </React.StrictMode>,
)

