'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { BarChart3, BookOpen, Bot, CalendarDays, Check, Copy, ExternalLink, FileDown, KeyRound, LayoutGrid, LineChart, Settings, SquareStack, X } from 'lucide-react';
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
    href: 'https://seguimiento-pmo.actoreselectorales.com/',
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
    href: 'https://congreso2026.actoreselectorales.com/',
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
    comingSoon: true,
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

function CredentialsModal({ item, onClose }: { item: LauncherItem | null; onClose: () => void }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!item?.credentials?.length) return null;

  const Icon = item.icon;

  const handleCopy = async (value: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch { /* clipboard not available */ }
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
              className="flex items-center gap-2 bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  {cred.label}
                </p>
                <p className="text-sm font-mono text-gray-800 mt-0.5 truncate">{cred.value}</p>
              </div>
              <button
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

  const handleCredentialsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShowCredentials?.();
  };

  const inner = (
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
          {!!item.credentials?.length && (
            <button
              type="button"
              onClick={handleCredentialsClick}
              className="p-1 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title="Ver credenciales"
            >
              <KeyRound className="w-3.5 h-3.5" />
            </button>
          )}
          {!disabled && (
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-3 leading-snug">{item.description}</p>
        {disabled && <p className="text-xs text-amber-700/90 font-medium mt-2">Próximamente</p>}
      </div>
    </>
  );

  const className =
    'group flex flex-row sm:flex-col items-start sm:items-center gap-4 sm:gap-3 w-full min-w-0 rounded-xl p-4 sm:p-5 border border-transparent hover:border-gray-200 hover:bg-gray-50/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

  if (disabled) {
    return (
      <div className={`${className} cursor-not-allowed opacity-90`} aria-disabled="true">
        {inner}
      </div>
    );
  }

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={`Abrir ${item.title} en una nueva pestaña`}
    >
      {inner}
    </a>
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
