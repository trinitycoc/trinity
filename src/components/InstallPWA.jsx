import React, { useState, useEffect } from 'react'

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
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

    if (!isMobile) {
      // Desktop - only show if beforeinstallprompt event fires
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setShowInstallButton(true)
      }
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    }

    // Mobile - always show install button (even if beforeinstallprompt doesn't fire)
    // This helps when user already dismissed the prompt or site doesn't meet all criteria
    setShowInstallButton(true)

    // Also listen for beforeinstallprompt event (Android Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    // If we have the deferred prompt, use it (Android Chrome)
    if (deferredPrompt) {
      try {
        // Show the install prompt
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
        // Fall through to manual instructions
      } finally {
        // Clear the deferred prompt
        setDeferredPrompt(null)
      }
      return
    }

    // Manual instructions (iOS or Android without prompt)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)

    if (isIOS) {
      // iOS instructions
      alert(
        '📱 Install Trinity App on iOS:\n\n' +
        '1. Tap the Share button (□ with ↑)\n' +
        '2. Scroll down and tap "Add to Home Screen"\n' +
        '3. Tap "Add" in the top right\n\n' +
        'The app icon will appear on your home screen!'
      )
    } else if (isAndroid) {
      // Android instructions
      alert(
        '📱 Install Trinity App on Android:\n\n' +
        '1. Tap the menu (⋮) in your browser\n' +
        '2. Look for "Install App" or "Add to Home Screen"\n' +
        '3. Tap it and confirm installation\n\n' +
        'If you don\'t see "Install App", tap "Add to Home Screen" instead.'
      )
    } else {
      // Desktop/Other
      alert(
        '📱 To install this app:\n\n' +
        'Look for the install icon in your browser\'s address bar, or:\n\n' +
        'Chrome/Edge: Menu → Install App\n' +
        'Firefox: Menu → Install\n' +
        'Safari: Not supported'
      )
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

export default InstallPWA

