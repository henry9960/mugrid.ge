'use client'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface SaveBarProps {
  isDirty: boolean
  status: SaveStatus
  onSave: () => void
}

export default function SaveBar({ isDirty, status, onSave }: SaveBarProps) {
  return (
    <div className="flex items-center gap-3">
      {isDirty && status === 'idle' && (
        <span
          className="text-xs font-medium rounded-full px-2.5 py-1"
          style={{ color: '#92400E', backgroundColor: '#FEF3C7' }}
        >
          Unsaved changes
        </span>
      )}
      {status === 'saved' && (
        <span
          className="text-xs font-medium rounded-full px-2.5 py-1"
          style={{ color: '#3A7D44', backgroundColor: '#EDFAF1' }}
        >
          Saved
        </span>
      )}
      {status === 'error' && (
        <span
          className="text-xs font-medium rounded-full px-2.5 py-1"
          style={{ color: '#DC2626', backgroundColor: '#FEF2F2' }}
        >
          Error saving
        </span>
      )}
      <button
        onClick={onSave}
        disabled={!isDirty || status === 'saving'}
        className="rounded-xl px-5 py-2 text-sm font-medium transition-colors"
        style={{
          backgroundColor: '#0A0A0A',
          color: '#FFFFFF',
          opacity: !isDirty || status === 'saving' ? 0.4 : 1,
          cursor: !isDirty || status === 'saving' ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={e => {
          if (!(!isDirty || status === 'saving'))
            (e.currentTarget as HTMLElement).style.backgroundColor = '#2A2A2A'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '#0A0A0A'
        }}
      >
        {status === 'saving' ? 'Saving…' : 'Save'}
      </button>
    </div>
  )
}
