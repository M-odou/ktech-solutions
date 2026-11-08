/** Icônes SVG au trait (24 px), décoratives par défaut : le texte voisin porte le sens. */
const PATHS = {
  formation: <><path d="M22 9 12 4 2 9l10 5 10-5Z" /><path d="M6 11v5c3.5 2.5 8.5 2.5 12 0v-5" /><path d="M22 9v6" /></>,
  dev: <><path d="m8 6-6 6 6 6" /><path d="m16 6 6 6-6 6" /><path d="m14 4-4 16" /></>,
  design: <><path d="M12 3a9 9 0 1 0 0 18c1 0 1.6-.7 1.6-1.6 0-.9-.8-1.3-.8-2.2 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4C21 7 17 3 12 3Z" /><circle cx="7.5" cy="11" r="1.2" /><circle cx="10.5" cy="7.5" r="1.2" /><circle cx="15" cy="7.5" r="1.2" /></>,
  print: <><path d="M6 9V3h12v6" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6z" /></>,
  event: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /><path d="m9.5 15 2 2 3.5-3.5" /></>,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M18 14.5a6.5 6.5 0 0 1 3.5 5.5" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></>,
  hands: <><path d="M7 11V6a1.5 1.5 0 0 1 3 0v4" /><path d="M10 10V4.5a1.5 1.5 0 0 1 3 0V10" /><path d="M13 10V5.5a1.5 1.5 0 0 1 3 0V12" /><path d="M16 9a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.7L3.6 15a1.6 1.6 0 0 1 2.6-1.8L7 14" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  phone: <path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  building: <><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" /><path d="M10 21v-3h4v3" /></>,
  rocket: <><path d="M5 15c-1.5 1.5-2 4-2 6 2 0 4.5-.5 6-2" /><path d="M9 15 15 9" /><path d="M14 4c3-1 6-1 6-1s0 3-1 6l-6 6-4-4 5-7Z" /><path d="M9 11H5l3-3h4" /><path d="M13 15v4l3-3v-4" /></>,
  student: <><circle cx="12" cy="7" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />,
  linkedin: <path fill="currentColor" stroke="none" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.1c0-1.22-.02-2.79-1.7-2.79-1.7 0-1.96 1.33-1.96 2.7V21h-4V9.5Z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>,
  facebook: <path fill="currentColor" stroke="none" d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3C16.7 2.2 15.6 2 14.4 2 11.8 2 10 3.6 10 6.5v2H7.3v3.6H10V22h4v-9.9h2.9l.4-3.6H14Z" />,
  tiktok: <path fill="currentColor" stroke="none" d="M16.6 2h-3.4v13.4a2.9 2.9 0 1 1-2.1-2.8V9.1a6.3 6.3 0 1 0 5.5 6.3V8.6a8 8 0 0 0 4.4 1.4V6.6a4.5 4.5 0 0 1-4.4-4.6Z" />,
  whatsapp: <path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />,
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
