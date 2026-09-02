'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Phone } from 'lucide-react';
import { SITE } from '@/data/site';
import { Magnetic, Reveal } from '@/components/motion/motion';

gsap.registerPlugin(ScrollTrigger);

export type HeroItem = { t: string; d: string };

/**
 * Hero cinématique de page intérieure : vidéo plein écran en boucle, et trois
 * écrans d'informations qui apparaissent puis s'effacent au fil du scroll —
 * 1. titre géant + accent italique + appel · 2. prestations · 3. manifeste.
 */
export default function PageHero({
  videoSrc, poster, kicker, titre, accent, intro, items, itemsTitre = 'Ce que nous faisons',
}: {
  videoSrc: string; poster: string; kicker: string; titre: string; accent: string;
  intro?: string; items: HeroItem[]; itemsTitre?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(['.ph-1', '.ph-2', '.ph-3'], { clearProps: 'all', opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      // NB : la plage utile s'arrête à ~68 % du trigger (hauteur 320vh − 100vh
      // d'écran) — toute fenêtre au-delà ne serait jamais atteinte
      // écran 1 : sort par le haut
      gsap.to('.ph-1', {
        opacity: 0, yPercent: -22, ease: 'none',
        scrollTrigger: { trigger: wrap.current, start: '4% top', end: '19% top', scrub: true },
      });
      // écran 2 : entre puis sort
      gsap.fromTo('.ph-2', { opacity: 0, yPercent: 16 }, {
        opacity: 1, yPercent: 0, ease: 'none', immediateRender: true,
        scrollTrigger: { trigger: wrap.current, start: '15% top', end: '27% top', scrub: true },
      });
      gsap.to('.ph-2', {
        opacity: 0, yPercent: -16, ease: 'none',
        scrollTrigger: { trigger: wrap.current, start: '40% top', end: '50% top', scrub: true },
      });
      // les prestations montent une à une pendant la phase 2
      gsap.fromTo('.ph-item', { y: 60, opacity: 0, rotateX: 18 }, {
        y: 0, opacity: 1, rotateX: 0, stagger: 0.09, ease: 'none',
        scrollTrigger: { trigger: wrap.current, start: '17% top', end: '36% top', scrub: true },
      });
      // écran 3 : manifeste final
      gsap.fromTo('.ph-3', { opacity: 0, yPercent: 18 }, {
        opacity: 1, yPercent: 0, ease: 'none', immediateRender: true,
        scrollTrigger: { trigger: wrap.current, start: '52% top', end: '64% top', scrub: true },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrap} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-night">
        {/* vidéo de fond, opacité 100 % */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-night/90 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-night/70 to-transparent" />

        {/* écran 1 : identité */}
        <div className="ph-1 relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-[14vh] pt-28 lg:px-8 [text-shadow:0_3px_26px_rgba(3,5,10,0.9)]">
          <p className="kicker mb-4">{kicker}</p>
          <h1 className="h-chapter text-[clamp(3rem,9.5vw,8rem)]">
            <Reveal as="span" stagger={0.08}>{titre}</Reveal>
          </h1>
          <p className="mt-3 font-serif-it text-[clamp(1.4rem,3.4vw,2.6rem)] leading-tight text-brass-2">{accent}</p>
          {intro && <p className="mt-5 max-w-xl text-ivory/85">{intro}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Magnetic>
              <a href={SITE.phoneHref} className="pulse-ring inline-flex items-center gap-3 rounded-full bg-flame px-7 py-4 font-bold uppercase tracking-wide text-white hover:bg-flame-2">
                <Phone size={18} /> Devis gratuit
              </a>
            </Magnetic>
            <p className="font-serif-it text-lg text-ivory/75">{SITE.hours} — devis gratuit</p>
          </div>
        </div>

        {/* écran 2 : prestations */}
        <div className="ph-2 pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-6xl flex-col justify-center px-5 opacity-0 lg:px-8 [text-shadow:0_2px_20px_rgba(3,5,10,0.9)]" style={{ perspective: 1000 }}>
          <p className="kicker mb-8">{itemsTitre}</p>
          <div className="grid gap-x-14 gap-y-7 sm:grid-cols-2">
            {items.slice(0, 4).map((it, i) => (
              <div key={it.t} className="ph-item border-l-2 border-brass/50 pl-5" style={{ transformStyle: 'preserve-3d' }}>
                <p className="font-display text-2xl font-bold lg:text-3xl">
                  <span className="mr-3 font-mono-tech text-sm text-flame">0{i + 1}</span>{it.t}
                </p>
                <p className="mt-1.5 max-w-md text-sm text-ivory/75">{it.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* écran 3 : manifeste */}
        <div className="ph-3 pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-5xl flex-col items-center justify-center px-5 text-center opacity-0 [text-shadow:0_2px_22px_rgba(3,5,10,0.9)]">
          <p className="kicker mb-6">Un seul numéro, celui de Nicolas</p>
          <p className="h-chapter text-[clamp(1.7rem,4.6vw,3.4rem)]">
            {accent.replace(/\.$/, '')}<br />
            <span className="font-serif-it normal-case tracking-normal text-brass-2">on s’en occupe.</span>
          </p>
          <a href={SITE.phoneHref} className="pointer-events-auto mt-8 font-mono-tech text-[clamp(1.5rem,4.5vw,3rem)] text-gradient-flame">
            {SITE.phone}
          </a>
        </div>

        {/* affordance */}
        <a href="#suite" className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-ivory/70 transition-colors hover:text-brass-2">
          <span className="font-mono-tech text-[0.6rem] uppercase tracking-[0.3em]">Défiler</span>
          <ChevronDown size={16} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}
