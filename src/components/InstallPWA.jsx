import React, { useState, useEffect, useRef, useCallback } from 'react'

function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true)
      return
    }

    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    // Don't show install button on desktop - only show on mobile
    if (!isMobile) {
      return
    }

    // Listen for beforeinstallprompt event (Android Chrome)
    // Only show button when native install prompt is available
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true) // Only show button when native prompt is available
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    // Only proceed if we have the deferred prompt (native install available)
    if (!deferredPrompt) {
      console.log('Native install prompt not available')
      return
    }

    try {
      // Show the native browser install prompt
      deferredPrompt.prompt()

      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setShowInstallButton(false)
        setIsInstalled(true)
      } else {
        console.log('User dismissed the install prompt')
      }
    } catch (error) {
      console.error('Error showing install prompt:', error)
    } finally {
      // Clear the deferred prompt
      setDeferredPrompt(null)
    }
  }

  // Don't show if already installed
  if (isInstalled) {
    return null
  }

  // Don't show if install button shouldn't be displayed
  if (!showInstallButton) {
    return null
  }

  return (
    <button
      onClick={handleInstallClick}
      className="install-pwa-button"
      aria-label="Install Trinity App"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span>Install App</span>
    </button>
  )
}

// Floating banner component for mobile
export function InstallPWABanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const timerRef = useRef(null)
  const visibilityCheckIntervalRef = useRef(null)
  const isPageVisibleRef = useRef(true)

  // Check if app is installed (doesn't cause re-render)
  const checkIfInstalled = useCallback(() => {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
  }, [])

  // Schedule banner to show after 2 minutes (120,000 milliseconds)
  const scheduleNextBanner = useCallback(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // Don't schedule if app is installed or page is hidden
    if (checkIfInstalled() || !isPageVisibleRef.current) {
      return
    }

    // Schedule banner to show in 2 minutes
    timerRef.current = setTimeout(() => {
      // Check again before showing (app might be installed while waiting)
      if (checkIfInstalled()) {
        setIsInstalled(true)
        setShowBanner(false)
        return
      }
      
      if (isPageVisibleRef.current) {
        setShowBanner(true)
      } else {
        // If page is hidden but not installed, reschedule when visible
        // Use a shorter interval to check when page becomes visible
        if (visibilityCheckIntervalRef.current) {
          clearInterval(visibilityCheckIntervalRef.current)
        }
        visibilityCheckIntervalRef.current = setInterval(() => {
          if (isPageVisibleRef.current) {
            if (visibilityCheckIntervalRef.current) {
              clearInterval(visibilityCheckIntervalRef.current)
              visibilityCheckIntervalRef.current = null
            }
            if (!checkIfInstalled()) {
              setShowBanner(true)
            }
          }
        }, 1000) // Check every second
      }
    }, 120000) // 2 minutes = 120,000 milliseconds
  }, [checkIfInstalled])

  useEffect(() => {
    // Initial check - update state if installed
    if (checkIfInstalled()) {
      setIsInstalled(true)
      return
    }

    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // Show initially after 3 seconds
      const initialTimer = setTimeout(() => {
        if (checkIfInstalled()) {
          setIsInstalled(true)
          return
        }
        if (isPageVisibleRef.current) {
          setShowBanner(true)
        }
      }, 3000)

      return () => {
        clearTimeout(initialTimer)
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
        if (visibilityCheckIntervalRef.current) {
          clearInterval(visibilityCheckIntervalRef.current)
        }
      }
    }

    // Desktop - only show if beforeinstallprompt event fires
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (!checkIfInstalled()) {
        setShowBanner(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (visibilityCheckIntervalRef.current) {
        clearInterval(visibilityCheckIntervalRef.current)
      }
    }
  }, [checkIfInstalled])

  // Handle page visibility changes (don't show banner when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const wasVisible = isPageVisibleRef.current
      isPageVisibleRef.current = !document.hidden
      
      // Check if app was installed while tab was hidden
      if (checkIfInstalled()) {
        setIsInstalled(true)
        setShowBanner(false)
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        return
      }
      
      // If page becomes hidden, hide banner and clear timers
      if (wasVisible && !isPageVisibleRef.current) {
        setShowBanner(false)
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        if (visibilityCheckIntervalRef.current) {
          clearInterval(visibilityCheckIntervalRef.current)
          visibilityCheckIntervalRef.current = null
        }
      } else if (!wasVisible && isPageVisibleRef.current && !isInstalled && !showBanner) {
        // If page becomes visible and banner should be scheduled, schedule it
        scheduleNextBanner()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isInstalled, showBanner, scheduleNextBanner, checkIfInstalled])

  const handleInstallClick = async () => {
    // Only proceed if we have the deferred prompt (native install available)
    if (!deferredPrompt) {
      console.log('Native install prompt not available')
      return
    }

    try {
      // Show the native browser install prompt
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowBanner(false)
        setIsInstalled(true)
        // Clear timer since app is now installed
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
      }
    } catch (error) {
      console.error('Error showing install prompt:', error)
    } finally {
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    // Hide the banner and schedule it to show again in 2 minutes from now
    setShowBanner(false)
    // Only schedule if not installed
    if (!checkIfInstalled()) {
      scheduleNextBanner()
    }
  }

  // Don't show if app is installed or banner shouldn't be displayed
  if (isInstalled || !showBanner) {
    return null
  }

  return (
    <div className="install-pwa-banner">
      <div className="install-pwa-banner-content">
        <div className="install-pwa-banner-icon">📱</div>
        <div className="install-pwa-banner-text">
          <strong>Install Trinity App</strong>
          <span>Get quick access on your phone</span>
        </div>
        <div className="install-pwa-banner-actions">
          <button onClick={handleInstallClick} className="install-pwa-banner-button">
            Install
          </button>
          <button onClick={handleDismiss} className="install-pwa-banner-close" aria-label="Dismiss">
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallPWA
