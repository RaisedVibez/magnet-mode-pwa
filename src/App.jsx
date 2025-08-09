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
    <div className="app">
      {/* Welcome Banner */}
      <AnimatePresenc
