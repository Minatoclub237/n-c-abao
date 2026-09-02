'use client';

import { useEffect, useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { SITE } from '@/data/site';

/* Barre d'appel mobile — apparaît après le hero, ne quitte plus l'écran */
export default function CallBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-[70] flex gap-2 transition-all duration-500 md:hidden ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0'
      }`}
    >
      <a
        href={SITE.phoneHref}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-flame py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(240,120,24,0.4)]"
      >
        <Phone size={16} /> <span className="uppercase tracking-wide">Devis gratuit</span>
      </a>
      <a
        href={`https://wa.me/33660094976?text=${encodeURIComponent('Bonjour, j’ai besoin d’une intervention.')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="grid size-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg"
      >
        <MessageCircle size={20} />
      </a>
    </div>
  );
}
