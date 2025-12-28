import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { CWLProvider } from './contexts/CWLContext'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <CWLProvider>
          <App />
        </CWLProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

