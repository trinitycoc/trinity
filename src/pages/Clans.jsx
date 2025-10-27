import React, { useState, useEffect } from 'react'
import SectionTitle from '../components/SectionTitle'
import ClanCard from '../components/ClanCard'
import { fetchMultipleClans, checkServerHealth, fetchTrinityClansFromSheet } from '../services/api'

function Clans() {
  const [clansData, setClansData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [serverOnline, setServerOnline] = useState(false)

  useEffect(() => {
    const fetchClansData = async () => {
      try {
        setLoading(true)
        setError(null)

        // First, fetch clan tags from Google Sheets
        const tagsFromSheet = await fetchTrinityClansFromSheet()

        if (tagsFromSheet.length === 0) {
          throw new Error('No Trinity clans found in Google Sheets')
        }

        // Check if backend server is running
        const isOnline = await checkServerHealth()
        setServerOnline(isOnline)

        if (!isOnline) {
          throw new Error('Backend server is not running')
        }

        // Fetch all clan data using the backend API
        const fetchedClans = await fetchMultipleClans(tagsFromSheet)
        
        if (fetchedClans.length === 0) {
          throw new Error('No clan data could be fetched')
        }

        setClansData(fetchedClans)
      } catch (err) {
        console.error('Error loading clans:', err)
        setError(err.message || 'Failed to load clan data')
        setClansData([])
      } finally {
        setLoading(false)
      }
    }

    fetchClansData()
  }, [])

  return (
    <section className="clans-page">
      <SectionTitle>Trinity Family Clans</SectionTitle>
      <p className="page-description">
        Explore our family of clans. Each clan has its own unique culture and requirements, 
        but all share the Trinity spirit of excellence and camaraderie.
      </p>

      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
          {!serverOnline ? (
            <div>
              <p className="error-hint">
                The backend server is not running. Please start it with:
              </p>
              <code className="error-code">cd server && npm install && npm run dev</code>
            </div>
          ) : (
            <div>
              <p className="error-hint">
                Make sure you have set up your Clash of Clans credentials in the <code>.env</code> file.
              </p>
              <p className="error-hint">
                Copy <code>.env.example</code> to <code>.env</code> and fill in your credentials.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="clans-grid">
        {loading ? (
          // Show single loading skeleton
          <ClanCard isLoading={true} />
        ) : clansData.length > 0 ? (
          // Show clan cards with fetched data
          clansData.map((clan) => (
            <ClanCard
              key={clan.tag}
              clan={clan}
              isLoading={false}
              error={false}
            />
          ))
        ) : (
          <div className="no-data-message">
            <p>No clan data available. Please check your configuration.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Clans
