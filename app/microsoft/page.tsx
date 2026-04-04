import Link from 'next/link'

export const metadata = {
  title: 'Microsoft — Harry Mugridge',
  description: 'Product Manager Intern · MSAI · Summer 2026',
}

export default function MicrosoftPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#8A8A8A] hover:text-[#0A0A0A] transition-colors duration-150 mb-12"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" />
          </svg>
          Back
        </Link>

        {/* Header */}
        <div className="mb-12">
          {/* Microsoft logo */}
          <div className="grid grid-cols-2 gap-[3px] w-7 h-7 mb-6">
            <div className="rounded-[2px]" style={{ backgroundColor: '#F25022' }} />
            <div className="rounded-[2px]" style={{ backgroundColor: '#7FBA00' }} />
            <div className="rounded-[2px]" style={{ backgroundColor: '#00A4EF' }} />
            <div className="rounded-[2px]" style={{ backgroundColor: '#FFB900' }} />
          </div>

          <h1 className="text-4xl font-semibold text-[#0A0A0A] tracking-tight mb-2">
            Microsoft
          </h1>
          <p className="text-lg text-[#6B6B6B] font-light">
            Product Manager Intern · MSAI · Summer 2026
          </p>
        </div>

        <hr className="border-t border-[#E4E4E8] mb-12" />

        {/* Placeholder card */}
        <div className="bg-[#F7F7F9] rounded-3xl p-12 flex flex-col items-center justify-center text-center min-h-[320px]">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#CBCBD0] mb-3">
            Case Studies
          </p>
          <p className="text-2xl font-semibold text-[#DEDEE3]">Coming soon</p>
          <p className="text-sm text-[#CBCBD0] mt-2 max-w-xs">
            Work in progress — check back later.
          </p>
        </div>

      </div>
    </main>
  )
}
