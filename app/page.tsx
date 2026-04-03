import Navbar from '@/components/Navbar'
import HomeSection from '@/components/sections/HomeSection'
import AboutSection from '@/components/sections/AboutSection'
import BlogSection from '@/components/sections/BlogSection'
import ContactSection from '@/components/sections/ContactSection'

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-8">
        <section id="home" className="pt-24 pb-4">
          <HomeSection />
        </section>
        <section id="about" className="py-4">
          <AboutSection />
        </section>
        <section id="blog" className="py-4">
          <BlogSection />
        </section>
        <section id="contact" className="py-4 pb-24">
          <ContactSection />
        </section>
      </div>
    </main>
  )
}
