import type { TechBrand } from '../../../../data/tech'
import { cn } from '../../../../utils/cn'

export function TechBadge({
  brand,
  index,
  isOpen,
  isLead = false,
}: {
  brand: TechBrand
  index: number
  isOpen: boolean
  isLead?: boolean
}) {
  return (
    <li
      style={{ transitionDelay: isOpen ? `${index * 35}ms` : undefined }}
      className={cn(
        'flex items-center rounded-full bg-white/30 whitespace-nowrap text-black/75',
        'shadow-[0_10px_28px_-18px_rgba(0,0,0,0.65)] ring-1 ring-white/45 ring-inset backdrop-blur-md',
        'transition-[opacity,transform] duration-500 ease-out',
        isLead
          ? 'gap-2.5 py-1.5 pr-4 pl-2 font-mono text-[12px] tracking-[0.16em] uppercase'
          : 'gap-1.5 py-1 pr-2.5 pl-1.5 font-mono text-[10px] tracking-[0.12em] uppercase',
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0',
      )}
    >
      {brand.src ? (
        <img
          src={brand.src}
          alt=""
          className={cn(
            'drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]',
            isLead ? 'size-5' : 'size-4',
          )}
        />
      ) : (
        <span
          aria-hidden
          style={{ backgroundColor: brand.color }}
          className={cn(
            'flex items-center justify-center rounded-full leading-none tracking-normal text-white',
            isLead ? 'size-5 text-[8px]' : 'size-4 text-[7px]',
          )}
        >
          {brand.mark}
        </span>
      )}

      {brand.name}
    </li>
  )
}
