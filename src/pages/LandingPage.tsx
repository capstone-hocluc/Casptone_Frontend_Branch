import Navbar from '../components/common/Navbar'
import Hero from '../components/landing/Hero'
import StatsBar from '../components/landing/StatsBar'
import ExamsSection from '../components/landing/ExamsSection'
import LearningCenter from '../components/landing/LearningCenter'
import Subjects from '../components/landing/Subjects'
import Streak from '../components/landing/Streak'
import Features from '../components/landing/Features'
import Journey from '../components/landing/Journey'
import Pricing from '../components/landing/Pricing'
import Mentors from '../components/landing/Mentors'
import Partners from '../components/landing/Partners'
import Testimonials from '../components/landing/Testimonials'
import FAQ from '../components/landing/FAQ'
import CTA from '../components/landing/CTA'
import Footer from '../components/common/Footer'
import Chatbot from '../components/landing/Chatbot'

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
