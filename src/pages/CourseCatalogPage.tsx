import Navbar from '../components/common/Navbar'
import CourseCatalog from '../components/landing/CourseCatalog'
import Footer from '../components/common/Footer'
import Chatbot from '../components/landing/Chatbot'
import type { Course } from '../services/courseService'

interface CourseCatalogPageProps {
  onOpenCourse: (course: Course) => void
}

function CourseCatalogPage({ onOpenCourse }: CourseCatalogPageProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <CourseCatalog onOpenCourse={onOpenCourse} />
      <Footer />
      <Chatbot />
    </div>
  )
}

export default CourseCatalogPage
