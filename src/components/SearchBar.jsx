import React, { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [val, setVal] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (val.trim()) onSearch(val.trim())
  }

  return (
    <form onSubmit={submit} style={{ width: '100%', maxWidth: 480 }}>
      <div style={{ position: 'relative' }}>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round"
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search city…"
          value={val}
          onChange={e => setVal(e.target.value)}
          style={{
            width: '100%',
            height: 48,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            padding: '0 120px 0 46px',
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            color: 'var(--text-1)',
            caretColor: 'var(--accent)',
            outline: 'none',
            transition: 'all var(--transition)',
          }}
          onFocus={e => {
            e.target.style.background = 'rgba(255,255,255,0.09)'
            e.target.style.borderColor = 'var(--accent)'
            e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.15)'
          }}
          onBlur={e => {
            e.target.style.background = 'rgba(255,255,255,0.06)'
            e.target.style.borderColor = 'rgba(255,255,255,0.14)'
            e.target.style.boxShadow = 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading || !val.trim()}
          style={{
            position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
            height: 36, padding: '0 18px',
            background: loading ? 'rgba(96,165,250,0.3)' : 'var(--accent)',
            border: 'none', borderRadius: 10,
            fontFamily: 'var(--font-display)',
            fontSize: '0.8rem', fontWeight: 600,
            color: loading ? 'var(--text-2)' : '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition)',
            letterSpacing: '0.02em',
          }}
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>
    </form>
  )
}