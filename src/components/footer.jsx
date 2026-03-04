import React from 'react'

const LINKS = {
  sitemap: [
    { label: 'Portfolio',  href: 'https://portfolio.com' },
    { label: 'Contact',    href: 'mailto:miguelescobarp03@gmail.com' },
  ],
  socials: [
    { label: 'LinkedIn',   href: 'https://www.linkedin.com/in/miguel-escobar-p?utm_source=share_via&utm_content=profile&utm_medium=member_ios' },
    { label: 'GitHub',     href: 'https://github.com/MiguelEscobar0345' },
    { label: 'Instagram',  href: 'https://www.instagram.com/escomiguep?igsh=Njl4bWpnOXB3NTJ1&utm_source=qr' },
    { label: 'Email',      href: 'mailto:miguelescobarp03@gmail.com' },
  ],
}

export default function Footer() {
  return (
    <>
      <style>{`
        .f-link { text-decoration:none; color: rgba(255,255,255,0.5); font-size:0.95rem; line-height:2.2; display:block; transition:color 0.15s; }
        .f-link:hover { color: #60a5fa; }
        @media(max-width:640px){
          .f-cols{flex-direction:column!important;gap:32px!important;}
          .f-bottom{flex-direction:column!important;gap:20px!important;align-items:flex-start!important;}
          .f-name{font-size:2.2rem!important;}
        }
      `}</style>
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.3)',
        padding: '48px 40px 40px',
        boxSizing: 'border-box',
      }}>
        <div className="f-cols" style={{ display:'flex', justifyContent:'space-between', gap:40, marginBottom:48 }}>
          <div>
            <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'var(--font-mono)', marginBottom:8 }}>Sitemap</div>
            {LINKS.sitemap.map(l => <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="f-link">{l.label}</a>)}
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'var(--font-mono)', marginBottom:8 }}>Socials</div>
            {LINKS.socials.map(l => <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="f-link">{l.label}</a>)}
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', marginBottom:36 }} />

        <div className="f-bottom" style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
          <h2 className="f-name" style={{
            fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3rem)',
            fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.05, color:'var(--text-1)',
          }}>
            Miguel E.<br />Escobar P.
          </h2>
          <div style={{ display:'flex', alignItems:'flex-end', gap:12 }}>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'var(--font-mono)' }}>Version</div>
              <div style={{ fontSize:'1.3rem', fontWeight:700, color:'var(--text-1)', fontFamily:'var(--font-mono)' }}>2026</div>
            </div>
            <img src="/public/macaw.png" alt="Macaw" style={{ width:44, height:44, objectFit:'contain', opacity:0.8 }} onError={e => { e.target.style.display='none' }} />
          </div>
        </div>
      </footer>
    </>
  )
}