import { io } from 'socket.io-client'

/**
 * Socket.IO expects the HTTP origin of the API server (not the `/api` REST prefix).
 */
export const getSocketBaseUrl = () => {
  const base = import.meta.env.VITE_API_URL || ''
  if (!base) return ''
  return base.replace(/\/api\/?$/i, '')
}

/**
 * @param {string} token JWT from localStorage
 * @returns {import('socket.io-client').Socket | null}
 */
export const createAuthenticatedSocket = (token) => {
  const url = getSocketBaseUrl()
  if (!url || !token) return null

  return io(url, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1500
  })
}
