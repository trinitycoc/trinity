import React, { useState, useEffect } from 'react'
import SectionTitle from '../components/SectionTitle'
import CWLClanCard from '../components/CWLClanCard'
import { checkServerHealth, fetchFilteredCWLClans } from '../services/api'

function CWL() {
  const [clansData, setClansData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [serverOnline, setServerOnline] = useState(false)

  useEffect(() => {
    const fetchClansData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if backend server is running
        const isOnline = await checkServerHealth()
        setServerOnline(isOnline)

        if (!isOnline) {
          throw new Error('Backend server is not running')
        }

        // Fetch CWL clans from backend with capacity-based filtering
        // To show ALL clans: fetchFilteredCWLClans(true)
        const filteredClans = await fetchFilteredCWLClans() // Filtered by capacity
        
        if (filteredClans.length === 0) {
          throw new Error('No CWL clans available')
        }
        
        setClansData(filteredClans)
      } catch (err) {
        console.error('Error loading CWL clans:', err)
        setError(err.message || 'Failed to load CWL clan data')
        setClansData([])
      } finally {
        setLoading(false)
      }
    }

    fetchClansData()
  }, [])

  return (
    <section className="cwl-page">
      <SectionTitle>Clan War League (CWL)</SectionTitle>
      <p className="page-description">
        Our CWL clans are organized in satellite leagues, offering high-tier competitive play for Trinity players.
        Each clan competes in its respective league to maximize rewards and glory for our family.
      </p>

      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
          {!serverOnline ? (
            <div>
              <p className="error-hint">
                The backend server is not running. Please start it with:
              </p>
              <code className="error-code">cd Trinity_Backend && npm install && npm run dev</code>
            </div>
          ) : (
            <div>
              <p className="error-hint">
                Make sure you have set up your Clash of Clans credentials in the <code>.env</code> file.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="clans-grid">
        {loading ? (
          // Show single loading skeleton
          <CWLClanCard isLoading={true} />
        ) : clansData.length > 0 ? (
          // Show CWL clan cards with fetched data
          clansData.map((clan) => (
            <CWLClanCard
              key={clan.tag}
              clan={clan}
              isLoading={false}
              error={false}
              sheetData={clan.sheetData}
            />
          ))
        ) : (
          <div className="no-data-message">
            <p>No CWL clan data available. Please check your configuration.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default CWL

