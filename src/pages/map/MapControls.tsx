import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Store } from '@/types/store';

export const MapController = ({
  center,
  selectedStore,
  filteredStores,
  targetZoom,
  keyword,
}: {
  center: [number, number];
  selectedStore: Store | null;
  filteredStores: Store[];
  targetZoom: number;
  keyword: string;
}) => {
  const map = useMap();

  useEffect(() => {
    if (keyword && filteredStores.length > 0 && !selectedStore) {
      const validPoints = filteredStores.filter((s) => s.lat && s.lng);
      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints.map((s) => [s.lat, s.lng]));
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 16, duration: 1.5 });
      }
    }
  }, [keyword, filteredStores, map, selectedStore]);

  useEffect(() => {
    if (selectedStore && selectedStore.lat && selectedStore.lng) {
      map.flyTo([selectedStore.lat, selectedStore.lng], targetZoom, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [selectedStore, targetZoom, map]);

  useEffect(() => {
    if (!selectedStore && !keyword && center[0] && center[1]) {
      map.flyTo(center, 16, { animate: true, duration: 1.5 });
    }
  }, [center]);

  return null;
};

export const ResizeMapListener = ({ isSheetCollapsed }: { isSheetCollapsed: boolean }) => {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 310);

    return () => clearTimeout(timer);
  }, [isSheetCollapsed, map]);

  return null;
};
