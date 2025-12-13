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
  locateTrigger,
}: {
  center: [number, number];
  selectedStore: Store | null;
  filteredStores: Store[];
  targetZoom: number;
  keyword: string;
  locateTrigger: number;
}) => {
  const map = useMap();

  // tự động zoom các quán khi tìm kiếm
  useEffect(() => {
    if (keyword && filteredStores.length > 0 && !selectedStore) {
      const validPoints = filteredStores
        .filter((s) => s.lat && s.lng)
        .map((s) => [Number(s.lat), Number(s.lng)] as [number, number]);

      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints);
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 16, duration: 1.5 });
      }
    }
  }, [keyword, filteredStores, map, selectedStore]);

  // di chuyển Map khi chọn quán
  useEffect(() => {
    if (selectedStore && selectedStore.lat && selectedStore.lng) {
      const lat = Number(selectedStore.lat);
      const lng = Number(selectedStore.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], targetZoom, {
          animate: true,
          duration: 1.5,
          easeLinearity: 0.25,
        });
      }
    }
  }, [selectedStore, targetZoom, map]);

  useEffect(() => {
    if (locateTrigger > 0 && center[0] && center[1]) {
      map.flyTo(center, 18, { animate: true, duration: 1.5 });
    }
  }, [locateTrigger, center, map]);

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
