import AdminSidebar from '@/components/admin/AdminSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
