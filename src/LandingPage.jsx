import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import ExamsSection from './components/ExamsSection'
import Features from './components/Features'
import Journey from './components/Journey'
import Mentors from './components/Mentors'
import Partners from './components/Partners'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans font-normal">
      <Navbar />
      <Hero />
      <StatsBar />
      <ExamsSection />
      <Features />
      <Journey />
      <Mentors />
      <Partners />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  )
}

export default LandingPage
