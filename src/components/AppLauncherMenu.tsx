'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { ExternalLink, LayoutGrid, LineChart, Settings, SquareStack } from 'lucide-react';
import { API } from '@/lib/constants';

export type LauncherItem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconClass: string;
  href?: string;
  /** Sin enlace: se muestra como no disponible */
  comingSoon?: boolean;
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
  },
  {
    id: 'seguimiento-pmo',
    title: 'Seguimiento PMO',
    description: 'Aplicación de monitoreo interno.',
    icon: LineChart,
    iconClass: 'text-emerald-600',
    href: 'https://seguimiento-pmo.actoreselectorales.com/',
  },
  {
    id: 'embebidos-publicos',
    title: 'Embebidos Públicos',
    description:
      'Aplicación donde se encuentran embebidos los tableros de Power BI, tanto congreso como consulta.',
    icon: LayoutGrid,
    iconClass: 'text-sky-600',
    href: 'https://congreso2026.actoreselectorales.com/',
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

function LauncherCard({ item }: { item: LauncherItem }) {
  const Icon = item.icon;
  const disabled = item.comingSoon || !item.href;

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

export function AppLauncherMenu({ appTitle = 'Actores Electorales', onLogout }: AppLauncherMenuProps) {
  const [loggingOut, setLoggingOut] = useState(false);

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

        <div className="max-w-4xl mx-auto w-full flex-1 px-5 sm:px-8 pb-8">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
            role="navigation"
            aria-label="Módulos del proyecto"
          >
            {ITEMS.map((item) => (
              <LauncherCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-auto shrink-0 border-t border-gray-200 bg-white px-4 py-4 text-center text-xs text-gray-500 sm:text-sm">
        Copyright © Data BI - CNE
      </footer>
    </div>
  );
}
