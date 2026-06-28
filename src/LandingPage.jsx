import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import ExamsSection from './components/ExamsSection'
import LearningCenter from './components/LearningCenter'
import Subjects from './components/Subjects'
import Streak from './components/Streak'
import Features from './components/Features'
import Journey from './components/Journey'
import Pricing from './components/Pricing'
import Mentors from './components/Mentors'
import Partners from './components/Partners'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'

function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <Hero />
      <StatsBar />
      <ExamsSection />
      <LearningCenter />
      <Subjects />
      <Streak />
      <Features />
      <Journey />
      <Pricing />
      <Mentors />
      <Partners />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
      <Chatbot />
    </div>
  )
}

export default LandingPage
