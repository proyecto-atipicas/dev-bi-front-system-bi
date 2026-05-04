'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  Check,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  FileDown,
  KeyRound,
  LayoutGrid,
  LineChart,
  Settings,
  SquareStack,
  X,
} from 'lucide-react';
import { API } from '@/lib/constants';

export type LauncherItem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconClass: string;
  href?: string;
  comingSoon?: boolean;
  credentials?: { label: string; value: string }[];
};

const ITEMS: LauncherItem[] = [
  {
    id: 'simae',
    title: 'SIMAE',
    description:
      'Tablero de experiencia SIMAE (Sistema Integral de monitoreo y analitica electoral).',
    icon: SquareStack,
    iconClass: 'text-violet-600',
    href: 'https://simae.actoreselectorales.com/',
    credentials: [
      { label: 'Contraseña', value: 'Pr351d3nc14*2026' },
    ],
  },
  // https://portafolio-servicios-bi.vercel.app/servicio/reporteria
  {
    id: 'portafolio',
    title: 'Portafolio de Servicios',
    description:
      'Portafolio de servicios de la empresa.',
    icon: SquareStack,
    iconClass: 'text-violet-600',
    href: 'https://portafolio-servicios-bi.vercel.app/',
  },
  {
    id: 'appbi',
    title: 'AppBI',
    description:
      'Aplicación transversal de apoyo para las diferentes áreas del proyecto, para gestión administrativa.',
    icon: SquareStack,
    iconClass: 'text-violet-600',
    href: 'https://appbi.actoreselectorales.com/',
    credentials: [
      { label: 'Usuario', value: 'superadmin' },
      { label: 'Contraseña', value: 'Admin123!' },
    ],
  },
  {
    id: 'seguimiento-pmo',
    title: 'Seguimiento PMO',
    description: 'Aplicación de monitoreo interno.',
    icon: LineChart,
    iconClass: 'text-emerald-600',
    href: 'https://seguimiento-data.actoreselectorales.com/',
    credentials: [
      { label: 'Usuario', value: 'admin' },
      { label: 'Contraseña', value: 'Admin123!' },
    ],
  },
  {
    id: 'embebidos-publicos',
    title: 'Embebidos Públicos',
    description:
      'Aplicación donde se encuentran embebidos los tableros de Power BI, tanto congreso como consulta.',
    icon: LayoutGrid,
    iconClass: 'text-sky-600',
    href: 'https://presidencia2026.actoreselectorales.com/',
    credentials: [{ label: 'Token', value: 'Eleccioones2026*' }],
  },
  {
    id: 'bot-trafico',
    title: 'Bot Tráfico',
    description: 'Generador de tráfico para el módulo de capacitaciones.',
    icon: Bot,
    iconClass: 'text-amber-600',
    href: 'https://botbi.actoreselectorales.com/',
    credentials: [{ label: 'Token', value: 'Admin123!' }],
  },
  {
    id: 'descarga-credenciales',
    title: 'Descarga de Credenciales',
    description:
      'Herramienta para la descarga de resoluciones y credenciales del sistema CNE.',
    icon: FileDown,
    iconClass: 'text-teal-600',
    href: 'https://credenciales.actoreselectorales.com/',
    credentials: [{ label: 'Contraseña', value: 'Pr351d3nc14*2026' }],
  },
  {
    id: 'analitica-presidencia',
    title: 'Analítica de Presidencia',
    description: 'Herramienta de análisis de elecciones presidenciales históricas.',
    icon: BarChart3,
    iconClass: 'text-rose-600',
    href: 'https://analisis-presidencia-colombia.vercel.app/',
  },
  {
    id: 'documentacion-area',
    title: 'Documentación Área',
    description: 'Documentación técnica del área y sus herramientas utilizadas.',
    icon: BookOpen,
    iconClass: 'text-indigo-600',
    href: 'https://documentacionbi.vercel.app/',
  },
  {
    id: 'actividades-bi',
    title: 'Actividades BI',
    description: 'Cronograma de planeación de las tareas del área.',
    icon: CalendarDays,
    iconClass: 'text-orange-600',
    href: 'https://proyecto-atipicas.github.io/dev-bi-cronograma-actividades-v1/',
  },
  {
    id: 'configuracion',
    title: 'Configuración',
    description: 'En definición.',
    icon: Settings,
    iconClass: 'text-gray-400',
    comingSoon: true,
  },
];

type AppLauncherMenuProps = {
  appTitle?: string;
  onLogout?: () => void | Promise<void>;
};

const SENSITIVE_LABELS = new Set(['contraseña', 'token', 'password']);

/** Carga el `src` del iframe solo cuando el contenedor entra en vista (evita abrir muchas apps a la vez). */
function useLazyIframeSrc(url: string | undefined) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!url) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSrc(url);
          observer.disconnect();
        }
      },
      { rootMargin: '120px', threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [url]);

  return { containerRef, src };
}

function CredentialsModal({ item, onClose }: { item: LauncherItem | null; onClose: () => void }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setRevealed({});
    setCopiedIdx(null);
  }, [item]);

  if (!item?.credentials?.length) return null;

  const Icon = item.icon;

  const handleCopy = async (value: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch { /* clipboard not available */ }
  };

  const isSensitive = (label: string) => SENSITIVE_LABELS.has(label.toLowerCase());
  const mask = (value: string) => '•'.repeat(Math.max(value.length, 8));

  const toggleReveal = (idx: number) => {
    setRevealed((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center">
              <Icon className={`w-4 h-4 ${item.iconClass}`} strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-gray-800">{item.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 pb-5 space-y-2.5">
          {item.credentials.map((cred, idx) => (
            <div
              key={cred.label}
              className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  {cred.label}
                </p>
                <p
                  className={`text-sm font-mono text-gray-800 mt-0.5 truncate ${
                    isSensitive(cred.label) && !revealed[idx] ? 'select-none' : ''
                  }`}
                >
                  {isSensitive(cred.label) && !revealed[idx] ? mask(cred.value) : cred.value}
                </p>
              </div>
              {isSensitive(cred.label) && (
                <button
                  type="button"
                  onClick={() => toggleReveal(idx)}
                  className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white hover:shadow-sm transition-all"
                  title={revealed[idx] ? `Ocultar ${cred.label.toLowerCase()}` : `Mostrar ${cred.label.toLowerCase()}`}
                  aria-pressed={!!revealed[idx]}
                >
                  {revealed[idx] ? (
                    <EyeOff className="w-3.5 h-3.5" aria-hidden />
                  ) : (
                    <Eye className="w-3.5 h-3.5" aria-hidden />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleCopy(cred.value, idx)}
                className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white hover:shadow-sm transition-all"
                title={`Copiar ${cred.label}`}
              >
                {copiedIdx === idx ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LauncherCard({
  item,
  onShowCredentials,
}: {
  item: LauncherItem;
  onShowCredentials?: () => void;
}) {
  const Icon = item.icon;
  const disabled = item.comingSoon || !item.href;
  const { containerRef: previewRef, src: previewSrc } = useLazyIframeSrc(
    disabled ? undefined : item.href
  );

  const handleCredentialsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShowCredentials?.();
  };

  const previewBlock =
    !disabled && item.href ? (
      <div
        ref={previewRef}
        className="relative w-full h-[140px] sm:h-[150px] shrink-0 overflow-hidden bg-gradient-to-b from-slate-100 to-slate-50 border-b border-gray-100"
      >
        {previewSrc ? (
          <iframe
            title={`Vista previa de ${item.title}`}
            src={previewSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute left-0 top-0 h-[480px] w-[min(1280px,220%)] max-w-none origin-top-left scale-[0.34] sm:scale-[0.36] pointer-events-none border-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[11px] text-gray-400">
            Cargando vista previa…
          </div>
        )}
        <p className="absolute bottom-1.5 left-2 right-2 text-[10px] text-gray-400/90 leading-tight pointer-events-none">
          
        </p>
      </div>
    ) : null;

  const linkBody = (
    <>
      <div
        className={`w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] rounded-[10px] border flex items-center justify-center transition-all duration-200 shrink-0 ${
          disabled
            ? 'bg-gray-50 border-gray-200/80 shadow-none'
            : 'bg-white border-gray-100/80 shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 group-active:translate-y-0'
        }`}
        aria-hidden
      >
        <Icon className={`w-9 h-9 sm:w-10 sm:h-10 ${item.iconClass}`} strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[15px] sm:text-base font-semibold text-gray-800">{item.title}</span>
          {!disabled && (
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-3 leading-snug">{item.description}</p>
        {disabled && <p className="text-xs text-amber-700/90 font-medium mt-2">Próximamente</p>}
      </div>
    </>
  );

  const cardShell =
    'group flex flex-col w-full min-w-0 rounded-xl border border-transparent overflow-hidden hover:border-gray-200 hover:bg-gray-50/80 transition-colors';

  const rowClass =
    'flex flex-row sm:flex-col items-start sm:items-center gap-4 sm:gap-3 w-full p-4 sm:p-5 min-h-0';

  if (disabled) {
    return (
      <div className={`${cardShell} cursor-not-allowed opacity-90`} aria-disabled="true">
        {previewBlock}
        <div className={`${rowClass}`}>{linkBody}</div>
      </div>
    );
  }

  return (
    <div className={cardShell}>
      {previewBlock}
      <div className={`${rowClass} items-start`}>
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-row sm:flex-col items-start sm:items-center gap-4 sm:gap-3 flex-1 min-w-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          title={`Abrir ${item.title} en una nueva pestaña`}
        >
          {linkBody}
        </a>
        {!!item.credentials?.length && (
          <button
            type="button"
            onClick={handleCredentialsClick}
            className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors sm:mt-1"
            title="Ver credenciales"
          >
            <KeyRound className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function AppLauncherMenu({ appTitle = 'Herramientas Data BI - CNE', onLogout }: AppLauncherMenuProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [credentialItem, setCredentialItem] = useState<LauncherItem | null>(null);

  const handleCerrarSesion = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch(API.logout, { method: 'POST', credentials: 'include' });
    } finally {
      await onLogout?.();
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col overflow-auto bg-white">
      <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 sm:px-6">
        <Image
          src="/appbi-logo.svg"
          alt="AppBI"
          width={280}
          height={90}
          className="h-9 w-auto sm:h-10 shrink-0"
          priority
        />
        <button
          type="button"
          onClick={handleCerrarSesion}
          disabled={loggingOut}
          className="border-0 bg-transparent p-0 text-sm font-medium text-slate-600 underline-offset-4 transition-colors hover:text-slate-900 hover:underline disabled:opacity-50 cursor-pointer shrink-0"
        >
          {loggingOut ? 'Cerrando…' : 'Cerrar sesión'}
        </button>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="px-6 pt-8 pb-4 text-center max-w-3xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">{appTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">Seleccione un módulo. Los enlaces se abren en una nueva pestaña.</p>
        </header>

        <div className="max-w-5xl mx-auto w-full flex-1 px-5 sm:px-8 pb-8">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            role="navigation"
            aria-label="Módulos del proyecto"
          >
            {ITEMS.map((item) => (
              <LauncherCard
                key={item.id}
                item={item}
                onShowCredentials={
                  item.credentials?.length
                    ? () => setCredentialItem(item)
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-auto shrink-0 border-t border-gray-200 bg-white px-4 py-4 text-center text-xs text-gray-500 sm:text-sm">
        Copyright © Data BI - CNE
      </footer>

      <CredentialsModal
        item={credentialItem}
        onClose={() => setCredentialItem(null)}
      />
    </div>
  );
}
