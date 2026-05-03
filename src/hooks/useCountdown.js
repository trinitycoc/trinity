import { useState, useEffect } from 'react'

/**
 * Single shared 1s timer for all active countdowns — avoids N intervals when many cards mount.
 */
let sharedIntervalId = null
let subscriberRefCount = 0
const subscribers = new Set()

function ensureSharedTicker() {
  if (sharedIntervalId !== null) return
  sharedIntervalId = setInterval(() => {
    subscribers.forEach((notify) => notify())
  }, 1000)
}

function stopSharedTickerIfIdle() {
  if (subscriberRefCount <= 0 && sharedIntervalId !== null) {
    clearInterval(sharedIntervalId)
    sharedIntervalId = null
    subscribers.clear()
  }
}

function formatRemaining(targetTime) {
  const now = Date.now()
  const target = new Date(targetTime).getTime()
  const difference = target - now

  if (difference <= 0) {
    return 'Ended'
  }

  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/**
 * Live countdown string for a single ISO/end time. Uses one shared interval across all instances.
 */
export function useCountdown(targetTime) {
  const [, forceTick] = useState(0)

  useEffect(() => {
    if (!targetTime) {
      return undefined
    }

    const notify = () => forceTick((n) => n + 1)
    subscribers.add(notify)
    subscriberRefCount += 1
    ensureSharedTicker()
    notify()

    return () => {
      subscribers.delete(notify)
      subscriberRefCount -= 1
      stopSharedTickerIfIdle()
    }
  }, [targetTime])

  if (!targetTime) {
    return ''
  }

  return formatRemaining(targetTime)
}
