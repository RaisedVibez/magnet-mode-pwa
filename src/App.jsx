import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const tracks = [
  "3:33 HR Magnetic",
  "Everything is a Miracle",
  "Whispers of the Unseen",
  "Future Timeline 8/8 Portal",
]

// Local storage helpers
function readLS(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function writeLS(key, v) {
  try {
    localStorage.setItem(key, JSON.stringify(v))
  } catch {}
}

// Greeting based on time of day
function getGreeting(date = new Date()) {
  const h = date.getHours()
  if (h < 12) return "Good Morning"
  if (h < 18) return "Good Afternoon"
  return "Good Evening"
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [showBanner, setShowBanner] = useState(true)

  const greeting = useMemo(() => getGreeting(), [])

  return (
    <div className="app" style={{ fontFamily: 'sans-serif', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      
      {/* Welcome Banner */}
      {showBanner && (
        <div style={{
          background: 'linear-gradient(180deg,#111,#0b0b0b)',
          border: '1px solid #2a2a2a',
          borderRadius: 18,
          padding: '12px 14px',
          margin: '12px 16px',
          textAlign: 'center'
        }}>
          ✨ {greeting}, Magnet ✨
        </div>
      )}

      {/* Example Orb UI */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(155,0,255,1) 0%, rgba(55,0,105,1) 100%)',
            boxShadow: '0 0 50px rgba(155,0,255,0.7)'
          }}
        />
        <p style={{ marginTop: 20 }}>Orb Charge: 52%</p>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#111',
        padding: '10px 0',
        display: 'flex',
        justifyContent: 'space-around',
        borderTop: '1px solid #333'
      }}>
        <button style={{ background: 'none', border: 'none', color: '#fff' }}>Home</button>
        <button style={{ background: 'none', border: 'none', color: '#fff' }}>Rewards</button>
        <button style={{ background: 'none', border: 'none', color: '#fff' }}>Challenge</button>
        <button style={{ background: 'none', border: 'none', color: '#fff' }}>Settings</button>
      </div>

    </div>
  )
}
