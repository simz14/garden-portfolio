import { contactLinks } from '../../data/contact'
import { DebugToggle } from './header/debug-toggle'
import { LocaleSwitcher } from './header/locale-switcher'

const github = contactLinks.find((link) => link.label === 'GitHub')!

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="flex items-center gap-3 px-6 py-4 font-mono">
        {import.meta.env.DEV && <DebugToggle />}

        <div className="ml-auto flex items-center gap-3">
          <LocaleSwitcher />

          <a
            href={github.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={github.label}
            className="transition-colors hover:text-accent"
          >
            <img src={github.src} alt="" className="size-6" />
          </a>
        </div>
      </nav>
    </header>
  )
}
