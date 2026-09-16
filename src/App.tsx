import { useState, useEffect, useRef, useCallback } from 'react'
import infomateLogo from '@/imports/WhatsApp_Image_2026-09-14_at_2.18.32_PM__1_-1.jpeg'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  GraduationCap, Users, Bell, Search, BookOpen, Zap, Calendar, MessageSquare,
  Star, Bookmark, ChevronRight, X, Send, Bot, User, LogOut, Settings,
  Trophy, Code2, Cpu, Megaphone, Globe, Filter, Plus, Hash,
  TrendingUp, Clock, MapPin, CheckCircle, AlertCircle, Info,
  Sparkles, ArrowRight, Menu, Home, Layers, FileText, Heart, Eye,
  Github, ExternalLink, Shield, Award, Target, Lightbulb, Building2,
  ChevronDown, ChevronUp, BarChart3, PieChart, Activity, Flame,
  Music, Camera, Handshake, Leaf, Radio, UserCheck, Upload, Edit3,
  LayoutDashboard, PanelLeft, Command
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Page = 'landing' | 'onboarding' | 'student-dashboard' | 'coordinator-dashboard'
type DashTab = 'home' | 'notices' | 'societies' | 'hackathons' | 'teams' | 'communities' | 'bookmarks'
type CoordTab = 'overview' | 'posts' | 'events' | 'recruitment' | 'analytics'

interface StudentProfile {
  name: string; email: string; branch: string; year: string; course: string
  location: string; skills: string[]; interests: string[]; societies: string[]
  infoPrefs: string[]
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const SOCIETIES = [
  { id: 'hypnotics', name: 'Hypnotics', icon: '🎭', color: '#7C3AED', desc: 'Drama & performing arts society', members: 120, followers: 340, tags: ['Arts','Performance','Drama'] },
  { id: 'rotaract', name: 'Rotaract', icon: '🌍', color: '#059669', desc: 'Community service & leadership', members: 200, followers: 560, tags: ['Service','Leadership','Community'] },
  { id: 'asic-mogul', name: 'Asic Mogul', icon: '⚡', color: '#DC2626', desc: 'VLSI & chip design enthusiasts', members: 85, followers: 220, tags: ['VLSI','Electronics','Hardware'] },
  { id: 'synergy', name: 'Synergy', icon: '🚀', color: '#2563EB', desc: 'Tech & entrepreneurship hub', members: 310, followers: 780, tags: ['Tech','Startup','Innovation'] },
  { id: 'taaran', name: 'Taaran', icon: '🎵', color: '#C9A227', desc: 'Music & cultural expressions', members: 145, followers: 410, tags: ['Music','Culture','Arts'] },
]

const NOTICES = [
  { id: 1, title: 'Mid-Semester Examination Schedule Released', priority: 'urgent', category: 'Exams', time: '2h ago', source: 'Academic Section', desc: 'Mid-term exams for all branches begin Oct 14. Check your individual timetable on the portal.', link: '#', why: 'Matches your branch (IT) and year (3rd)' },
  { id: 2, title: 'Smart India Hackathon 2026 — Last Date to Register', priority: 'urgent', category: 'Hackathons', time: '4h ago', source: 'Training & Placement Cell', desc: 'SIH 2026 internal hackathon round registrations close Sept 20. Form teams of 6.', link: '#', why: 'Matches your interest in Web Dev & AI/ML' },
  { id: 3, title: 'AICTE Scholarship Applications Open for 2026-27', priority: 'important', category: 'Scholarships', time: '1d ago', source: 'Scholarship Cell', desc: 'AICTE PG scholarship for women in engineering. Stipend ₹12,400/month.', link: '#', why: 'Available for your branch and year' },
  { id: 4, title: 'New Elective Registration: AI in Healthcare', priority: 'recommended', category: 'Academics', time: '2d ago', source: 'IT Department', desc: 'New 4-credit elective available for 3rd year IT students for odd semester.', link: '#', why: 'Relevant to your AI/ML interest & IT branch' },
  { id: 5, title: 'Campus Placement Drive — Amazon SDE Roles', priority: 'important', category: 'Placements', time: '3h ago', source: 'T&P Cell', desc: 'Amazon campus recruitment for 2026 batch. Roles: SDE-1. Package: 28LPA.', link: '#', why: 'Your graduation year matches the 2026 batch' },
  { id: 6, title: 'Library Extended Hours During Exam Period', priority: 'general', category: 'General', time: '1d ago', source: 'Library', desc: 'Library will remain open until 11PM from Oct 12-30 during exam season.', link: '#', why: 'General campus update' },
]

const HACKATHONS = [
  { id: 1, name: 'Smart India Hackathon 2026', org: 'Ministry of Education', type: 'Offline', location: 'Pan India', deadline: 'Sept 20, 2026', prize: '₹1,00,000', matchScore: 96, tags: ['AI/ML','Web Dev','IoT'], eligibility: 'All years', why: 'Your Web Dev & Python skills match 4/5 themes', category: 'Government' },
  { id: 2, name: 'HackWithInfy 2026', org: 'Infosys', type: 'Online', location: 'Remote', deadline: 'Oct 5, 2026', prize: '₹50,000', matchScore: 88, tags: ['Web Dev','Mobile','Cloud'], eligibility: '3rd & 4th year', why: 'Strong Web Dev match, cloud interest aligns', category: 'Corporate' },
  { id: 3, name: 'Flipkart GRiD 5.0', org: 'Flipkart', type: 'Online', location: 'Remote', deadline: 'Oct 12, 2026', prize: '₹75,000', matchScore: 82, tags: ['DSA','System Design','ML'], eligibility: 'All years', why: 'Your DSA skills match the elimination rounds', category: 'Corporate' },
  { id: 4, name: 'Unstop Hackathon League', org: 'Unstop', type: 'Online', location: 'Remote', deadline: 'Rolling', prize: '₹25,000', matchScore: 79, tags: ['Open Innovation','Tech'], eligibility: 'All years', why: 'Open theme suits your versatile skill set', category: 'Open' },
]

const TEAMS = [
  { id: 1, leader: 'Priya Sharma', branch: 'CSE', year: '3rd', hackathon: 'SIH 2026', looking: ['UI/UX Designer', 'ML Engineer'], skills: ['React', 'Node.js', 'Python'], size: '4/6', avatar: 'PS', theme: '#8B1A3A' },
  { id: 2, leader: 'Anika Gupta', branch: 'IT', year: '3rd', hackathon: 'HackWithInfy 2026', looking: ['Backend Dev', 'DevOps'], skills: ['Flutter', 'Firebase', 'AWS'], size: '3/5', avatar: 'AG', theme: '#1A5C3A' },
  { id: 3, leader: 'Sneha Rao', branch: 'AI/ML', year: '4th', hackathon: 'Flipkart GRiD', looking: ['Data Scientist'], skills: ['PyTorch', 'FastAPI', 'React'], size: '4/5', avatar: 'SR', theme: '#2563EB' },
]

const COMMUNITIES = [
  { id: 'it', name: 'IT Department', icon: '💻', members: 420, posts: 1240, color: '#8B1A3A', desc: 'Information Technology dept community' },
  { id: 'cse', name: 'CSE Department', icon: '🖥️', members: 580, posts: 2100, color: '#1A5C3A', desc: 'Computer Science & Engineering' },
  { id: 'aiml', name: 'AI/ML Club', icon: '🤖', members: 290, posts: 890, color: '#7C3AED', desc: 'Artificial Intelligence & Machine Learning' },
  { id: 'ece', name: 'ECE/AI Branch', icon: '📡', members: 195, posts: 560, color: '#C9A227', desc: 'Electronics & Communication Engineering' },
  { id: 'general', name: 'IGDTUW General', icon: '🏛️', members: 1850, posts: 4200, color: '#2563EB', desc: 'All IGDTUW students' },
]

const AI_RESPONSES: Record<string, string> = {
  default: "I'm your InfoMate AI assistant! I can help you with campus notices, deadlines, finding teammates, society info, hackathon recommendations, and more. What do you need today?",
  deadline: "📅 **This week's deadlines:**\n\n🔴 **Sept 20** — SIH 2026 Internal Registration\n🟠 **Sept 22** — AICTE Scholarship Application\n🔵 **Sept 25** — New Elective Add/Drop window\n⚪ **Sept 30** — Library book return\n\nWant me to set reminders for any of these?",
  teammate: "🤝 **Finding teammates for you...**\n\nBased on your IT/3rd year profile, I found 3 students looking for team members:\n\n1. **Priya Sharma (CSE-3)** — SIH 2026, needs UI/UX\n2. **Riya Mehta (IT-3)** — HackWithInfy, needs Backend\n3. **Neha Singh (AI/ML-4)** — Flipkart GRiD, needs React dev\n\nShall I send a connection request to any of them?",
  notice: "📢 **Today's important notices:**\n\n🔴 Mid-sem timetable released — exams start Oct 14\n🔴 SIH 2026 registration closes Sept 20\n🟠 Amazon placement drive announced — 28LPA package\n🟠 AICTE scholarship open for women in engineering\n\nAll notices are verified from official IGDTUW sources.",
  society: "🎭 **Societies you might love:**\n\n• **Synergy** — Tech & startup hub (96% match for your interests)\n• **Hypnotics** — Drama & arts (if you listed performing arts)\n• **Rotaract** — Community service (leadership interest match)\n\nSynergy is currently recruiting! Want to see their open roles?",
}

// ─── LOGO COMPONENT ────────────────────────────────────────────────────────────
function InfoMateLogo({ size = 'md', showTagline = false }: { size?: 'sm' | 'md' | 'lg', showTagline?: boolean }) {
  const sizes = { sm: { img: 32, text: 18 }, md: { img: 44, text: 24 }, lg: { img: 64, text: 36 } }
  const s = sizes[size]
  return (
    <div className="flex items-center gap-2">
      <img
        src={infomateLogo}
        alt="InfoMate logo"
        style={{ width: s.img, height: s.img, objectFit: 'contain' }}
        className="flex-shrink-0"
      />
      <div>
        <div className="font-bold leading-none" style={{ fontSize: s.text, fontFamily: 'Plus Jakarta Sans' }}>
          <span style={{ color: '#8B1A3A' }}>info</span><span style={{ color: '#1A5C3A' }}>Mate</span>
        </div>
        {showTagline && <div className="text-xs text-gray-500 mt-0.5 tracking-wide">Turning Campus Chaos into Clarity</div>}
      </div>
    </div>
  )
}

// ─── CUSTOM CURSOR ─────────────────────────────────────────────────────────────
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current; const ring = ringRef.current
    if (!cursor || !ring) return
    let mx = 0, my = 0, rx = 0, ry = 0

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px'
      requestAnimationFrame(tick)
    }
    tick()

    const addHover = () => document.body.classList.add('cursor-hover')
    const removeHover = () => document.body.classList.remove('cursor-hover')
    document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  )
}

// ─── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  const colors = { success: 'bg-green-50 border-green-200 text-green-800', error: 'bg-red-50 border-red-200 text-red-800', info: 'bg-blue-50 border-blue-200 text-blue-800' }
  return (
    <motion.div initial={{ x: 120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 120, opacity: 0 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium ${colors[type]}`}>
      {type === 'success' && <CheckCircle size={16} />}
      {type === 'error' && <AlertCircle size={16} />}
      {type === 'info' && <Info size={16} />}
      {message}
      <button onClick={onClose} className="ml-auto opacity-60 hover:opacity-100"><X size={14} /></button>
    </motion.div>
  )
}

// ─── COMMAND PALETTE ───────────────────────────────────────────────────────────
function CommandPalette({ onClose, onNavigate }: { onClose: () => void; onNavigate: (p: Page, t?: DashTab) => void }) {
  const [q, setQ] = useState('')
  const commands = [
    { label: 'Go to Dashboard', icon: Home, action: () => onNavigate('student-dashboard', 'home') },
    { label: 'View Notices', icon: Bell, action: () => onNavigate('student-dashboard', 'notices') },
    { label: 'Browse Societies', icon: Users, action: () => onNavigate('student-dashboard', 'societies') },
    { label: 'Find Hackathons', icon: Trophy, action: () => onNavigate('student-dashboard', 'hackathons') },
    { label: 'Form a Team', icon: Handshake, action: () => onNavigate('student-dashboard', 'teams') },
    { label: 'Communities', icon: Hash, action: () => onNavigate('student-dashboard', 'communities') },
    { label: 'Coordinator Login', icon: Shield, action: () => onNavigate('coordinator-dashboard') },
  ]
  const filtered = commands.filter(c => c.label.toLowerCase().includes(q.toLowerCase()))
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn); return () => window.removeEventListener('keydown', fn)
  }, [onClose])
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 cmd-overlay flex items-start justify-center pt-24"
        onClick={onClose}>
        <motion.div initial={{ y: -20, scale: 0.97 }} animate={{ y: 0, scale: 1 }}
          className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <Command size={18} className="text-gray-400" />
            <input autoFocus value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search pages, features, notices…"
              className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent" />
            <kbd className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">ESC</kbd>
          </div>
          <div className="py-2 max-h-64 overflow-y-auto">
            {filtered.map((c, i) => (
              <button key={i} onClick={() => { c.action(); onClose() }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-left transition-colors">
                <c.icon size={16} className="text-gray-400" />
                <span className="text-gray-800">{c.label}</span>
                <ChevronRight size={14} className="ml-auto text-gray-300" />
              </button>
            ))}
            {filtered.length === 0 && <div className="px-4 py-6 text-center text-sm text-gray-400">No results found</div>}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── AI CHAT PANEL ─────────────────────────────────────────────────────────────
function AIChatPanel({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState([{ role: 'ai', text: AI_RESPONSES.default }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const send = useCallback(() => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMsgs(m => [...m, { role: 'user', text: userMsg }])
    setInput(''); setTyping(true)
    setTimeout(() => {
      const lower = userMsg.toLowerCase()
      const resp = lower.includes('deadline') ? AI_RESPONSES.deadline
        : lower.includes('team') || lower.includes('teammate') ? AI_RESPONSES.teammate
        : lower.includes('notice') || lower.includes('today') ? AI_RESPONSES.notice
        : lower.includes('society') || lower.includes('club') ? AI_RESPONSES.society
        : "I can help you with that! Try asking about **deadlines**, **teammates**, **notices**, or **societies**. 🎓"
      setMsgs(m => [...m, { role: 'ai', text: resp }])
      setTyping(false)
    }, 1200)
  }, [input])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const quickActions = ['What needs attention today?', 'Find me teammates', 'Upcoming deadlines', 'Society recommendations']

  return (
    <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 28 }}
      className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-40 flex flex-col border-l border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100"
        style={{ background: 'linear-gradient(135deg, #8B1A3A, #A02244)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm">InfoMate AI</div>
            <div className="text-white/70 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> Always online
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors"><X size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold
              ${m.role === 'ai' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
              {m.role === 'ai' ? <Bot size={14} /> : 'Y'}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed
              ${m.role === 'ai' ? 'bg-gray-50 text-gray-800 rounded-tl-sm' : 'bg-red-800 text-white rounded-tr-sm'}`}
              dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
          </motion.div>
        ))}
        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center"><Bot size={14} className="text-red-700" /></div>
            <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map(i => <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                className="w-1.5 h-1.5 bg-gray-400 rounded-full inline-block" />)}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-2 flex gap-2 flex-wrap">
        {quickActions.map((a, i) => (
          <button key={i} onClick={() => { setInput(a); setTimeout(send, 0) }}
            className="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors border border-red-100">
            {a}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask anything about campus…"
            className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 text-sm outline-none border border-gray-200 focus:border-red-300 transition-colors" />
          <button onClick={send} disabled={!input.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
            style={{ background: '#8B1A3A' }}>
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── LANDING PAGE ──────────────────────────────────────────────────────────────
function LandingPage({ onSelect }: { onSelect: (p: 'onboarding' | 'coordinator-dashboard') => void }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      gsap.fromTo(titleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.15, ease: 'power3.out' })
      gsap.fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.35, ease: 'power3.out' })
      gsap.fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: 'power3.out', stagger: 0.1 })
      gsap.fromTo('.feature-card', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.features-section', start: 'top 80%' }
      })
      gsap.fromTo('.stat-num', { textContent: 0 }, {
        textContent: (i: number) => [1850, 42, 5, 98][i],
        duration: 2, ease: 'power2.out', snap: { textContent: 1 },
        scrollTrigger: { trigger: '.stats-section', start: 'top 80%' }
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  const features = [
    { icon: Brain, label: 'AI-Powered', desc: 'Personalized recommendations based on your profile, skills, and interests', color: '#8B1A3A' },
    { icon: Bell, label: 'Smart Notices', desc: 'Verified college notices categorized and prioritized just for you', color: '#1A5C3A' },
    { icon: Trophy, label: 'Hackathon Hub', desc: 'Discover opportunities with match scores and eligibility filters', color: '#C9A227' },
    { icon: Users, label: 'Team Builder', desc: 'Find teammates by skills, interests, and hackathon preferences', color: '#7C3AED' },
    { icon: Hash, label: 'Communities', desc: 'Department groups with posts, polls, and real-time chat', color: '#2563EB' },
    { icon: Building2, label: 'Society Hub', desc: 'Follow societies, track events, and get personalized updates', color: '#059669' },
  ]

  const stats = [
    { num: '1850', label: 'Students', suffix: '+' },
    { num: '42', label: 'Opportunities', suffix: '+' },
    { num: '5', label: 'Societies', suffix: '' },
    { num: '98', label: 'Match Accuracy', suffix: '%' },
  ]

  return (
    <div ref={heroRef} className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <InfoMateLogo size="md" />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-red-800 transition-colors">Features</a>
            <a href="#societies" className="hover:text-red-800 transition-colors">Societies</a>
            <a href="#about" className="hover:text-red-800 transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onSelect('coordinator-dashboard')}
              className="text-sm font-medium text-gray-600 hover:text-red-800 transition-colors px-4 py-2 rounded-xl hover:bg-red-50">
              Coordinator Login
            </button>
            <button onClick={() => onSelect('onboarding')}
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all hover:opacity-90 hover:shadow-lg magnetic"
              style={{ background: 'linear-gradient(135deg, #8B1A3A, #A02244)' }}>
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: '#8B1A3A' }} />
        <div className="absolute top-40 right-1/4 w-72 h-72 rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: '#1A5C3A' }} />
        <div className="absolute bottom-0 left-1/2 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: '#C9A227' }} />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="hero-badge inline-flex items-center gap-2 bg-red-50 text-red-800 border border-red-100 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles size={14} className="text-yellow-500" />
            AI-Powered Campus Operating System · IGDTUW
          </div>

          {/* Big Logo in hero */}
          <div className="flex justify-center mb-6">
            <InfoMateLogo size="lg" showTagline />
          </div>

          <h1 ref={titleRef} className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
            Your campus,
            <span className="block" style={{ color: '#8B1A3A' }}>intelligently</span>
            organized.
          </h1>
          <p className="hero-sub text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Notices, societies, hackathons, teammates — all personalized to you. Powered by AI that understands your branch, year, skills, and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => onSelect('onboarding')}
              className="hero-cta magnetic flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #8B1A3A, #A02244)' }}>
              <GraduationCap size={20} />
              I'm a Student
              <ArrowRight size={18} />
            </button>
            <button onClick={() => onSelect('coordinator-dashboard')}
              className="hero-cta magnetic flex items-center gap-2 font-semibold px-8 py-4 rounded-2xl text-base transition-all hover:shadow-lg hover:-translate-y-0.5 border-2"
              style={{ borderColor: '#1A5C3A', color: '#1A5C3A', background: 'transparent' }}>
              <Shield size={20} />
              Society Coordinator
            </button>
          </div>
        </div>

        {/* Floating notice cards preview */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-4 text-xs text-gray-400 font-mono">infomate.igdtuw.ac.in</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {NOTICES.slice(0, 3).map(n => (
                <div key={n.id} className="rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full mb-3 badge-${n.priority}`}>
                    {n.priority === 'urgent' ? '🔴' : n.priority === 'important' ? '🟠' : '🔵'} {n.priority}
                  </div>
                  <p className="text-sm font-medium text-gray-800 leading-snug">{n.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.source} · {n.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section py-16 px-6" style={{ background: 'linear-gradient(135deg, #8B1A3A, #6B1229)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-bold mb-1">
                <span className="stat-num">{s.num}</span>{s.suffix}
              </div>
              <div className="text-white/60 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 border border-green-100 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap size={14} />
              Everything you need
            </div>
            <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
              One platform. All of campus.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="feature-card group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: f.color + '15' }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Societies preview */}
      <section id="societies" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
              5 Societies. One home.
            </h2>
            <p className="text-gray-500">Follow, stay updated, and never miss a recruitment or event again.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {SOCIETIES.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-5 text-center border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{s.name}</div>
                <div className="text-xs text-gray-400 mb-3">{s.members} members</div>
                <button className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors hover:text-white"
                  style={{ borderColor: s.color, color: s.color }}
                  onMouseOver={e => { (e.target as HTMLElement).style.background = s.color; (e.target as HTMLElement).style.color = '#fff' }}
                  onMouseOut={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = s.color }}>
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <InfoMateLogo size="md" showTagline />
          <p className="text-sm text-gray-400">Made with ♥ for IGDTUW students · 2026</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-red-800 transition-colors">Privacy</a>
            <a href="#" className="hover:text-red-800 transition-colors">Terms</a>
            <a href="#" className="hover:text-red-800 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── ONBOARDING ────────────────────────────────────────────────────────────────
function OnboardingFlow({ onComplete }: { onComplete: (profile: StudentProfile) => void }) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<StudentProfile>({
    name: '', email: '', branch: 'IT', year: '3rd', course: 'B.Tech',
    location: 'Delhi', skills: [], interests: [], societies: [], infoPrefs: []
  })

  const steps = ['Personal Info', 'Skills & Interests', 'Societies & Preferences', 'Review']
  const branches = ['IT', 'CSE', 'AI/ML', 'ECE/AI', 'Mathematics & Computing', 'Other']
  const years = ['1st', '2nd', '3rd', '4th']
  const allSkills = ['Python', 'React', 'Node.js', 'ML/AI', 'Java', 'C++', 'Flutter', 'UI/UX Design', 'Data Science', 'DevOps', 'Blockchain', 'AR/VR', 'IoT', 'Cybersecurity']
  const allInterests = ['Hackathons', 'Open Source', 'Research', 'Entrepreneurship', 'Arts', 'Sports', 'Community Service', 'Music', 'Public Speaking', 'Design']
  const infoPrefs = ['Academic Notices', 'Exam Updates', 'Scholarship Alerts', 'Placement Drives', 'Society Events', 'Hackathons', 'Internships', 'Research Opportunities']

  const toggle = (field: 'skills' | 'interests' | 'societies' | 'infoPrefs', val: string) => {
    setProfile(p => ({
      ...p, [field]: p[field].includes(val) ? p[field].filter(x => x !== val) : [...p[field], val]
    }))
  }

  const ToggleChip = ({ label, active, onClick, color = '#8B1A3A' }: { label: string; active: boolean; onClick: () => void; color?: string }) => (
    <button onClick={onClick}
      className="px-3 py-2 rounded-xl text-sm font-medium border transition-all hover:scale-105"
      style={active ? { background: color, color: '#fff', borderColor: color } : { background: '#fff', borderColor: '#E5E1DB', color: '#6B6560' }}>
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <InfoMateLogo size="sm" />
          <div className="text-sm text-gray-400">Step {step + 1} of {steps.length}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${i <= step ? 'bg-red-800' : 'bg-gray-200'}`} />
                <span className={`text-xs transition-colors ${i === step ? 'text-red-800 font-medium' : 'text-gray-400'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

            {step === 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Fraunces', color: '#8B1A3A' }}>Tell us about yourself</h2>
                <p className="text-gray-500 mb-6 text-sm">InfoMate uses this to personalize everything for you</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name *</label>
                    <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                      placeholder="Priya Sharma"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-800 transition-colors" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">College Email *</label>
                    <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                      placeholder="priya.sharma@igdtuw.ac.in"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-800 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Branch</label>
                      <select value={profile.branch} onChange={e => setProfile(p => ({ ...p, branch: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-800 bg-white">
                        {branches.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Year</label>
                      <select value={profile.year} onChange={e => setProfile(p => ({ ...p, year: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-800 bg-white">
                        {years.map(y => <option key={y}>{y} Year</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Location</label>
                    <input value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                      placeholder="Delhi, Kashmere Gate"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-800 transition-colors" />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Fraunces', color: '#8B1A3A' }}>Your skills & interests</h2>
                <p className="text-gray-500 mb-6 text-sm">We use these to match hackathons, teams, and opportunities</p>
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Technical Skills <span className="text-gray-400 font-normal">(pick all that apply)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.map(s => <ToggleChip key={s} label={s} active={profile.skills.includes(s)} onClick={() => toggle('skills', s)} />)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Interests & Passions</label>
                  <div className="flex flex-wrap gap-2">
                    {allInterests.map(i => <ToggleChip key={i} label={i} active={profile.interests.includes(i)} onClick={() => toggle('interests', i)} color="#1A5C3A" />)}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Fraunces', color: '#8B1A3A' }}>Societies & preferences</h2>
                <p className="text-gray-500 mb-6 text-sm">Follow societies you care about for personalized updates</p>
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Preferred Societies</label>
                  <div className="grid grid-cols-1 gap-3">
                    {SOCIETIES.map(s => (
                      <button key={s.id} onClick={() => toggle('societies', s.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${profile.societies.includes(s.id) ? 'border-opacity-100' : 'border-gray-200'}`}
                        style={profile.societies.includes(s.id) ? { borderColor: s.color, background: s.color + '08' } : {}}>
                        <div className="text-2xl">{s.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{s.name}</div>
                          <div className="text-xs text-gray-400">{s.desc}</div>
                        </div>
                        {profile.societies.includes(s.id) && <CheckCircle size={18} style={{ color: s.color }} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Information Preferences</label>
                  <div className="flex flex-wrap gap-2">
                    {infoPrefs.map(p => <ToggleChip key={p} label={p} active={profile.infoPrefs.includes(p)} onClick={() => toggle('infoPrefs', p)} color="#C9A227" />)}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'linear-gradient(135deg, #8B1A3A, #A02244)' }}>
                  <Sparkles size={36} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Fraunces', color: '#8B1A3A' }}>You're all set, {profile.name || 'there'}!</h2>
                <p className="text-gray-500 mb-8 text-sm">InfoMate is ready to personalize your campus experience</p>
                <div className="text-left bg-gray-50 rounded-2xl p-6 space-y-3 text-sm mb-8">
                  <div className="flex justify-between"><span className="text-gray-500">Branch & Year</span><span className="font-medium">{profile.branch} · {profile.year} Year</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Skills selected</span><span className="font-medium">{profile.skills.length} skills</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Societies followed</span><span className="font-medium">{profile.societies.length} societies</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Info preferences</span><span className="font-medium">{profile.infoPrefs.length} categories</span></div>
                </div>
                <button onClick={() => onComplete(profile)}
                  className="w-full text-white font-semibold py-4 rounded-2xl text-base transition-all hover:opacity-90 hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #8B1A3A, #A02244)' }}>
                  Enter Your Dashboard →
                </button>
              </div>
            )}

            {step < 3 && (
              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    Back
                  </button>
                )}
                <button onClick={() => setStep(s => s + 1)}
                  disabled={step === 0 && !profile.name}
                  className="flex-1 text-white font-semibold py-3 rounded-xl transition-all hover:opacity-90 disabled:opacity-40 text-sm"
                  style={{ background: 'linear-gradient(135deg, #8B1A3A, #A02244)' }}>
                  {step === 2 ? 'Review Profile' : 'Continue →'}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Dummy icon for AI Brain
const Brain = ({ size, style }: { size: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={style}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
    <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
    <path d="M6 18a4 4 0 0 1-1.967-.516"/>
    <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
  </svg>
)

// ─── NOTICE CARD ───────────────────────────────────────────────────────────────
function NoticeCard({ n, bookmarked, onBookmark }: { n: typeof NOTICES[0]; bookmarked: boolean; onBookmark: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const priorityMap: Record<string, string> = { urgent: '🔴 Urgent', important: '🟠 Important', recommended: '🔵 Recommended', general: '⚪ General' }

  return (
    <motion.div layout className={`bg-white border rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer border-${n.priority === 'urgent' ? 'red' : n.priority === 'important' ? 'orange' : 'gray'}-100`}
      onClick={() => setExpanded(e => !e)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full badge-${n.priority}`}>
              {priorityMap[n.priority]}
            </span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{n.category}</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{n.title}</h3>
          <p className="text-xs text-gray-400 mt-1">{n.source} · {n.time}</p>
        </div>
        <button onClick={e => { e.stopPropagation(); onBookmark() }}
          className={`flex-shrink-0 transition-colors ${bookmarked ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-500'}`}>
          <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{n.desc}</p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <a href={n.link} className="text-xs font-medium text-red-800 flex items-center gap-1 hover:underline">
                <ExternalLink size={12} /> View original
              </a>
              <button onClick={e => { e.stopPropagation(); setShowWhy(w => !w) }}
                className="text-xs font-medium text-blue-600 flex items-center gap-1 hover:underline">
                <Eye size={12} /> Why am I seeing this?
              </button>
            </div>
            <AnimatePresence>
              {showWhy && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                  <Lightbulb size={12} className="inline mr-1" /> <strong>Personalized for you:</strong> {n.why}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────
function StudentDashboard({ profile, initialTab, onLogout }: { profile: StudentProfile; initialTab: DashTab; onLogout: () => void }) {
  const [tab, setTab] = useState<DashTab>(initialTab)
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [followedSocieties, setFollowedSocieties] = useState<string[]>(profile.societies)
  const [showAI, setShowAI] = useState(false)
  const [showCmd, setShowCmd] = useState(false)
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: 'success' | 'info' | 'error' }[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [communityTab, setCommunityTab] = useState('it')
  const [filter, setFilter] = useState<string>('all')

  const addToast = useCallback((msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
  }, [])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowCmd(c => !c) }
    }
    window.addEventListener('keydown', fn); return () => window.removeEventListener('keydown', fn)
  }, [])

  const navItems: { id: DashTab; label: string; icon: React.ComponentType<{ size: number }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'societies', label: 'Societies', icon: Users },
    { id: 'hackathons', label: 'Hackathons', icon: Trophy },
    { id: 'teams', label: 'Teams', icon: Handshake },
    { id: 'communities', label: 'Communities', icon: Hash },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  ]

  const handleNavigate = (p: Page, t?: DashTab) => {
    if (p === 'student-dashboard' && t) setTab(t)
    setShowCmd(false)
  }

  const filteredNotices = filter === 'all' ? NOTICES : NOTICES.filter(n => n.priority === filter)

  const communityPosts = [
    { author: 'Riya Mehta', time: '2h ago', text: 'Anyone starting SIH prep? Looking for a team member who knows Flutter 🚀', likes: 14, replies: 6, avatar: 'RM' },
    { author: 'Sneha Kapoor', time: '5h ago', text: 'Mid-sem schedule is out! Check the academic portal. IT batch exams start Oct 14.', likes: 38, replies: 12, avatar: 'SK', pinned: true },
    { author: 'Anjali Singh', time: '1d ago', text: 'AICTE scholarship applications are open till Sept 22! Women in engineering only — highly recommend applying 💪', likes: 67, replies: 24, avatar: 'AS' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-5 border-b border-gray-100">
          <InfoMateLogo size="sm" />
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setTab(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${tab === item.id ? 'nav-active' : 'text-gray-600 hover:bg-gray-50'}`}>
              <item.icon size={18} />
              {item.label}
              {item.id === 'notices' && <span className="ml-auto text-xs bg-red-800 text-white px-1.5 py-0.5 rounded-full">
                {NOTICES.filter(n => n.priority === 'urgent').length}
              </span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={() => setShowAI(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-2 text-white"
            style={{ background: 'linear-gradient(135deg, #8B1A3A, #A02244)' }}>
            <Bot size={16} /> AI Assistant
            <Sparkles size={14} className="ml-auto" />
          </button>
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: '#8B1A3A' }}>
              {profile.name ? profile.name[0] : 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 truncate">{profile.name || 'Student'}</div>
              <div className="text-xs text-gray-400 truncate">{profile.branch} · {profile.year} Year</div>
            </div>
            <button onClick={onLogout} className="text-gray-400 hover:text-red-600 transition-colors"><LogOut size={15} /></button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-3.5 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(s => !s)} className="lg:hidden text-gray-500 hover:text-gray-800">
            <Menu size={20} />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search notices, societies, hackathons… (⌘K)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-red-300"
              onFocus={() => setShowCmd(true)} readOnly />
          </div>
          <button onClick={() => setShowCmd(true)}
            className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-500 px-3 py-2 rounded-xl hover:bg-gray-200 transition-colors">
            <Command size={12} /> K
          </button>
          <button onClick={() => setShowAI(a => !a)}
            className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-xl transition-all hover:opacity-90"
            style={{ background: '#8B1A3A' }}>
            <Bot size={16} /> AI
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }} className="page-enter">

              {/* HOME TAB */}
              {tab === 'home' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces' }}>
                        Good morning, {profile.name || 'there'} 👋
                      </h1>
                      <p className="text-gray-500 text-sm mt-1">Here's what needs your attention today</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">IGDTUW · {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                    </div>
                  </div>

                  {/* Priority strip */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Urgent', count: NOTICES.filter(n => n.priority === 'urgent').length, color: '#DC2626', bg: '#FEF2F2', icon: '🔴' },
                      { label: 'Important', count: NOTICES.filter(n => n.priority === 'important').length, color: '#EA580C', bg: '#FFF7ED', icon: '🟠' },
                      { label: 'Recommended', count: NOTICES.filter(n => n.priority === 'recommended').length, color: '#2563EB', bg: '#EFF6FF', icon: '🔵' },
                      { label: 'General', count: NOTICES.filter(n => n.priority === 'general').length, color: '#6B7280', bg: '#F9FAFB', icon: '⚪' },
                    ].map(p => (
                      <button key={p.label} onClick={() => setTab('notices')}
                        className="rounded-2xl p-4 text-left hover:shadow-md transition-all hover:-translate-y-0.5 border border-opacity-20"
                        style={{ background: p.bg, borderColor: p.color + '40' }}>
                        <div className="text-xl mb-2">{p.icon}</div>
                        <div className="text-2xl font-bold" style={{ color: p.color }}>{p.count}</div>
                        <div className="text-xs font-medium mt-0.5" style={{ color: p.color }}>{p.label}</div>
                      </button>
                    ))}
                  </div>

                  {/* Urgent notices */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-semibold text-gray-900">🔴 Needs immediate attention</h2>
                      <button onClick={() => setTab('notices')} className="text-xs text-red-800 hover:underline">View all</button>
                    </div>
                    <div className="space-y-3">
                      {NOTICES.filter(n => n.priority === 'urgent').map(n => (
                        <NoticeCard key={n.id} n={n} bookmarked={bookmarks.includes(n.id)}
                          onBookmark={() => {
                            setBookmarks(b => b.includes(n.id) ? b.filter(x => x !== n.id) : [...b, n.id])
                            addToast(bookmarks.includes(n.id) ? 'Removed from bookmarks' : 'Saved to bookmarks', 'info')
                          }} />
                      ))}
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Find Teammates', icon: Handshake, tab: 'teams' as DashTab, color: '#8B1A3A' },
                      { label: 'Browse Hackathons', icon: Trophy, tab: 'hackathons' as DashTab, color: '#1A5C3A' },
                      { label: 'Society Updates', icon: Users, tab: 'societies' as DashTab, color: '#C9A227' },
                      { label: 'My Communities', icon: Hash, tab: 'communities' as DashTab, color: '#7C3AED' },
                    ].map(a => (
                      <button key={a.label} onClick={() => setTab(a.tab)}
                        className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:shadow-md transition-all hover:-translate-y-0.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                          style={{ background: a.color + '15' }}>
                          <a.icon size={16} style={{ color: a.color }} />
                        </div>
                        <div className="text-sm font-medium text-gray-800">{a.label}</div>
                      </button>
                    ))}
                  </div>

                  {/* Top hackathon match */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-gray-900">⚡ Best hackathon match for you</h2>
                      <button onClick={() => setTab('hackathons')} className="text-xs text-red-800 hover:underline">See all</button>
                    </div>
                    {(() => {
                      const h = HACKATHONS[0]
                      return (
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-50">
                            <Trophy size={22} className="text-red-800" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-semibold text-gray-900">{h.name}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{h.org} · {h.type} · {h.location}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-green-600">{h.matchScore}%</div>
                                <div className="text-xs text-gray-400">match</div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {h.tags.map(t => <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>)}
                            </div>
                            <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                              <Lightbulb size={12} /> {h.why}
                            </div>
                            <div className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                              <Clock size={11} /> Deadline: {h.deadline}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}

              {/* NOTICES TAB */}
              {tab === 'notices' && (
                <div className="max-w-3xl mx-auto space-y-5">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces' }}>College Notices</h1>
                    <div className="text-xs text-gray-400 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-1">
                      <CheckCircle size={12} /> Verified sources only
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {['all', 'urgent', 'important', 'recommended', 'general'].map(f => (
                      <button key={f} onClick={() => setFilter(f)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all capitalize ${filter === f ? 'bg-red-800 text-white border-red-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                        {f === 'all' ? 'All Notices' : f}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {filteredNotices.map(n => (
                      <NoticeCard key={n.id} n={n} bookmarked={bookmarks.includes(n.id)}
                        onBookmark={() => {
                          setBookmarks(b => b.includes(n.id) ? b.filter(x => x !== n.id) : [...b, n.id])
                          addToast(bookmarks.includes(n.id) ? 'Removed from bookmarks' : 'Saved!', 'info')
                        }} />
                    ))}
                  </div>
                </div>
              )}

              {/* SOCIETIES TAB */}
              {tab === 'societies' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces' }}>IGDTUW Societies</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {SOCIETIES.map(s => {
                      const followed = followedSocieties.includes(s.id)
                      return (
                        <motion.div key={s.id} layout className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                          <div className="h-24 flex items-center justify-center text-5xl" style={{ background: s.color + '15' }}>
                            {s.icon}
                          </div>
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-gray-900">{s.name}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                              </div>
                              <button onClick={() => {
                                setFollowedSocieties(fs => fs.includes(s.id) ? fs.filter(x => x !== s.id) : [...fs, s.id])
                                addToast(followed ? `Unfollowed ${s.name}` : `Following ${s.name}! 🎉`, followed ? 'info' : 'success')
                              }}
                                className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                                style={followed ? { background: s.color, color: '#fff', borderColor: s.color } : { borderColor: s.color, color: s.color }}>
                                {followed ? 'Following ✓' : 'Follow'}
                              </button>
                            </div>
                            <div className="flex gap-4 text-xs text-gray-400 mb-3">
                              <span>{s.members} members</span>
                              <span>{s.followers} followers</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {s.tags.map(t => (
                                <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: s.color + '15', color: s.color }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {['About', 'Events', 'Recruit'].map(a => (
                                <button key={a} className="text-xs py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                                  {a}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* HACKATHONS TAB */}
              {tab === 'hackathons' && (
                <div className="max-w-4xl mx-auto space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces' }}>Hackathons & Opportunities</h1>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                        <Filter size={13} /> Filters
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {HACKATHONS.map(h => (
                      <motion.div key={h.id} layout className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
                            <Trophy size={22} className="text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div>
                                <div className="font-bold text-gray-900">{h.name}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{h.org} · {h.type}
                                  {h.location !== 'Remote' && <span className="ml-1"><MapPin size={10} className="inline" /> {h.location}</span>}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-xl font-bold" style={{ color: h.matchScore > 90 ? '#1A5C3A' : h.matchScore > 80 ? '#C9A227' : '#6B7280' }}>
                                  {h.matchScore}%
                                </div>
                                <div className="text-xs text-gray-400">match score</div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {h.tags.map(t => <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>)}
                              <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{h.category}</span>
                            </div>
                            <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                              <Lightbulb size={12} /> {h.why}
                            </div>
                            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                              <div className="flex gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Clock size={11} /> Deadline: <strong className="text-red-600">{h.deadline}</strong></span>
                                <span className="flex items-center gap-1"><Award size={11} /> Prize: <strong>{h.prize}</strong></span>
                                <span>{h.eligibility}</span>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => { setTab('teams'); addToast('Find a team for this hackathon!', 'info') }}
                                  className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                                  Find Team
                                </button>
                                <button className="text-xs text-white px-4 py-1.5 rounded-xl font-medium transition-all hover:opacity-90"
                                  style={{ background: '#8B1A3A' }}>
                                  Register →
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* TEAMS TAB */}
              {tab === 'teams' && (
                <div className="max-w-4xl mx-auto space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces' }}>Team Formation</h1>
                    <button className="flex items-center gap-2 text-sm text-white px-4 py-2 rounded-xl font-medium transition-all hover:opacity-90"
                      style={{ background: '#8B1A3A' }}>
                      <Plus size={16} /> Create Team Post
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TEAMS.map(t => (
                      <div key={t.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: t.theme }}>
                            {t.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{t.leader}</div>
                            <div className="text-xs text-gray-400">{t.branch} · {t.year} Year · Team {t.size}</div>
                          </div>
                          <div className="ml-auto text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-1 rounded-full flex items-center gap-1">
                            <Trophy size={11} /> {t.hackathon.split(' ').slice(0, 2).join(' ')}
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="text-xs font-medium text-gray-600 mb-2">Looking for:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {t.looking.map(r => (
                              <span key={r} className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">{r}</span>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="text-xs font-medium text-gray-600 mb-2">Team skills:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {t.skills.map(s => (
                              <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => addToast(`Join request sent to ${t.leader}! 🚀`, 'success')}
                          className="w-full text-sm font-medium py-2.5 rounded-xl border-2 transition-all hover:text-white"
                          style={{ borderColor: t.theme, color: t.theme }}
                          onMouseOver={e => { (e.target as HTMLElement).style.background = t.theme; (e.target as HTMLElement).style.color = '#fff' }}
                          onMouseOut={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = t.theme }}>
                          Request to Join
                        </button>
                      </div>
                    ))}
                    {/* Create your own post */}
                    <div className="bg-gradient-to-br from-red-50 to-white border-2 border-dashed border-red-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 hover:border-red-400 transition-colors cursor-pointer"
                      onClick={() => addToast('Team builder coming soon!', 'info')}>
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <Plus size={20} className="text-red-700" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">Post a "Looking for Team" card</div>
                        <div className="text-xs text-gray-400 mt-1">Let others find you by skills & interests</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* COMMUNITIES TAB */}
              {tab === 'communities' && (
                <div className="max-w-4xl mx-auto space-y-5">
                  <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces' }}>Communities</h1>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {COMMUNITIES.map(c => (
                      <button key={c.id} onClick={() => setCommunityTab(c.id)}
                        className={`rounded-2xl p-4 text-center transition-all border ${communityTab === c.id ? 'border-opacity-100 shadow-md' : 'border-gray-100 bg-white hover:shadow-sm'}`}
                        style={communityTab === c.id ? { borderColor: c.color, background: c.color + '10' } : {}}>
                        <div className="text-2xl mb-1">{c.icon}</div>
                        <div className="text-xs font-medium text-gray-800">{c.name.split(' ')[0]}</div>
                        <div className="text-xs text-gray-400">{c.members}m</div>
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const comm = COMMUNITIES.find(c => c.id === communityTab)!
                    return (
                      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-3 p-5 border-b border-gray-100"
                          style={{ background: comm.color + '08' }}>
                          <span className="text-2xl">{comm.icon}</span>
                          <div>
                            <div className="font-bold text-gray-900">{comm.name}</div>
                            <div className="text-xs text-gray-400">{comm.members} members · {comm.posts} posts</div>
                          </div>
                          <button className="ml-auto text-xs font-medium px-3 py-1.5 rounded-full text-white"
                            style={{ background: comm.color }}>
                            + Join
                          </button>
                        </div>
                        <div className="p-5">
                          <div className="flex gap-2 mb-4">
                            <input placeholder={`Share something in ${comm.name}…`}
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-300" />
                            <button className="text-white px-4 py-2 rounded-xl text-sm font-medium"
                              style={{ background: comm.color }}>Post</button>
                          </div>
                          <div className="space-y-4">
                            {communityPosts.map((post, i) => (
                              <div key={i} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                                {post.pinned && (
                                  <div className="text-xs text-yellow-600 flex items-center gap-1 mb-2">
                                    <Star size={11} /> Pinned by moderator
                                  </div>
                                )}
                                <div className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                    style={{ background: comm.color }}>
                                    {post.avatar}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-sm font-medium text-gray-900">{post.author}</span>
                                      <span className="text-xs text-gray-400">{post.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">{post.text}</p>
                                    <div className="flex gap-4 mt-2">
                                      <button className="text-xs text-gray-400 flex items-center gap-1 hover:text-red-600 transition-colors">
                                        <Heart size={12} /> {post.likes}
                                      </button>
                                      <button className="text-xs text-gray-400 flex items-center gap-1 hover:text-blue-600 transition-colors">
                                        <MessageSquare size={12} /> {post.replies} replies
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* BOOKMARKS TAB */}
              {tab === 'bookmarks' && (
                <div className="max-w-3xl mx-auto space-y-5">
                  <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces' }}>Bookmarks</h1>
                  {bookmarks.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                      <Bookmark size={36} className="text-gray-200 mx-auto mb-4" />
                      <h3 className="font-medium text-gray-600 mb-2">No bookmarks yet</h3>
                      <p className="text-sm text-gray-400">Save notices, hackathons, and opportunities to access them here</p>
                      <button onClick={() => setTab('notices')}
                        className="mt-4 text-sm font-medium text-red-800 hover:underline">Browse Notices</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {NOTICES.filter(n => bookmarks.includes(n.id)).map(n => (
                        <NoticeCard key={n.id} n={n} bookmarked={true}
                          onBookmark={() => {
                            setBookmarks(b => b.filter(x => x !== n.id))
                            addToast('Removed from bookmarks', 'info')
                          }} />
                      ))}
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* AI Chat */}
      <AnimatePresence>
        {showAI && <AIChatPanel onClose={() => setShowAI(false)} />}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {showCmd && <CommandPalette onClose={() => setShowCmd(false)} onNavigate={handleNavigate} />}
      </AnimatePresence>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map(t => (
            <Toast key={t.id} message={t.msg} type={t.type} onClose={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />
          ))}
        </AnimatePresence>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}

// ─── COORDINATOR DASHBOARD ────────────────────────────────────────────────────
function CoordinatorDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<CoordTab>('overview')
  const [society, setSociety] = useState(SOCIETIES[3]) // Synergy default
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: 'success' | 'info' | 'error' }[]>([])

  const addToast = useCallback((msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
  }, [])

  const navItems: { id: CoordTab; label: string; icon: React.ComponentType<{ size: number }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'posts', label: 'Post Update', icon: Edit3 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'recruitment', label: 'Recruitment', icon: UserCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const stats = [
    { label: 'Total Followers', value: '780', change: '+24 this week', icon: Users, color: '#8B1A3A' },
    { label: 'Active Members', value: '310', change: '+8 this month', icon: Star, color: '#1A5C3A' },
    { label: 'Upcoming Events', value: '3', change: 'Next: Oct 18', icon: Calendar, color: '#C9A227' },
    { label: 'Engagement Rate', value: '68%', change: '+5% vs last month', icon: TrendingUp, color: '#7C3AED' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <InfoMateLogo size="sm" />
          <div className="mt-2 text-xs text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-lg flex items-center gap-1">
            <Shield size={11} /> Coordinator Portal
          </div>
        </div>

        {/* Society selector */}
        <div className="p-3 border-b border-gray-100">
          <label className="text-xs text-gray-400 mb-1.5 block uppercase tracking-wider">Managing Society</label>
          <select value={society.id} onChange={e => setSociety(SOCIETIES.find(s => s.id === e.target.value)!)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
            {SOCIETIES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
          </select>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${tab === item.id ? 'nav-active' : 'text-gray-600 hover:bg-gray-50'}`}>
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: society.color }}>
              CO
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 truncate">Coordinator</div>
              <div className="text-xs text-gray-400 truncate">{society.name}</div>
            </div>
            <button onClick={onLogout} className="text-gray-400 hover:text-red-600 transition-colors"><LogOut size={15} /></button>
          </div>
        </div>
      </aside>

      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{society.icon}</span>
            <div>
              <h1 className="font-bold text-gray-900">{society.name}</h1>
              <p className="text-xs text-gray-400">Coordinator Dashboard</p>
            </div>
          </div>
          <button onClick={() => addToast('Changes saved!', 'success')}
            className="flex items-center gap-2 text-sm text-white px-4 py-2 rounded-xl font-medium transition-all hover:opacity-90"
            style={{ background: '#1A5C3A' }}>
            <CheckCircle size={15} /> Save Changes
          </button>
        </header>

        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>

              {tab === 'overview' && (
                <div className="max-w-5xl mx-auto space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces' }}>Society Overview</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                      <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.color + '15' }}>
                            <s.icon size={18} style={{ color: s.color }} />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                        <div className="text-xs font-medium mt-2" style={{ color: s.color }}>{s.change}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white border border-gray-100 rounded-2xl p-5">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity size={16} /> Recent Activity
                      </h3>
                      <div className="space-y-3">
                        {[
                          { text: 'New member joined: Riya Mehta (CSE-3)', time: '2h ago', type: 'join' },
                          { text: 'Event "TechTalk #12" created for Oct 18', time: '5h ago', type: 'event' },
                          { text: 'Recruitment post got 47 applications', time: '1d ago', type: 'recruit' },
                          { text: 'Update posted: Workshop on React + AI', time: '2d ago', type: 'post' },
                        ].map((a, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: society.color }} />
                            <div>
                              <div className="text-gray-700">{a.text}</div>
                              <div className="text-xs text-gray-400">{a.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar size={16} /> Upcoming Events
                      </h3>
                      <div className="space-y-3">
                        {[
                          { title: 'TechTalk #12: AI in Production', date: 'Oct 18, 2026', reg: 34 },
                          { title: 'Hackathon Prep Workshop', date: 'Oct 25, 2026', reg: 58 },
                          { title: 'Annual Society Meet 2026', date: 'Nov 3, 2026', reg: 12 },
                        ].map((e, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm p-3 rounded-xl bg-gray-50">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ background: society.color }}>
                              {e.date.split(' ')[1]}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{e.title}</div>
                              <div className="text-xs text-gray-400">{e.date} · {e.reg} registered</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'posts' && (
                <div className="max-w-2xl mx-auto space-y-5">
                  <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces' }}>Post an Update</h2>
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Update Title</label>
                      <input placeholder="Workshop on React + AI — This Saturday!" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-300" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Content</label>
                      <textarea rows={5} placeholder="Write the full update here…" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-300 resize-none" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Target Audience</label>
                      <div className="flex flex-wrap gap-2">
                        {['All Students', '1st Year', '2nd Year', '3rd Year', '4th Year', 'IT Branch', 'CSE Branch'].map(a => (
                          <button key={a} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-red-800 hover:text-red-800 transition-colors">
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Attach Poster/File</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors cursor-pointer">
                        <Upload size={20} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Click to upload or drag & drop</p>
                        <p className="text-xs text-gray-300 mt-1">PNG, JPG, PDF up to 10MB</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                        Save Draft
                      </button>
                      <button onClick={() => addToast('Update posted to all followers! 🎉', 'success')}
                        className="flex-1 text-white py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: '#8B1A3A' }}>
                        Publish Update
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'events' && (
                <div className="max-w-2xl mx-auto space-y-5">
                  <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces' }}>Create Event</h2>
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Event Name</label>
                        <input placeholder="TechTalk #13: Building AI Products" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-300" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Date</label>
                        <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-300" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Time</label>
                        <input type="time" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-300" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Location / Link</label>
                        <input placeholder="Seminar Hall A, Block 1 / Zoom link" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-300" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
                        <textarea rows={3} placeholder="Event details, agenda, speakers…" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-300 resize-none" />
                      </div>
                    </div>
                    <button onClick={() => addToast('Event created and published! 📅', 'success')}
                      className="w-full text-white py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: '#1A5C3A' }}>
                      Create Event
                    </button>
                  </div>
                </div>
              )}

              {tab === 'recruitment' && (
                <div className="max-w-2xl mx-auto space-y-5">
                  <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces' }}>Open Recruitment</h2>
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Role / Position</label>
                      <input placeholder="e.g., Technical Team Member, Event Head" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-300" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Required Skills</label>
                      <input placeholder="e.g., React, Graphic Design, Leadership" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-300" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Seats Available</label>
                        <input type="number" placeholder="5" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-300" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Application Deadline</label>
                        <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-300" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description & Process</label>
                      <textarea rows={4} placeholder="Describe the role, responsibilities, and selection process…" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-300 resize-none" />
                    </div>
                    <button onClick={() => addToast('Recruitment post published! 🎯', 'success')}
                      className="w-full text-white py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: '#8B1A3A' }}>
                      Publish Recruitment Post
                    </button>
                  </div>

                  {/* Applications list */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Applications (47)</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Priya Sharma', branch: 'CSE-3', role: 'Technical Team', score: '92%', status: 'Under Review' },
                        { name: 'Anika Gupta', branch: 'IT-3', role: 'Technical Team', score: '88%', status: 'Shortlisted' },
                        { name: 'Sneha Kapoor', branch: 'AI/ML-2', role: 'Events Team', score: '85%', status: 'Shortlisted' },
                      ].map((a, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: '#8B1A3A' }}>
                            {a.name[0]}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">{a.name}</div>
                            <div className="text-xs text-gray-400">{a.branch} · {a.role}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">{a.score}</div>
                            <div className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'Shortlisted' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                              {a.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'analytics' && (
                <div className="max-w-4xl mx-auto space-y-5">
                  <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces' }}>Analytics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Post Reach', value: '2,840', sub: 'This month', change: '+18%' },
                      { label: 'Event Registrations', value: '104', sub: 'Across 3 events', change: '+31%' },
                      { label: 'New Followers', value: '24', sub: 'This week', change: '+12%' },
                    ].map((m, i) => (
                      <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5">
                        <div className="text-2xl font-bold text-gray-900">{m.value}</div>
                        <div className="text-sm text-gray-600 mt-1">{m.label}</div>
                        <div className="text-xs text-gray-400">{m.sub}</div>
                        <div className="text-xs font-medium text-green-600 mt-2">↑ {m.change} vs last period</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Top Posts by Engagement</h3>
                    <div className="space-y-3">
                      {[
                        { title: 'Recruitment Open for Technical Team 2026', reach: '1,240', likes: 89, date: 'Sept 12' },
                        { title: 'TechTalk #12 Recap + Slides', reach: '980', likes: 67, date: 'Sept 8' },
                        { title: 'Announcing Synergy Hackathon League', reach: '620', likes: 45, date: 'Sept 1' },
                      ].map((p, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                          <div className="text-sm font-medium text-gray-800 flex-1">{p.title}</div>
                          <div className="text-xs text-gray-400 text-right">
                            <div>{p.reach} reach</div>
                            <div>{p.likes} likes · {p.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map(t => (
            <Toast key={t.id} message={t.msg} type={t.type} onClose={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [dashTab, setDashTab] = useState<DashTab>('home')

  const navigate = (p: Page, t?: DashTab) => {
    setPage(p)
    if (t) setDashTab(t)
  }

  return (
    <>
      <CustomCursor />
      <AnimatePresence mode="wait">
        {page === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage onSelect={p => navigate(p)} />
          </motion.div>
        )}
        {page === 'onboarding' && (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OnboardingFlow onComplete={prof => { setStudentProfile(prof); navigate('student-dashboard', 'home') }} />
          </motion.div>
        )}
        {page === 'student-dashboard' && studentProfile && (
          <motion.div key="student-dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StudentDashboard profile={studentProfile} initialTab={dashTab} onLogout={() => navigate('landing')} />
          </motion.div>
        )}
        {page === 'coordinator-dashboard' && (
          <motion.div key="coord-dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CoordinatorDashboard onLogout={() => navigate('landing')} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
