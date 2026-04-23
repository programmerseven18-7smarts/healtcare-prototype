'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import type { DisplayMode } from './display-mode-toggle';
import { DisplayModeProvider } from './display-mode-context';
import { getDisplayModeFromPathname, withDisplayMode } from '@/lib/display-mode-route';

interface AppShellProps {
  title: string;
  children: React.ReactNode;
}

export function AppShell({ title, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileFrameScale, setMobileFrameScale] = useState(1);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const displayMode: DisplayMode = getDisplayModeFromPathname(pathname);
  const usePhoneLayout = displayMode === 'mobile' && isCompactViewport;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const syncViewport = () => setIsCompactViewport(mediaQuery.matches);
    syncViewport();

    mediaQuery.addEventListener('change', syncViewport);
    return () => mediaQuery.removeEventListener('change', syncViewport);
  }, []);

  useEffect(() => {
    if (isCompactViewport && displayMode === 'desktop') {
      router.replace(withDisplayMode(pathname, 'mobile'));
    }
  }, [displayMode, isCompactViewport, pathname, router]);

  useEffect(() => {
    if (displayMode !== 'mobile' || isCompactViewport) return;

    const baseDpr = window.devicePixelRatio || 1;
    const frameWidth = 393;
    const frameHeight = 852;
    const stagePaddingX = 48;
    const stagePaddingY = 120;

    const updateScale = () => {
      const vv = window.visualViewport;
      const viewportWidth = vv?.width ?? window.innerWidth;
      const viewportHeight = vv?.height ?? window.innerHeight;
      const currentDpr = window.devicePixelRatio || 1;
      const zoomFactor = currentDpr / baseDpr;

      const widthFit = (viewportWidth - stagePaddingX) / frameWidth;
      const heightFit = (viewportHeight - stagePaddingY) / frameHeight;
      const fitScale = Math.min(widthFit, heightFit);
      const inverseZoom = 1 / zoomFactor;
      const nextScale = Math.max(0.58, Math.min(1.12, fitScale * inverseZoom));

      setMobileFrameScale(nextScale);
    };

    updateScale();

    window.addEventListener('resize', updateScale);
    window.visualViewport?.addEventListener('resize', updateScale);
    window.visualViewport?.addEventListener('scroll', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
      window.visualViewport?.removeEventListener('resize', updateScale);
      window.visualViewport?.removeEventListener('scroll', updateScale);
    };
  }, [displayMode, isCompactViewport]);

  const handleDisplayModeChange = (mode: DisplayMode) => {
    if (mode === 'mobile') {
      setSidebarOpen(false);
    }
    router.push(withDisplayMode(pathname, mode));
  };

  return (
    <DisplayModeProvider displayMode={displayMode}>
      <div className="flex h-screen overflow-hidden bg-[var(--bg-page)]">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          variant={displayMode === 'desktop' ? 'responsive' : 'drawer'}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            title={title}
            displayMode={displayMode}
            onDisplayModeChange={handleDisplayModeChange}
          />
          <main
            className={`flex-1 overflow-y-auto ${
              displayMode === 'desktop' || usePhoneLayout
                ? 'p-4 lg:p-6'
                : 'bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_100%)] px-3 py-4 sm:px-5 sm:py-6'
            }`}
          >
            {displayMode === 'desktop' || usePhoneLayout ? (
              children
            ) : (
              <div className="mx-auto flex min-h-full w-full items-center justify-center overflow-hidden">
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: `${393 * mobileFrameScale}px`,
                    height: `${852 * mobileFrameScale}px`,
                  }}
                >
                  <div
                    className="absolute left-1/2 top-0 w-[393px] -translate-x-1/2 overflow-hidden rounded-[3.5rem] border-[8px] border-slate-800 bg-[linear-gradient(180deg,#fbfdff_0%,#ffffff_35%,#f7fbff_100%)] p-3 shadow-[0_28px_90px_rgba(15,23,42,0.22)] ring-1 ring-white/60"
                    style={{
                      transform: `translateX(-50%) scale(${mobileFrameScale})`,
                      transformOrigin: 'top center',
                    }}
                  >
                    <div className="pointer-events-none absolute inset-x-6 top-4 h-24 rounded-[2.25rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),rgba(255,255,255,0))]" />
                    <div className="mx-auto mb-3 h-8 w-34 rounded-b-[1.45rem] bg-slate-800" />
                    <div className="h-[812px] overflow-y-auto overflow-x-hidden rounded-[2.7rem] bg-white px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <div className="min-w-0 overflow-x-hidden">
                        {children}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </DisplayModeProvider>
  );
}
