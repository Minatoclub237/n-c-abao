'use client';

import { useState, type FormEvent } from 'react';
import { Send, Phone, MapPin, Clock } from 'lucide-react';
import { SITE } from '@/data/site';
import { Magnetic } from '@/components/motion/motion';

const SERVICES_OPTS = [
  'Serrurerie — ouverture / remplacement',
  'Blindage de porte',
  'Vitrerie — remplacement de vitrage',
  'Rideau métallique',
  'Ramonage',
  'Autre demande',
];

const champ =
  'w-full rounded-xl border border-line bg-night/60 px-4 py-3.5 text-sm text-ivory placeholder:text-ivory/35 outline-none transition-colors focus:border-brass-2/70';

/* Formulaire pro — envoi via le client mail (aucune donnée stockée) */
export default function ContactForm() {
  const [envoye, setEnvoye] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const sujet = `[abao.fr] ${f.get('service')} — ${f.get('nom')}`;
    const corps = [
      `Nom : ${f.get('nom')}`,
      `Téléphone : ${f.get('tel')}`,
      `E-mail : ${f.get('email') || '—'}`,
      `Commune : ${f.get('commune') || '—'}`,
      `Demande : ${f.get('service')}`,
      '',
      `${f.get('message')}`,
    ].join('\n');
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
    setEnvoye(true);
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8" id="devis">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
        {/* formulaire */}
        <form onSubmit={onSubmit} className="card-glass rounded-3xl p-7 lg:p-10">
          <p className="kicker">Demande de devis</p>
          <h2 className="h-chapter mt-2 text-3xl">
            Décrivez votre besoin,{' '}
            <span className="font-serif-it normal-case tracking-normal text-gradient-brass">Nicolas vous rappelle.</span>
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="f-nom" className="mb-1.5 block font-mono-tech text-[0.65rem] uppercase tracking-[0.2em] text-ivory/60">Nom *</label>
              <input id="f-nom" name="nom" required placeholder="Votre nom" className={champ} />
            </div>
            <div>
              <label htmlFor="f-tel" className="mb-1.5 block font-mono-tech text-[0.65rem] uppercase tracking-[0.2em] text-ivory/60">Téléphone *</label>
              <input id="f-tel" name="tel" type="tel" required placeholder="06 …" className={champ} />
            </div>
            <div>
              <label htmlFor="f-email" className="mb-1.5 block font-mono-tech text-[0.65rem] uppercase tracking-[0.2em] text-ivory/60">E-mail</label>
              <input id="f-email" name="email" type="email" placeholder="vous@exemple.fr" className={champ} />
            </div>
            <div>
              <label htmlFor="f-commune" className="mb-1.5 block font-mono-tech text-[0.65rem] uppercase tracking-[0.2em] text-ivory/60">Commune</label>
              <input id="f-commune" name="commune" placeholder="Marseille 8e, Aubagne…" className={champ} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="f-service" className="mb-1.5 block font-mono-tech text-[0.65rem] uppercase tracking-[0.2em] text-ivory/60">Votre demande *</label>
              <select id="f-service" name="service" required className={`${champ} appearance-none`}>
                {SERVICES_OPTS.map((s) => <option key={s} value={s} className="bg-night-2">{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="f-message" className="mb-1.5 block font-mono-tech text-[0.65rem] uppercase tracking-[0.2em] text-ivory/60">Message *</label>
              <textarea
                id="f-message" name="message" required rows={5}
                placeholder="Décrivez la situation : type de porte ou de vitrage, étage, dimensions approximatives…"
                className={`${champ} resize-y`}
              />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-5">
            <Magnetic>
              <button type="submit" className="inline-flex items-center gap-2.5 rounded-full bg-flame px-8 py-4 font-bold text-white transition-colors hover:bg-flame-2">
                <Send size={16} /> Envoyer ma demande
              </button>
            </Magnetic>
            <p className="max-w-xs text-[0.72rem] leading-relaxed text-ivory/45">
              Le message s’ouvre dans votre messagerie — aucune donnée n’est stockée sur ce site.
            </p>
          </div>
          {envoye && (
            <p className="mt-4 rounded-xl border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-brass-2">
              Votre messagerie s’est ouverte avec le message prérempli — il ne reste qu’à l’envoyer. Merci !
            </p>
          )}
        </form>

        {/* rappel urgence + coordonnées */}
        <aside className="flex flex-col gap-5">
          <div className="card-glass rounded-3xl border-flame/30 p-7">
            <p className="kicker text-flame">C’est urgent ?</p>
            <p className="mt-3 font-serif-it text-xl text-ivory/85">Porte claquée, vitre brisée, rideau bloqué —</p>
            <p className="mt-1 text-sm text-ivory/60">n’attendez pas le formulaire, appelez directement :</p>
            <a href={SITE.phoneHref} className="pulse-ring mt-5 inline-flex items-center gap-3 rounded-full bg-flame px-7 py-4 font-bold uppercase tracking-wide text-white hover:bg-flame-2">
              <Phone size={17} /> Devis gratuit
            </a>
            <p className="mt-3 flex items-center gap-2 text-[0.78rem] text-ivory/50">
              <Clock size={13} /> {SITE.hours} — arrivée en {SITE.delai}
            </p>
          </div>
          <div className="card-glass rounded-3xl p-7">
            <p className="kicker">Atelier & quincaillerie</p>
            <p className="mt-3 flex items-start gap-2 text-sm text-ivory/70">
              <MapPin size={15} className="mt-0.5 shrink-0 text-brass-2" />
              <span>{SITE.address}<br />antenne {SITE.addressAubagne}</span>
            </p>
            <p className="mt-4 text-[0.78rem] text-ivory/50">
              Fixe : {SITE.phoneFixe} · {SITE.email}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
