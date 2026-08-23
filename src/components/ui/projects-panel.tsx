import { useTranslation } from 'react-i18next'
import { bedConfig } from '../../config/beds'
import { HotspotId } from '../../config/hotspots'
import { projectsData } from '../../data/projects'
import { selectHotspot, useGarden } from '../../hooks/garden'
import { cn } from '../../utils/cn'
import { ProjectRow } from './projects-panel/project-row'

export function ProjectsPanel() {
  const { t } = useTranslation()
  const isOpen = useGarden((state) => state.selected === HotspotId.Projects)

  return (
    <aside
      aria-hidden={!isOpen}
      aria-label={t('zones.projects.name')}
      className={cn(
        'absolute inset-y-0 right-0 z-60 flex w-full flex-col sm:max-w-md',
        'border-l border-white/50 bg-white/45 backdrop-blur-2xl',
        'transition-transform duration-500 ease-out',
        isOpen
          ? 'translate-x-0 shadow-[-16px_0_48px_-24px_rgba(0,0,0,0.45)]'
          : 'pointer-events-none translate-x-full',
      )}
    >
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/50 px-5 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] tracking-[0.28em] text-black/50 uppercase">
            {t('zones.projects.name')}
          </span>
          <p className="text-base leading-tight text-black">{t('zones.projects.title')}</p>
        </div>

        <button

          type="button"
          onClick={() => selectHotspot(null)}
          className="cursor-pointer shrink-0 rounded-sm border border-black/20 px-2 py-0.5 text-xs text-black/70 transition-colors hover:border-black hover:text-black"
        >
          {t('close')}
        </button>
      </header>

      <ul className="min-h-0 flex-1 divide-y divide-white/50 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden">
        {projectsData.map((project, index) => (
          <ProjectRow
            key={project.slug}
            project={project}
            dotColor={bedConfig.beds[index]?.petal ?? bedConfig.beds[0].petal}
          />
        ))}
      </ul>
    </aside>
  )
}
