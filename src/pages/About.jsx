import React from 'react'
import SectionTitle from '../components/SectionTitle'
import Card from '../components/Card'

function About() {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Built with Vite for blazing fast development and optimized builds'
    },
    {
      icon: '🎨',
      title: 'Modern Design',
      description: 'Clean and responsive UI that works on all devices'
    },
    {
      icon: '🚀',
      title: 'Easy Deploy',
      description: 'One command deployment to GitHub Pages'
    }
  ]

  return (
    <section className="about">
      <SectionTitle>About Trinity</SectionTitle>
      <div className="about-content">
        <p className="about-description">
          Trinity is a family of Clash of Clans clans dedicated to providing the best gaming experience 
          for players of all levels. We focus on teamwork, strategy, and having fun together.
        </p>
      </div>
      
      <SectionTitle>Features</SectionTitle>
      <div className="feature-grid">
        {features.map((feature, index) => (
          <Card
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            variant="feature"
          />
        ))}
      </div>
    </section>
  )
}

export default About

