import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Icon, Box } from 'zmp-ui';
import { useUserLocation } from '@/hooks/useUserLocation';
import { usePublicStore } from '@/hooks/usePublicStore';
import { Store } from '@/types/store';
import { getStorePin } from './utils/mapHelpers';
import { MapController, ResizeMapListener } from './MapControls';
import MapSearchBar from './MapSearchBar';
import StoreBottomSheet from './StoreBottomSheet';
import MapFilterButton from './MapFilterButton';
import { getUserPin } from './utils/mapHelpers';
import { CATEGORY_LABELS } from '@/constants/categories';

const MapClickHandler = ({ onClick }: { onClick: () => void }) => {
  useMapEvents({
    click: () => {
      onClick();
    },
  });
  return null;
};

const MapViewComponent: React.FC = () => {
  const { position, refreshLocation, loading: locLoading } = useUserLocation();
  const { stores, fetchNearby, selectedStore, setSelectedStore } = usePublicStore();

  const [keyword, setKeyword] = useState('');
  const [targetZoom, setTargetZoom] = useState(16);
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);

  const [locateTrigger, setLocateTrigger] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORY_LABELS.ALL);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    if (!position[0] || !position[1]) return;
    const timer = setTimeout(() => {
      if (fetchNearby) {
        fetchNearby({ category: selectedCategory });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [position, fetchNearby, selectedCategory]);

  const filteredStores = useMemo(() => {
    if (!stores) return [];
    let result = stores;
    if (keyword.trim()) {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerKeyword) ||
          (s.category && s.category.toLowerCase().includes(lowerKeyword)) ||
          (s.vouchers && s.vouchers.some((v: any) => v.title.toLowerCase().includes(lowerKeyword)))
      );
    }
    return result;
  }, [stores, keyword]);

  const handleLocateMe = () => {
    refreshLocation();
    setLocateTrigger((prev) => prev + 1);

    setSelectedStore(null);
  };

  return (
    <Box className="w-full h-full relative bg-gray-100 flex flex-col">
      <MapSearchBar keyword={keyword} setKeyword={setKeyword} />

      <Box className="absolute inset-0 z-0">
        <MapContainer
          center={position}
          zoom={18}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <MapClickHandler onClick={() => setShowFilterMenu(false)} />

          <TileLayer url="http://mt0.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}" />
          <ResizeMapListener isSheetCollapsed={isSheetCollapsed} />

          <MapController
            center={position}
            selectedStore={selectedStore}
            filteredStores={filteredStores}
            targetZoom={targetZoom}
            keyword={keyword}
            locateTrigger={locateTrigger}
          />

          <Marker position={position} zIndexOffset={10000} icon={getUserPin()} />

          <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} maxClusterRadius={10}>
            {filteredStores.map((store: Store) => {
              if (!store.lat || !store.lng) return null;

              const isSelected = selectedStore?.id === store.id;

              return (
                <Marker
                  key={store.id}
                  position={[store.lat, store.lng]}
                  icon={getStorePin(store, isSelected)}
                  zIndexOffset={isSelected ? 1000 : 0}
                  eventHandlers={{
                    click: () => {
                      setTargetZoom(18);
                      setSelectedStore(store);
                      setIsSheetCollapsed(false);
                      setShowFilterMenu(false);
                    },
                  }}
                />
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>

        <Box className="absolute right-4 bottom-1/2 z-[999] flex flex-col items-end gap-3 pointer-events-none translate-y-12">
          <button
            onClick={handleLocateMe}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 active:scale-90 transition-transform pointer-events-auto"
          >
            {locLoading ? (
              <div className="w-6 h-6 border-2 border-red-500 border-t-transparent animate-spin rounded-full"></div>
            ) : (
              <Icon icon="zi-location-solid" />
            )}
          </button>

          <MapFilterButton
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            isOpen={showFilterMenu}
            setIsOpen={setShowFilterMenu}
          />
        </Box>
      </Box>

      <StoreBottomSheet
        isSheetCollapsed={isSheetCollapsed}
        setIsSheetCollapsed={setIsSheetCollapsed}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        keyword={keyword}
        filteredStores={filteredStores}
        setTargetZoom={setTargetZoom}
      />
    </Box>
  );
};

export default MapViewComponent;
