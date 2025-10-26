import React from 'react'
import SectionTitle from '../components/SectionTitle'
import Button from '../components/Button'

function Contact() {
  return (
    <section className="contact-page">
      <SectionTitle>Contact Us</SectionTitle>
      <div className="contact-content">
        <p className="page-description">
          Have questions or want to join the Trinity family? Get in touch with us!
        </p>
        
        <div className="contact-methods">
          <div className="contact-card">
            <div className="contact-icon">💬</div>
            <h4>Discord</h4>
            <p>Join our Discord server for instant communication</p>
            <Button variant="primary">Join Discord</Button>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon">📧</div>
            <h4>Email</h4>
            <p>Send us an email for inquiries</p>
            <Button variant="secondary" href="mailto:trinity@example.com">
              Send Email
            </Button>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon">🎮</div>
            <h4>In-Game</h4>
            <p>Visit any of our clans in Clash of Clans</p>
            <Button variant="secondary">View Clans</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact

