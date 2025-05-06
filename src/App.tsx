import { Garden } from './components/ui/garden'
import { Header } from './components/ui/header'

export function App() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Garden />
      </main>
    </>
  )
}
