import { createRoot } from 'react-dom/client'
import './style.css'
import './node-materials'
import { App } from './App'

createRoot(document.getElementById('app')!).render(<App />)
