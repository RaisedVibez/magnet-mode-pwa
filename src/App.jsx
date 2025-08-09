import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ---------- Demo data ---------- */
const tracks = [
  "3:33 HR Magnetic",
  "Everything is a Miracle",
  "Whispers of the Unseen",
  "Future Timeline 8/8 Portal",
]

/* ---------- Helpers ---------- */
function readLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function writeLS(key, v) { try { localStorage.setItem(key, JSON.stringify(v)) } catch {} }
const todayISO = () => new Date().toISOString().slice(0, 10)

function getGreeting(date = new Date()){
  const h = date.getHours()
  if (h < 12) return "Good Morning"
  if (h < 18) return "Good Afternoon"
  return "Good Evening"
}

/* ---------- App ---------- */
export default function App(){
  const [tab, setTab] = useState('home')

  // core numbers
  const [seeds, setSeeds] = useState(readLS('seeds', 0))
  const [streak, setStreak] = useState(readLS('streak', 0))
  const [best, setBest] = useState(readLS('best', 0))
  const [orb, setOrb] = useState(readLS('orb', 40))
  const [community, setCommunity] = useState(readLS('community', 58))
  const [pods, setPods] = useState(readLS('pods', true))

  // modals & inputs
  const [nightOpen, setNightOpen] = useState(false)
  const [morningOpen, setMorningOpen] = useState(false)
  const [claim, setClaim] = useState('')
  const [mood, setMood] = useState(3)

  // win toast
  const [lastWin, setLastWin] = useState(null)

  // greeting banner
  const [greeting, setGreeting] = useState(getGreeting())
  useEffect(() => { const t = setInterval(() => setGreeting(getGreeting()), 60_000); return () => clearInterval(t) }, [])

  // daily story (once per day)
  const [showStory, setShowStory] = useState(false)
  useEffect(() => {
    const last = readLS('storyLastShown', '')
    const today = todayISO()
    if (last !== today) setShowStory(true)
  }, [])
  function dismissStory(){
    writeLS('storyLastShown', todayISO())
    setShowStory(false)
  }

  // persist + best
  useEffect(() => { writeLS('seeds', seeds) }, [seeds])
  useEffect(() => { writeLS('streak', streak); if (streak > best) { setBest(streak); writeLS('best', streak) } }, [streak])
  useEffect(() => { writeLS('orb', orb) }, [orb])
  useEffect(() => { writeLS('community', community) }, [community])
  useEffect(() => { writeLS('pods', pods) }, [pods])

  const dateStr = new Date().toLocaleDateString(undefined, { weekday:'long', month:'short', day:'numeric' })
  const hue = Math.round(200 + (orb + mood * 8))
  const orbStyle = {
    width: '18rem', height: '18rem', borderRadius: '9999px', marginTop:'8px',
    background: `radial-gradient(circle at 30% 30%, hsla(${hue},85%,70%,1), hsla(${hue},90%,45%,0.9) 45%, hsla(${hue},95%,35%,0.9) 65%, rgba(0,0,0,0.1) 100%)`,
    boxShadow: `0 0 60px hsla(${hue},90%,60%,0.55), inset 0 0 80px hsla(${hue},100%,65%,0.35)`
  }

  function celebrate(text){
    setLastWin(text)
    setSeeds(s => s + 1)
    setOrb(o => Math.min(100, o + 6))
  }
  function doNight(){
    if (!claim.trim()) return
    setNightOpen(false)
    setStreak(s => s + 1)
    setCommunity(c => Math.min(100, c + 2))
    celebrate(`Night locked: “${claim.toUpperCase()}”`)
    setClaim('')
  }
  function doMorning(){
    setMorningOpen(false)
    setStreak(s => s + 1)
    setCommunity(c => Math.min(100, c + 2))
    celebrate('Morning locked')
  }

  return (
    <div style={{minHeight:'100%', width:'100%', background:'#000', color:'#fff'}}>
      {/* Greeting / top bar */}
      <div style={{maxWidth:'900px', margin:'0 auto', padding:'12px 16px 0'}}>
        <div style={{background:'linear-gradient(180deg,#111,#0b0b0b)', border:'1px solid #2a2a2a', borderRadius:18, padding:'12px 14px'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap'}}>
            <div style={{fontWeight:700}}>✨ {greeting}, Magnet ✨</div>
            <div style={{fontSize:12, color:'#cfcfcf'}}>{dateStr}</div>
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', paddingTop:8}}>
          <div style={{fontSize:12, color:'#cfcfcf'}}>⭐ Star Seeds: {seeds}</div>
        </div>
      </div>

      {/* Main card */}
      <div style={{maxWidth:'900px', margin:'0 auto', padding:'0 16px'}}>
        <div style={{background:'#121212', border:'1px solid #2a2a2a', borderRadius:22, padding:16}}>
          <div style={{fontSize:'18px', fontWeight:700, display:'flex', alignItems:'center', gap:'8px'}}>✨ Magnetic Field</div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'8px'}}>
            <motion.div style={orbStyle} animate={{scale:[1,1.03,1]}} transition={{duration:3, repeat:Infinity, ease:'easeInOut'}} />
            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, width:'100%', marginTop:16, textAlign:'center'}}>
              <div><div style={{fontSize:'28px', fontWeight:700}}>{streak}🔥</div><div style={{fontSize:'12px', color:'#a1a1a1'}}>Current Streak</div></div>
              <div><div style={{fontSize:'28px', fontWeight:700}}>{orb}%</div><div style={{fontSize:'12px', color:'#a1a1a1'}}>Orb Charge</div></div>
              <div><div style={{fontSize:'28px', fontWeight:700}}>{best}</div><div style={{fontSize:'12px', color:'#a1a1a1'}}>Best</div></div>
            </div>

            {/* Actions */}
            <div style={{marginTop:'16px', display:'flex', flexWrap:'wrap', gap:'10px', justifyContent:'center'}}>
              <button style={btnPrimary} onClick={()=>setNightOpen(true)}>🌙 Night Check-in</button>
              <button style={btnSecondary} onClick={()=>setMorningOpen(true)}>☀️ Morning Habits</button>
            </div>

            {/* Daily story (once per day) */}
            <AnimatePresence>
              {showStory && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  style={cardSimple}
                >
                  <div style={{fontWeight:700, marginBottom:6}}>Raised Vibez • Daily Transmission</div>
                  <div style={{color:'#d6d6d6', lineHeight:1.5}}>
                    <b>Welcome to Raised Vibez</b> — your space to rewire, recharge, and rise.
                    Every check-in adds light to your field; every habit anchors your new timeline.
                    <b> Tap Morning & Night</b>, watch your Orb charge, and keep your streak glowing.
                    This is where intention turns to momentum — where you become the frequency that attracts what’s meant for you.
                  </div>
                  <div style={{height:10}} />
                  <button style={btnPrimary} onClick={dismissStory}>Got it — let’s rise</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quantum Card */}
            <div style={cardSimple}>
              <div style={{fontSize:12, letterSpacing:1, textTransform:'uppercase', color:'#bdbdbd'}}>Quantum Card</div>
              <div style={{marginTop:6, fontSize:16}}>The Magnet — <span style={{color:'#cfcfcf'}}>I become the frequency of what I desire.</span></div>
            </div>

            {/* Community Pulse */}
            <div style={cardSimple}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
                <div style={{fontSize:14, color:'#cfcfcf'}}>👥 Community Pulse</div>
                <div style={{fontSize:12, color:'#a1a1a1'}}>{community}% complete</div>
              </div>
              <div style={{height:8, background:'#1e1e1e', borderRadius:999, overflow:'hidden'}}>
                <div style={{height:'100%', width:`${community}%`, background:'#fff', transition:'width .4s ease'}} />
              </div>
              <div style={{marginTop:8, fontSize:12, color:'#d8c17a'}}>♾ PORTAL BONUS — claim both check-ins to unlock a mini-audio.</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{marginTop:16}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, background:'#121212', border:'1px solid #2a2a2a', borderRadius:18, padding:6}}>
            {['home','rewards','challenge','settings'].map(k => (
              <div key={k}
                   onClick={()=>setTab(k)}
                   style={{textAlign:'center', padding:8, borderRadius:12, cursor:'pointer', background: tab===k ? '#1a1a1a' : 'transparent'}}>
                {k[0].toUpperCase()+k.slice(1)}
              </div>
            ))}
          </div>

          {tab==='rewards' && (
            <div style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit, minmax(260px,1fr))', marginTop:16}}>
              <div style={cardSimple}>
                <div style={{fontWeight:700, marginBottom:8}}>🏆 Milestones</div>
                <div>🔥 7-day portal: unlock mini audio</div>
                <div>🔥 14-day: evolving sound sigil</div>
                <div>🔥 21-day: wallpaper pack + streak insurance</div>
              </div>
              <div style={cardSimple}>
                <div style={{fontWeight:700, marginBottom:8}}>🎁 Vault</div>
                <div style={{marginBottom:8}}>Star Seeds: <b>{seeds}</b></div>
                <button style={btnPrimary} onClick={()=>alert('Wallpaper generated (demo).')}>Generate Sigil Wallpaper</button>
                <div style={{height:8}} />
                <button style={btnSecondary} onClick={()=>alert('Playing sound sigil (demo).')}>Play Sound Sigil</button>
              </div>
            </div>
          )}

          {tab==='challenge' && (
            <div style={cardSimple}>
              <div style={{fontWeight:700, marginBottom:8}}>7-Day Magnetic Challenge</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8}}>
                {[1,2,3,4,5,6,7].map(d => (
                  <div key={d} style={{aspectRatio:'1/1', display:'grid', placeItems:'center', border:'1px solid #2a2a2a', borderRadius:12, background:'#0a0a0a'}}>
                    {d < 7 ? '⭐' : '❤️'}
                  </div>
                ))}
              </div>
              <div style={{marginTop:8, color:'#cfcfcf'}}>Check in nightly with your claim word. Morning: complete at least 2 habits.</div>
            </div>
          )}

          {tab==='settings' && (
            <div style={cardSimple}>
              <div style={{fontWeight:700, marginBottom:8}}>Preferences</div>
              <Row label="Night Nudge (9:30 PM)"><input type="checkbox" defaultChecked /></Row>
              <Row label="Morning Spark (7:00 AM)"><input type="checkbox" defaultChecked /></Row>
              <Row label="Pods on by default"><input type="checkbox" checked={pods} onChange={e=>setPods(e.target.checked)} /></Row>
            </div>
          )}
        </div>
      </div>

      {/* Night modal */}
      <AnimatePresence>
        {nightOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={backdrop}>
            <motion.div initial={{y:40, opacity:0}} animate={{y:0, opacity:1}} exit={{y:10, opacity:0}} style={modal}>
              <div style={modalTitle}>🌙 Night Check-in</div>
              <div style={subtleLabel}>Track</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8, marginTop:6}}>
                {tracks.map(t => <button key={t} style={pill} onClick={()=>{}}>{t}</button>)}
              </div>
              <div style={{height:8}} />
              <div style={subtleLabel}>Mood</div>
              <input type="range" min="1" max="5" step="1" value={mood} onChange={e=>setMood(parseInt(e.target.value))} />
              <div style={{fontSize:12, color:'#a1a1a1'}}>Felt-state: {mood} / 5</div>
              <div style={{height:8}} />
              <div style={subtleLabel}>Claim Word</div>
              <input value={claim} onChange={e=>setClaim(e.target.value)} placeholder="Type a word from tonight’s meditation" style={input} />
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12}}>
                <div>🎧 Pods on?</div>
                <input type="checkbox" checked={pods} onChange={e=>setPods(e.target.checked)} />
              </div>
              <div style={{display:'flex', gap:8, marginTop:12}}>
                <button style={{...btnPrimary, flex:1}} onClick={doNight}>Claim Win</button>
                <button style={{...btnSecondary, flex:1}} onClick={()=>setNightOpen(false)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Morning modal */}
      <AnimatePresence>
        {morningOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={backdrop}>
            <motion.div initial={{y:40, opacity:0}} animate={{y:0, opacity:1}} exit={{y:10, opacity:0}} style={modal}>
              <div style={modalTitle}>☀️ Morning Habits</div>
              {['Hydrate','3 breaths + mantra','2-min movement','Gratitude note'].map(h => (
                <label key={h} style={habitRow}>
                  <input type="checkbox" /> <span>{h}</span>
                </label>
              ))}
              <div style={{display:'flex', gap:8, marginTop:12}}>
                <button style={{...btnPrimary, flex:1}} onClick={doMorning}>Mark Complete</button>
                <button style={{...btnSecondary, flex:1}} onClick={()=>setMorningOpen(false)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win toast */}
      <AnimatePresence>
        {lastWin && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:'fixed', inset:0, pointerEvents:'none'}}>
            {[...Array(24)].map((_,i)=>(
              <motion.div key={i} initial={{x: Math.random()*window.innerWidth, y: window.innerHeight+20, opacity:0}}
                animate={{y:-40, opacity:[0,1,1,0]}} transition={{duration:1.6+Math.random(), delay: Math.random()*.3}} style={{position:'absolute'}}>
                ⭐
              </motion.div>
            ))}
            <motion.div initial={{y:40, opacity:0}} animate={{y:0, opacity:1}} exit={{y:20, opacity:0}}
              style={{position:'fixed', left:'50%', transform:'translateX(-50%)', bottom:'20px', background:'#121212', border:'1px solid #2a2a2a', borderRadius:14, padding:'10px 14px'}}>
              ✨ {lastWin}
            </motion.div>
            <AutoHide onHide={()=>setLastWin(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- Small components & styles ---------- */
function Row({ label, children }) {
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', margin:'10px 0'}}>
      <div>{label}</div>
      {children}
    </div>
  )
}
function AutoHide({ onHide, ms = 2200 }){
  useEffect(()=>{ const t=setTimeout(onHide, ms); return ()=>clearTimeout(t) }, [onHide, ms])
  return null
}

const cardSimple   = { background:'#121212', border:'1px solid #2a2a2a', borderRadius:16, padding:12, width:'100%', marginTop:16 }
const btnPrimary   = { background:'#fff', color:'#111', border:'none', padding:'.75rem 1rem', borderRadius:14, fontWeight:600, cursor:'pointer' }
const btnSecondary = { background:'#1a1a1a', color:'#eee', border:'1px solid #2a2a2a', padding:'.75rem 1rem', borderRadius:14, fontWeight:600, cursor:'pointer' }
const pill         = { border:'1px solid #2a2a2a', background:'#0a0a0a', padding:'.5rem .7rem', borderRadius:12, color:'#e5e5e5' }
const backdrop     = { position:'fixed', inset:0, background:'rgba(0,0,0,.6)', backdropFilter:'blur(3px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16, zIndex:50 }
const modal        = { width:'100%', maxWidth:600, background:'#121212', border:'1px solid #2a2a2a', borderRadius:22, padding:20 }
const modalTitle   = { fontSize:18, fontWeight:700, marginBottom:8 }
const subtleLabel  = { fontSize:12, letterSpacing:1, textTransform:'uppercase', color:'#bdbdbd' }
const habitRow     = { display:'flex', gap:10, alignItems:'center', padding:10, border:'1px solid #2a2a2a', borderRadius:12, background:'#0a0a0a', marginTop:8 }
const input        = { width:'100%', background:'#0a0a0a', border:'1px solid #2a2a2a', color:'#e5e5e5', padding:'.7rem .8rem', borderRadius:12 }
