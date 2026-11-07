import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { WasteLot, LocationData } from '../types.ts';
import { Language, Translations, TRANSLATIONS } from '../i18n.ts';
import { getCategoryInfo, getCategoryLocalizedName, formatKzt, formatWeight, getDistanceKm, getEstimatedDriveMinutes } from '../utils.ts';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';

interface InteractiveMapProps {
  lots: WasteLot[];
  selectedLot: WasteLot | null;
  onSelectLot: (lot: WasteLot) => void;
  userLocation: LocationData;
  activeRouteLot: WasteLot | null;
  onClearRoute: () => void;
  isPickerMode?: boolean;
  onPickLocation?: (lat: number, lng: number) => void;
  pickedLocation?: { lat: number; lng: number } | null;
  height?: string;
  lang?: Language;
  t?: Translations;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  lots,
  selectedLot,
  onSelectLot,
  userLocation,
  activeRouteLot,
  onClearRoute,
  isPickerMode = false,
  onPickLocation,
  pickedLocation,
  height = '540px',
  lang = 'ru',
  t = TRANSLATIONS.ru,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = activeRouteLot?.location.lat || selectedLot?.location.lat || userLocation.lat || 43.2389;
      const initialLng = activeRouteLot?.location.lng || selectedLot?.location.lng || userLocation.lng || 76.8897;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add user location marker
      const userIcon = L.divIcon({
        className: 'user-pin',
        html: `
          <div style="
            background: #2563eb;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            font-size: 14px;
          ">
            👤
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const userPopupText = lang === 'en' ? '<b>Your Location</b><br>Almaty central hub' : lang === 'kk' ? '<b>Сіздің орналасуыңыз</b><br>Алматы қаласы' : '<b>Ваша локация</b><br>г. Алматы (базовая точка)';
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(userPopupText);

      markersLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Handle map click for picker mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (isPickerMode && onPickLocation) {
        onPickLocation(e.latlng.lat, e.latlng.lng);
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [isPickerMode, onPickLocation]);

  // Update picker marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (pickedLocation) {
      if (pickerMarkerRef.current) {
        pickerMarkerRef.current.setLatLng([pickedLocation.lat, pickedLocation.lng]);
      } else {
        const pickerText = lang === 'en' ? '📍 Lot Location' : lang === 'kk' ? '📍 Лот нүктесі' : '📍 Точка лота';
        const pickerIcon = L.divIcon({
          className: 'picker-pin',
          html: `
            <div style="
              background: #059669;
              color: white;
              padding: 6px 10px;
              border-radius: 20px;
              display: flex;
              align-items: center;
              gap: 4px;
              font-weight: 600;
              font-size: 12px;
              box-shadow: 0 4px 12px rgba(5,150,105,0.4);
              border: 2px solid white;
            ">
              ${pickerText}
            </div>
          `,
          iconSize: [110, 32],
          iconAnchor: [55, 32],
        });

        pickerMarkerRef.current = L.marker([pickedLocation.lat, pickedLocation.lng], {
          icon: pickerIcon,
          draggable: true,
        }).addTo(map);

        pickerMarkerRef.current.on('dragend', (e) => {
          const latlng = (e.target as L.Marker).getLatLng();
          if (onPickLocation) {
            onPickLocation(latlng.lat, latlng.lng);
          }
        });
      }

      map.panTo([pickedLocation.lat, pickedLocation.lng]);
    } else if (pickerMarkerRef.current) {
      map.removeLayer(pickerMarkerRef.current);
      pickerMarkerRef.current = null;
    }
  }, [pickedLocation, onPickLocation, lang]);

  // Update lots markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    lots.forEach((lot) => {
      if (!lot.location?.lat || !lot.location?.lng) return;

      const locCatName = getCategoryLocalizedName(lot.category, lang);
      const isSelected = selectedLot?.id === lot.id;
      const isPaid = lot.paid;

      const markerColor = isPaid ? '#10b981' : lot.type === 'sell' ? '#059669' : '#0284c7';
      const labelText = lot.type === 'sell' ? t.sell : t.buy;

      const customIcon = L.divIcon({
        className: 'lot-pin',
        html: `
          <div style="
            background: ${markerColor};
            color: white;
            border-radius: 8px;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.25);
            border: ${isSelected ? '3px solid #fbbf24' : '2px solid white'};
            white-space: nowrap;
            transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
            transition: transform 0.2s;
          ">
            <span>${locCatName.split('(')[0].trim().split(' ')[0]}</span>
            <span style="opacity: 0.85; font-size: 10px;">${lot.pricePerUnit}₸</span>
          </div>
        `,
        iconSize: [80, 28],
        iconAnchor: [40, 14],
      });

      const marker = L.marker([lot.location.lat, lot.location.lng], { icon: customIcon });

      const detailsBtnText = lang === 'en' ? 'Open lot details' : lang === 'kk' ? 'Лот мәліметтерін ашу' : 'Открыть детали лота';
      const totalBatchLabel = lang === 'en' ? 'Total:' : lang === 'kk' ? 'Барлығы:' : 'Всего:';

      const popupHtml = `
        <div style="min-width: 200px; font-family: inherit;">
          <div style="font-size: 11px; color: #6b7280; margin-bottom: 2px;">
            ${labelText} · ${locCatName}
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 4px;">
            ${lot.title}
          </div>
          <div style="font-size: 12px; color: #047857; font-weight: 600; margin-bottom: 4px;">
            ${formatKzt(lot.pricePerUnit)} / ${lot.unit} · ${totalBatchLabel} ${formatWeight(lot.amount, lot.unit)}
          </div>
          <div style="font-size: 11px; color: #4b5563; margin-bottom: 8px;">
            📍 ${lot.location.address || lot.location.city}
          </div>
          <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">
            👤 ${lot.owner.name} (${lot.owner.phone})
          </div>
          <button id="lot-select-btn-${lot.id}" style="
            width: 100%;
            background: #059669;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
          ">
            ${detailsBtnText}
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`lot-select-btn-${lot.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectLot(lot);
          };
        }
      });

      marker.on('click', () => {
        onSelectLot(lot);
      });

      layer.addLayer(marker);
    });
  }, [lots, selectedLot, onSelectLot, lang, t]);

  // Update Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeLayer = routeLayerRef.current;
    if (!map || !routeLayer) return;

    routeLayer.clearLayers();

    if (activeRouteLot && activeRouteLot.location) {
      const startPoint: [number, number] = [userLocation.lat, userLocation.lng];
      const endPoint: [number, number] = [activeRouteLot.location.lat, activeRouteLot.location.lng];

      const routeLine = L.polyline([startPoint, endPoint], {
        color: '#2563eb',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
      });

      routeLayer.addLayer(routeLine);

      const dist = getDistanceKm(startPoint[0], startPoint[1], endPoint[0], endPoint[1]);
      const eta = getEstimatedDriveMinutes(dist);

      const midLat = (startPoint[0] + endPoint[0]) / 2;
      const midLng = (startPoint[1] + endPoint[1]) / 2;

      const badgeIcon = L.divIcon({
        className: 'route-badge',
        html: `
          <div style="
            background: #1e3a8a;
            color: white;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">
            🚗 ${dist} km (~${eta} ${lang === 'en' ? 'min' : lang === 'kk' ? 'мин' : 'мин'})
          </div>
        `,
        iconSize: [110, 26],
        iconAnchor: [55, 13],
      });

      const badgeMarker = L.marker([midLat, midLng], { icon: badgeIcon });
      routeLayer.addLayer(badgeMarker);

      const bounds = L.latLngBounds([startPoint, endPoint]);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [activeRouteLot, userLocation, lang]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      {/* Map status overlay controls */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-stone-200/80 pointer-events-auto flex items-center gap-2 text-xs font-semibold text-stone-800">
          <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
          <span>{t.mapTitle}: {lots.length} {t.activeLotsCountMap}</span>
        </div>

        {isPickerMode && (
          <div className="bg-emerald-600 text-white px-3.5 py-2 rounded-xl shadow-md pointer-events-auto flex items-center gap-2 text-xs font-medium">
            <MapPin className="w-4 h-4 animate-bounce" />
            <span>{t.clickToPickPoint}</span>
          </div>
        )}
      </div>

      {activeRouteLot && (
        <div className="absolute bottom-4 left-4 right-4 z-[400] bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-stone-200 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-stone-900 truncate">
                {t.routeToLotTitle}: {activeRouteLot.title}
              </div>
              <div className="text-xs text-stone-500 truncate">
                {activeRouteLot.location.address} · {getDistanceKm(userLocation.lat, userLocation.lng, activeRouteLot.location.lat, activeRouteLot.location.lng)} km {t.distanceFromYou}
              </div>
            </div>
          </div>
          <button
            onClick={onClearRoute}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            {t.hideRoute}
          </button>
        </div>
      )}
    </div>
  );
};
