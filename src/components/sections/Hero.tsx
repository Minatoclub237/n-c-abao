'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Phone } from 'lucide-react';
import { SITE } from '@/data/site';
import { Magnetic, Reveal } from '@/components/motion/motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero vidéo scroll-scrub : le mécanisme est piloté par le défilement.
 * Fluidité : le scroll fixe une CIBLE, et le currentTime est interpolé
 * vers elle à chaque frame (gsap.ticker) — jamais posé depuis l'événement
 * scroll, c'est ce qui donne l'effet « image par image » robotique.
 * Encodage keyframes denses (GOP 15/12) pour des seeks instantanés.
 */
export default function Hero() {
  const wrap = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    video.src = mobile ? '/videos/hero-960.mp4' : '/videos/hero-1920.mp4';
    video.load();

    // débloque le décodage sur iOS/Android : lecture muette immédiatement mise en pause
    const unlock = () => { video.play().then(() => video.pause()).catch(() => {}); };
    unlock();
    window.addEventListener('touchstart', unlock, { once: true, passive: true });

    const target = { t: 0 };
    const ctx = gsap.context(() => {
      gsap.to(target, {
        t: 1, ease: 'none',
        scrollTrigger: { trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: 0.35 },
      });
      gsap.to('.hero-t1', {
        opacity: 0, yPercent: -30, ease: 'none',
        scrollTrigger: { trigger: wrap.current, start: '5% top', end: '28% top', scrub: true },
      });
      gsap.fromTo('.hero-t2', { opacity: 0, yPercent: 20 }, {
        opacity: 1, yPercent: 0, ease: 'none', immediateRender: true,
        scrollTrigger: { trigger: wrap.current, start: '26% top', end: '50% top', scrub: true },
      });
    }, wrap);

    // interpolation exponentielle du temps vidéo — le cœur de la fluidité
    let current = 0;
    const tick = () => {
      const dur = video.duration;
      if (!dur || video.readyState < 2) return;
      const goal = target.t * (dur - 0.06);
      current += (goal - current) * 0.16;
      if (Math.abs(goal - current) < 0.0008) current = goal;
      if (!video.seeking && Math.abs(video.currentTime - current) > 0.004) {
        video.currentTime = current;
      }
    };
    if (!reduced) gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('touchstart', unlock);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={wrap} className="relative h-[240vh]" id="hero">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-night">
        {/* vidéo plein cadre, opacité 100 % — scrubée au défilement */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/videos/hero-poster.jpg"
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
        {/* léger voile bas uniquement, pour asseoir le texte sans voiler la vidéo */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-night/80 to-transparent" />

        {/* écran 1 */}
        <div className="hero-t1 relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-[16vh] pt-28 lg:px-8 [text-shadow:0_2px_18px_rgba(3,5,10,0.75)]">
          <p className="kicker mb-5">Roquevaire · Marseille · Aubagne · Aix — depuis toujours en famille</p>
          {/* titre ivoire : un dégradé laiton disparaît sur le cylindre doré de la vidéo */}
          <h1 className="h-hero text-[clamp(3rem,10.5vw,9rem)] uppercase [text-shadow:0_3px_30px_rgba(3,5,10,0.9),0_1px_5px_rgba(3,5,10,0.75)]">
            <Reveal as="span" stagger={0.07}>Serrurier</Reveal>{' '}
            <span className="font-serif-it lowercase text-[0.55em] text-brass-2 align-middle">&</span>{' '}
            <Reveal as="span" delay={0.15} stagger={0.07}>Vitrier</Reveal>
          </h1>
          <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-md text-ivory/85">
              Portes ouvertes sans dégât, vitrages remplacés, rideaux métalliques débloqués —
              jour et nuit, en moins de 30 minutes.
            </p>
            <Magnetic>
              <a href={SITE.phoneHref} className="pulse-ring hidden items-center gap-3 rounded-full bg-flame px-7 py-4 font-bold uppercase tracking-wide text-white md:inline-flex">
                <Phone size={18} /> Devis gratuit
              </a>
            </Magnetic>
          </div>
        </div>

        {/* écran 2 : manifeste pendant que le mécanisme se déploie */}
        <div className="hero-t2 pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-5xl flex-col items-center justify-center px-5 text-center opacity-0 [text-shadow:0_2px_22px_rgba(3,5,10,0.85)]">
          <p className="kicker mb-6">Une serrure n’a pas de secret pour nous</p>
          <p className="h-chapter text-[clamp(1.7rem,4.6vw,3.6rem)]">
            Toutes ces interventions<br />
            <span className="font-serif-it normal-case tracking-normal text-brass-2">sur un seul numéro,</span><br />
            celui de Nicolas.
          </p>
          <a href={SITE.phoneHref} className="pointer-events-auto mt-8 font-mono-tech text-[clamp(1.5rem,4.5vw,3rem)] text-gradient-flame">
            {SITE.phone}
          </a>
        </div>

        {/* affordance de défilement — toujours visible, jamais de scroll piégé */}
        <a
          href="#metiers"
          className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-ivory/70 transition-colors hover:text-brass-2"
        >
          <span className="font-mono-tech text-[0.6rem] uppercase tracking-[0.3em]">Défiler</span>
          <ChevronDown size={16} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}
