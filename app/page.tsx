import Navbar from '@/components/Navbar'
import HomeSection from '@/components/sections/HomeSection'
import AboutSection from '@/components/sections/AboutSection'
import BlogSection from '@/components/sections/BlogSection'
import ContactSection from '@/components/sections/ContactSection'
import { readContent } from '@/lib/admin/content'
import type { HomeContent, AboutContent, ContactContent, ThoughtsContent, MusicContent, GalleryContent } from '@/lib/types/content'

export default function Page() {
  const home = readContent<HomeContent>('home.json')
  const about = readContent<AboutContent>('about.json')
  const contact = readContent<ContactContent>('contact.json')
  const thoughts = readContent<ThoughtsContent>('thoughts.json')
  const music = readContent<MusicContent>('music.json', { tracks: [] })
  const gallery = readContent<GalleryContent>('gallery.json', { photos: [] })
  const activeEntry = about.timeline.find(e => e.state === 'active') ?? null

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-8">
        <section id="home" className="pt-24 pb-4">
          <HomeSection data={home} music={music} gallery={gallery} activeEntry={activeEntry} />
        </section>
        <section id="about" className="py-4">
          <h2 className="text-3xl font-semibold text-[#0A0A0A] mb-4">
            {about.sectionHeading}
          </h2>
          <AboutSection data={about} />
        </section>
        <section id="blog" className="py-4">
          <h2 className="text-3xl font-semibold text-[#0A0A0A] mb-4">
            {thoughts.sectionHeading}
          </h2>
          <BlogSection />
        </section>
        <section id="contact" className="py-4 pb-24">
          <h2 className="text-3xl font-semibold text-[#0A0A0A] mb-4">
            {contact.sectionHeading}
          </h2>
          <ContactSection data={contact} />
        </section>
      </div>
    </main>
  )
}
