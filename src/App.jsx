import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'


const tracks = [
  "3:33 HR Magnetic",
  "Everything is a Miracle",
  "Whispers of the Unseen",
  "Future Timeline 8/8 Portal",
]

function readLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function writeLS(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
}

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

  // NEW: greeting + banner pulse on streak increase
  const [greeting, setGreeting] = useState(getGreeting())
  const [pulse, setPulse] = useState(false)
  const [prevStreak, setPrevStreak] = useState(readLS('prevStreak', 0))

  useEffect(() => {
    // update greeting every 60s
    const t = setInterval(() => setGreeting(getGreeting()), 60_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => { writeLS('seeds',seeds) }, [seeds])
  useEffect(() => {
    writeLS('streak',streak)
    if(streak>best){ setBest(streak); writeLS('best',streak) }
    // pulse if streak increased
    if (streak > prevStreak){
      setPulse(true)
      const timer = setTimeout(()=> setPulse(false), 1200)
      setPrevStreak(streak); writeLS('prevStreak', streak)
    }
  }, [streak])
  useEffect(() => { writeLS('orb',orb) }, [orb])
  useEffect(() => { writeLS('community',community) }, [community])
  useEffect(() => { writeLS('pods',pods) }, [pods])

  const dateStr = new Date().toLocaleDateString(undefined, { weekday:'long', month:'short', day:'numeric' })
  const hue = Math.round(200 + (orb + mood * 8))
  const orbStyle = {
    width: '18rem', height: '18rem', borderRadius: '9999px', marginTop:'8px',
    background: `radial-gradient(circle at 30% 30%, hsla(${hue},85%,70%,1), hsla(${hue},90%,45%,0.9) 45%, hsla(${hue},95%,35%,0.9) 65%, rgba(0,0,0,0.1) 100%)`,
    boxShadow: `0 0 60px hsla(${hue},90%,60%,0.55), inset 0 0 80px hsla(${hue},100%,65%,0.35)`
  }

  function celebrate(text){
    setLastWin(text)
    setSeeds(s=>s+1)
    setOrb(o=>Math.min(100, o+6))
  }

  function doNight(){
    if(!claim.trim()) return
    setNightOpen(false)
    setStreak(s=>s+1)
    setCommunity(c=>Math.min(100, c+2))
    celebrate(`Night locked: “${claim.toUpperCase()}”`)
    setClaim('')
  }
  function doMorning(){
    setMorningOpen(false)
    setStreak(s=>s+1)
    setCommunity(c=>Math.min(100, c+2))
    celebrate('Morning locked')
  }

  // Little gold glow style
  const goldGlow = pulse
    ? { boxShadow: '0 0 0 2px #3a2f06, 0 0 30px 6px rgba(212,175,55,.45)' }
    : { boxShadow: '0 0 0 1px #2a2a2a' }

  return (
    <div style={{minHeight:'100%', width:'100%'}}>
      <div style={{maxWidth: '900px', margin: '0 auto', padding:'16px 16px 8px'}}>

        {/* NEW: Dynamic Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            ...goldGlow,
            background: 'linear-gradient(180deg, #111, #0b0b0b)',
            borderRadius: 18,
            padding: '12px 14px',
            border: '1px solid #2a2a2a'
          }}
        >
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap'}}>
            <div>
              <div style={{fontWeight:700}}>
                ✨ {greeting}, Magnet ✨
              </div>
              <div style={{fontSize:12, color:'#cfcfcf', marginTop:4}}>
                You’re on a <b>{streak}-day streak</b> — your field is growing.
              </div>
            </div>
            <div className="badge">{dateStr}</div>
          </div>
        </motion.div>

        {/* Star Seeds header line */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', paddingTop:8}}>
          <div className="badge">⭐ Star Seeds: {seeds}</div>
        </div>
      </div>

      <div style={{maxWidth: '900px', margin:'0 auto', padding:'0 16px'}}>
        <div className="card">
          <div style={{fontSize:'18px', fontWeight:700, display:'flex', alignItems:'center', gap:'8px'}}>✨ Magnetic Field</div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'8px'}}>
            <motion.div style={orbStyle} animate={{scale:[1,1.03,1]}} transition={{duration:3, repeat:Infinity, ease:'easeInOut'}} />
            <div className="grid3" style={{width:'100%', marginTop:'16px', textAlign:'center'}}>
              <div><div style={{fontSize:'28px', fontWeight:700}}>{streak}🔥</div><div style={{fontSize:'12px', color:'#a1a1a1'}}>Current Streak</div></div>
              <div><div style={{fontSize:'28px', fontWeight:700}}>{orb}%</div><div style={{fontSize:'12px', color:'#a1a1a1'}}>Orb Charge</div></div>
              <div><div style={{fontSize:'28px', fontWeight:700}}>{best}</div><div style={{fontSize:'12px', color:'#a1a1a1'}}>Best</div></div>
            </div>
            <div style={{marginTop:'16px', display:'flex', flexWrap:'wrap', gap:'10px', justifyContent:'center'}}>
              <button className="btn" onClick={()=>setNightOpen(true)}>🌙 Night Check-in</button>
              <button className="btn secondary" onClick={()=>setMorningOpen(true)}>☀️ Morning Habits</button>
            </div>

            <div className="card" style={{width:'100%', marginTop:'16px'}}>
              <div className="badge">Quantum Card</div>
              <div style={{marginTop:'6px', fontSize:'16px'}}>The Magnet — <span style={{color:'#cfcfcf'}}>I become the frequency of what I desire.</span></div>
            </div>

            <div className="card" style={{width:'100%', marginTop:'16px'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px'}}>
                <div style={{fontSize:'14px', color:'#cfcfcf'}}>👥 Community Pulse</div>
                <div style={{fontSize:'12px', color:'#a1a1a1'}}>{community}% complete</div>
              </div>
              <div className="progress"><div style={{width:`${community}%`, transition:'width .4s ease'}}></div></div>
              <div style={{marginTop:'8px', fontSize:'12px', color:'#d8c17a'}}>♾ PORTAL BONUS — claim both check-ins to unlock a mini-audio.</div>
            </div>
          </div>
        </div>

        <div style={{marginTop:'16px'}}>
          <div className="tabs">
            {['home','rewards','challenge','settings'].map(k => (
              <div key={k} className={'tab ' + (tab===k?'active':'')} onClick={()=>setTab(k)}>
                {k[0].toUpperCase()+k.slice(1)}
              </div>
            ))}
          </div>

          {tab==='rewards' && (
            <div style={{display:'grid', gap:'16px', gridTemplateColumns:'repeat(auto-fit, minmax(260px,1fr))', marginTop:'16px'}}>
              <div className="card">
                <div style={{fontWeight:700, marginBottom:'8px'}}>🏆 Milestones</div>
                <div>🔥 7-day portal: unlock mini audio</div>
                <div>🔥 14-day: evolving sound sigil</div>
                <div>🔥 21-day: wallpaper pack + streak insurance</div>
              </div>
              <div className="card">
                <div style={{fontWeight:700, marginBottom:'8px'}}>🎁 Vault</div>
                <div style={{marginBottom:'8px'}}>Star Seeds: <b>{seeds}</b></div>
                <button className="btn" onClick={()=>alert('Wallpaper generated (demo).')}>Generate Sigil Wallpaper</button>
                <div style={{height:'8px'}}></div>
                <button className="btn secondary" onClick={()=>alert('Playing sound sigil (demo).')}>Play Sound Sigil</button>
              </div>
            </div>
          )}

          {tab==='challenge' && (
            <div className="card" style={{marginTop:'16px'}}>
              <div style={{fontWeight:700, marginBottom:'8px'}}>7-Day Magnetic Challenge</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'8px'}}>
                {[1,2,3,4,5,6,7].map(d => (
                  <div key={d} style={{aspectRatio:'1/1', display:'grid', placeItems:'center'}} className="pill">{d<7?'⭐':'❤️'}</div>
                ))}
              </div>
              <div style={{marginTop:'8px', color:'#cfcfcf'}}>Check in nightly with your claim word. Morning: complete at least 2 habits.</div>
            </div>
          )}

          {tab==='settings' && (
            <div className="card" style={{marginTop:'16px'}}>
              <div style={{fontWeight:700, marginBottom:'8px'}}>Preferences</div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', margin:'10px 0'}}>
                <div>Night Nudge (9:30 PM)</div><input type="checkbox" defaultChecked />
              </div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', margin:'10px 0'}}>
                <div>Morning Spark (7:00 AM)</div><input type="checkbox" defaultChecked />
              </div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', margin:'10px 0'}}>
                <div>Pods on by default</div><input type="checkbox" checked={pods} onChange={e=>setPods(e.target.checked)} />
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {nightOpen && (
          <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <motion.div className="modal" initial={{y:40, opacity:0}} animate={{y:0, opacity:1}} exit={{y:10, opacity:0}}>
              <div style={{fontSize:'18px', fontWeight:700, marginBottom:'8px'}}>🌙 Night Check-in</div>
              <div className="badge">Track</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'8px', marginTop:'6px'}}>
                {tracks.map(t => <button key={t} className="pill" onClick={()=>{}}>{t}</button>)}
              </div>
              <div style={{height:'8px'}}></div>
              <div className="badge">Mood</div>
              <input type="range" min="1" max="5" step="1" value={mood} onChange={e=>setMood(parseInt(e.target.value))} />
              <div style={{fontSize:'12px', color:'#a1a1a1'}}>Felt-state: {mood} / 5</div>
              <div style={{height:'8px'}}></div>
              <div className="badge">Claim Word</div>
              <input type="text" value={claim} onChange={e=>setClaim(e.target.value)} placeholder="Type a word from tonight’s meditation" />
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'12px'}}>
                <div>🎧 Pods on?</div>
                <input type="checkbox" checked={pods} onChange={e=>setPods(e.target.checked)} />
              </div>
              <div style={
