import Image from 'next/image';
import { Clapperboard, Camera, Play, Phone } from 'lucide-react';
import { SITE } from '@/data/site';
import { Magnetic } from '@/components/motion/motion';

/**
 * MediaPlaceholder — cadre « plan de tournage » cinématique.
 * type="video" : emplacement d'un futur clip (image de l'ancien site en attendant, ou fond studio).
 * type="photo" : photo récupérée de l'ancien site, traitée duotone pour homogénéiser le grain stock.
 */
export function MediaPlaceholder({
  type = 'photo', src, videoSrc, poster, alt = '', plan, note, ratio = 'aspect-[16/10]', className = '', priority = false, plain = false,
}: {
  type?: 'video' | 'photo'; src?: string; videoSrc?: string; poster?: string; alt?: string; plan?: string; note?: string;
  ratio?: string; className?: string; priority?: boolean;
  /** plain : image affichée telle quelle, opacité 100 % (pas de duotone, voile minimal) */
  plain?: boolean;
}) {
  return (
    <figure className={`slate-corner group relative overflow-hidden rounded-2xl border border-line bg-surface ${ratio} ${className}`}>
      {videoSrc ? (
        // vraie vidéo : lecture auto muette en boucle, poster en attendant
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
        />
      ) : src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`${plain ? '' : 'duotone '}object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]`}
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(90%_120%_at_20%_0%,#182338_0%,#0b1220_55%,#06090f_100%)]" />
      )}
      <div className={`pointer-events-none absolute inset-0 ${plain ? 'bg-gradient-to-t from-night/55 via-transparent to-transparent' : 'bg-gradient-to-t from-night/85 via-night/10 to-night/30'}`} />
      <div className="scanline" />

      {type === 'video' && !videoSrc && (
        <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brass-2/50 bg-night/50 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
          <Play size={20} className="ml-0.5 text-brass-2" fill="currentColor" />
        </span>
      )}

      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <span className="flex items-center gap-2 font-mono-tech text-[0.62rem] uppercase text-brass-2/90">
          {type === 'video' || videoSrc ? <Clapperboard size={13} /> : <Camera size={13} />}
          {plan ?? (type === 'video' ? 'Plan vidéo — à tourner' : 'Photo')}
        </span>
        {note && <span className="max-w-[55%] text-right font-mono-tech text-[0.6rem] leading-relaxed text-ivory/45">{note}</span>}
      </figcaption>
    </figure>
  );
}

export function SectionHead({ kicker, num }: { kicker: string; num: string }) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <span className="font-mono-tech text-[0.68rem] text-flame">{num}</span>
      <span className="h-px w-10 bg-brass/50" />
      <p className="kicker">{kicker}</p>
    </div>
  );
}

export function CallCta({ label = 'Devis gratuit', sub }: { label?: string; sub?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Magnetic>
        <a
          href={SITE.phoneHref}
          className="pulse-ring group inline-flex items-center gap-3 rounded-full bg-flame px-8 py-4 font-bold uppercase tracking-wide text-white transition-all hover:bg-flame-2"
        >
          <Phone size={18} className="transition-transform group-hover:rotate-12" />
          <span>{label}</span>
        </a>
      </Magnetic>
      {sub && <p className="font-serif-it text-lg text-ivory/60">{sub}</p>}
    </div>
  );
}
