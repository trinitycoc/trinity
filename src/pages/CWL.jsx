import React, { useState, useEffect } from 'react'
import SectionTitle from '../components/SectionTitle'
import CWLClanCard from '../components/CWLClanCard'
import { fetchMultipleClans, checkServerHealth } from '../services/api'
import { fetchCWLClansDetailsFromSheet } from '../services/googleSheets'

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

        // First, fetch clan details from Google Sheets
        const detailsFromSheet = await fetchCWLClansDetailsFromSheet()

        if (detailsFromSheet.length === 0) {
          throw new Error('No CWL clans found in Google Sheets')
        }

        // Extract clan tags for API call
        const clanTags = detailsFromSheet.map(detail => detail.tag)

        // Check if backend server is running
        const isOnline = await checkServerHealth()
        setServerOnline(isOnline)

        if (!isOnline) {
          throw new Error('Backend server is not running')
        }

        // Fetch all CWL clan data using the backend API
        const fetchedClans = await fetchMultipleClans(clanTags)
        
        if (fetchedClans.length === 0) {
          throw new Error('No clan data could be fetched')
        }

        // Merge API data with Google Sheets details
        const mergedData = fetchedClans.map(clan => {
          const sheetInfo = detailsFromSheet.find(detail => detail.tag === clan.tag)
          return {
            ...clan,
            sheetData: sheetInfo || null
          }
        })

        setClansData(mergedData)
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

      {!loading && clansData.length > 0 && (
        <div className="clans-footer">
          <p className="info-text">
            📊 Clan list synced from Google Sheets • 🏆 Data fetched live from Clash of Clans API
          </p>
          <p className="info-text">
            Showing {clansData.length} CWL clan{clansData.length !== 1 ? 's' : ''} from the Trinity family
          </p>
        </div>
      )}
    </section>
  )
}

export default CWL

