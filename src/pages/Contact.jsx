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
            <p>Join our Discord server for instant communication and community updates</p>
            <a
              href="https://discord.gg/Cqsq65tY2S"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Join Discord
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">📱</div>
            <h4>WhatsApp</h4>
            <p>Connect with us on WhatsApp for recruitment and clan discussions</p>
            <a
              href="https://chat.whatsapp.com/HBCQFJ6xvcy5Lq8tW3YjG6"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Join WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact

