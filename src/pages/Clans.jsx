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
          // Keep loading state instead of showing error
          setLoading(true)
          return
        }

        // Check if backend server is running
        const isOnline = await checkServerHealth()
        setServerOnline(isOnline)

        if (!isOnline) {
          // Keep loading state instead of showing error
          setLoading(true)
          return
        }

        // Fetch all clan data using the backend API
        const fetchedClans = await fetchMultipleClans(tagsFromSheet)
        
        if (fetchedClans.length === 0) {
          // Keep loading state instead of showing error
          setLoading(true)
          return
        }

        setClansData(fetchedClans)
        setLoading(false)
      } catch (err) {
        // Catch all errors (API_BASE_URL undefined, network errors, etc.) and show loading
        console.error('Error loading clans:', err)
        setLoading(true)
        setError(null)
        setClansData([])
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
