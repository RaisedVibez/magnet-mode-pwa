import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const tracks = [
  "3:33 HR Magnetic",
  "Everything is a Miracle",
  "Whispers of the Unseen",
  "Future Timeline 8/8 Portal",
]

// ---- Local storage helpers ----
function readLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function writeLS(key, v) { try { localStorage.setItem(key, JSON.stringify(v)) } catch {} }
const todayISO = () => new Date().toISOString().slice(0,10)

// ---- Greeting helper ----
function getGreeting(date = new Date()){
  const h = date.getHours()
  if (h < 12) return "Good Morning"
  if (h < 18) return "Good Afternoon"
  return "Good Evening"
}

export default function App(){
  const [tab, setTab] = useState('home')
  const [seeds, setSeeds] = useState(readLS('seeds', 0))
  const [streak, setStreak] = useState(readLS('streak', 0))
  const [best, setBest] = useState(readLS('best', 0))
  const [orb, setOrb] = useState(readLS('orb', 40))
  const [community, setCommunity] = useState(readLS('community', 58))
  const [pods, setPods] = useState(readLS('pods', true))
  const [nightOpen, setNightOpen] = useState(false)
  const [morningOpen, setMorningOpen] = useState(false)
  const [claim, setClaim] = useState('')
  const [mood, setMood] = useState(3)
  const [lastWin, setLastWin] = useState(null)

  // Greeting banner
  const [greeting, setGreeting] = useState(getGreeting())
  useEffect(() => { const t = setInterval(() => setGreeting(getGreeting()), 60_000); return () => clearInterval(t) }, [])

  // ONCE-PER-DAY story card visibility
  const [showStory, setShowStory] = useState(false)
  useEffect(() => {
    const last = readLS('storyLastShown', '')
    const today = todayISO()
    if (last !== today) setShowStory(true)
  }, [])
  function dismissStory() {
    writeLS('storyLastShown', todayISO())
    setShowStory(false)
  }

  // persist + streak/
