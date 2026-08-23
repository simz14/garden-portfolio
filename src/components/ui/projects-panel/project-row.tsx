import { useTranslation } from 'react-i18next'
import type { Project } from '../../../data/projects'
import { contactLinks } from '../../../data/contact'

const github = contactLinks.find((link) => link.label === 'GitHub')!

export function ProjectRow({ project, dotColor }: { project: Project, dotColor: string }) {
  const { t } = useTranslation()

  const title = t(`projects.items.${project.slug}.title`)
  const description = t(`projects.items.${project.slug}.description`)

  return (
    <li className="group flex flex-col gap-3 px-5 py-6">
      <div className="overflow-hidden ring-1 ring-white/40">
        <img
          src={project.image}
          alt={`${title} - project screenshot`}
          loading="lazy"
          className="aspect-16/10 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="size-2.5 shrink-0 rounded-full ring-2 ring-white/60"
          style={{ background: dotColor }}
        />
        <p className="text-base font-medium text-black">{title}</p>

        {project.isPersonal && (
          <span className="rounded-xs bg-black/10 px-1.5 py-0.5 text-[9px] tracking-[0.16em] text-black/50">
            {t('projects.personal')}
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-black/65 font-sans">{description}</p>

      <ul className="flex flex-wrap gap-1">
        {project.technologies.map((tool) => (
          <li
            key={tool}
            className="rounded-xs bg-black/10 px-1.5 py-0.5 font-mono text-[10px] text-black/70"
          >
            {tool}
          </li>
        ))}
      </ul>

      {(project.liveUrl || project.repoUrl) && (
        <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-black/85 px-3 py-1.5 tracking-[0.12em] text-white uppercase transition-colors hover:bg-accent hover:text-black"
            >
              {t('\.live')}
              <span aria-hidden>↗</span>
              <span className="sr-only"> - {title}</span>
            </a>
          )}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/25 px-3 py-1.5 tracking-[0.12em] text-black/70 uppercase transition-colors hover:border-black hover:text-black"
            >
              <img src={github.src} alt="" className="size-3" />
              {t('projects.code')}
              <span className="sr-only"> - {title}</span>
            </a>
          )}
        </div>
      )}
    </li>
  )
}
