import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import siteLogoUrl from './assets/StudioBlanKoLogo.jpg'

const favicon =
  document.querySelector("link[rel='icon']") ??
  Object.assign(document.createElement('link'), { rel: 'icon' })
favicon.type = 'image/jpeg'
favicon.href = siteLogoUrl
if (!favicon.parentNode) document.head.appendChild(favicon)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
