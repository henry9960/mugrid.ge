'use client'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={onCancel}
      />
      <div
        className="relative rounded-3xl p-6 w-full max-w-sm"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        <h3 className="text-base font-semibold mb-1.5" style={{ color: '#0A0A0A' }}>
          {title}
        </h3>
        <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>
          {message}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            style={{ backgroundColor: '#F7F7F9', color: '#0A0A0A' }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = '#EDEDED')
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = '#F7F7F9')
            }
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = '#B91C1C')
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = '#DC2626')
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
