'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Phone, Menu, X, KeyRound } from 'lucide-react';
import { SITE } from '@/data/site';
import { Magnetic } from '@/components/motion/motion';

const NAV = [
  { href: '/serrurerie', label: 'Serrurerie' },
  { href: '/vitrerie', label: 'Vitrerie' },
  { href: '/rideau-metallique', label: 'Rideaux métalliques' },
  { href: '/blindage-de-porte', label: 'Blindage' },
  { href: '/marques', label: 'Marques' },
  { href: '/partenaires', label: 'Le réseau' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 500 && y > lastY.current && !open);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${hidden ? '-translate-y-full' : ''} ${
          scrolled ? 'bg-night/80 backdrop-blur-md border-b border-line' : ''
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5" aria-label="ABAO — accueil">
            <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-brass-2 to-brass text-night transition-transform duration-500 group-hover:rotate-[360deg]">
              <KeyRound size={18} strokeWidth={2.2} />
            </span>
            <span className="font-display text-2xl font-extrabold lowercase tracking-tight">
              abao<span className="text-flame">.fr</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="group relative text-[0.82rem] font-medium tracking-wide text-ivory/75 transition-colors hover:text-ivory"
              >
                {n.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-brass-2 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic className="hidden md:block">
              <a
                href={SITE.phoneHref}
                className="pulse-ring flex items-center gap-2.5 rounded-full bg-flame px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-flame-2"
              >
                <Phone size={15} className="animate-pulse" />
                Devis gratuit
              </a>
            </Magnetic>
            <button
              onClick={() => setOpen(!open)}
              className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* volet mobile */}
      <div
        className={`fixed inset-0 z-[55] bg-night/95 backdrop-blur-xl transition-opacity duration-400 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="flex h-full flex-col justify-center gap-2 px-8">
          <p className="kicker mb-4">Un seul numéro</p>
          {NAV.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="h-chapter py-1 text-4xl text-ivory/90 transition-all duration-500 hover:pl-3 hover:text-brass-2"
              style={{ transitionDelay: open ? `${i * 40}ms` : '0ms', opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(16px)' }}
            >
              {n.label}
            </Link>
          ))}
          <a href={SITE.phoneHref} className="mt-8 flex items-center gap-3 text-2xl font-bold text-flame">
            <Phone size={22} /> <span className="font-mono-tech">{SITE.phone}</span>
          </a>
        </nav>
      </div>
    </>
  );
}
