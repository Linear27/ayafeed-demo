
import React, { useEffect, useRef, useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { Map as MapIcon, HelpCircle } from 'lucide-react';

const MapContainer: React.FC<{ lng: number; lat: number }> = ({ lng, lat }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once
    let isDisposed = false;

    const initMap = async () => {
      try {
        const { default: maplibregl } = await import('maplibre-gl');
        if (isDisposed || !mapContainer.current || map.current) return;

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: 'https://tiles.openfreemap.org/styles/liberty',
          center: [lng, lat],
          zoom: 14,
          attributionControl: false
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        new maplibregl.Marker({ color: '#DC2626' }).setLngLat([lng, lat]).addTo(map.current); // Red marker for AyaFeed theme

        map.current.on('error', () => {
          setError(true);
        });
      } catch (e) {
        console.warn("Map initialization failed", e);
        if (!isDisposed) setError(true);
      }
    };
    initMap();

    return () => {
      isDisposed = true;
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
          // Ignore removal errors during unmount
        }
        map.current = null;
      }
    };
  }, [lng, lat]);

  if (error) {
     return (
        <div className="w-full h-full bg-[var(--paper-bg-secondary)]/50 flex flex-col items-center justify-center p-8 text-center border-2 border-[var(--paper-border)] relative overflow-hidden">
           {/* Cross-out aesthetic for newspaper */}
           <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
              <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_45%,var(--paper-border)_45%,var(--paper-border)_55%,transparent_55%),linear-gradient(-45deg,transparent_45%,var(--paper-border)_45%,var(--paper-border)_55%,transparent_55%)] bg-[length:20px_20px]"></div>
           </div>
           
           <div className="relative z-10 flex flex-col items-center">
               <div className="w-16 h-16 border-4 border-[var(--paper-border)]/10 rounded-full flex items-center justify-center mb-4">
                  <MapIcon size={32} className="text-[var(--paper-border)]/10" />
               </div>
               <p className="text-xs font-black font-header text-[var(--paper-text-muted)]/40 uppercase tracking-[0.3em] mb-1">Navigation Unavailable</p>
               <p className="text-[10px] font-mono font-bold text-[var(--paper-text-muted)]/30">CHECK EXTERNAL LINKS FOR ROUTING</p>
           </div>
           
           <div className="absolute bottom-2 right-2 opacity-5 text-[var(--paper-text-muted)]">
              <HelpCircle size={64}/>
           </div>
        </div>
     );
  }

  return (
    <div className="relative w-full h-full">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default MapContainer;
