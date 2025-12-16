import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Box, Text, Page } from 'zmp-ui';
import { useUserLocation } from '@/hooks/useUserLocation';
import { usePublicStore } from '@/hooks/usePublicStore';
import { Store } from '@/types/store';
import { getStorePin, getUserPin } from './utils/mapHelpers';
import { MapController } from './MapControls';
import MapSearchBar from './MapSearchBar';
import StoreListSection from './StoreListSection';
import MapFilterButton from './MapFilterButton';
import { CATEGORY_LABELS } from '@/constants/categories';
import { FaLocationArrow } from 'react-icons/fa';

const MapFix = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 0);
    setTimeout(() => map.invalidateSize(), 500);
  }, [map]);
  return null;
};

const MapClickHandler = ({ onClick }: { onClick: () => void }) => {
  useMapEvents({ click: onClick });
  return null;
};

const MapViewComponent: React.FC = () => {
  const { position, requestLocationForce, loading: locLoading, isDenied } = useUserLocation();
  const { stores, fetchNearby, selectedStore, setSelectedStore } = usePublicStore();
  const [keyword, setKeyword] = useState('');
  const [targetZoom, setTargetZoom] = useState(16);
  const [locateTrigger, setLocateTrigger] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORY_LABELS.ALL);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    requestLocationForce();
  }, []);

  useEffect(() => {
    if (!position[0] || !position[1]) return;
    const timer = setTimeout(() => {
      if (fetchNearby) fetchNearby({ category: selectedCategory, forceRefresh: true });
    }, 1000);
    return () => clearTimeout(timer);
  }, [position, fetchNearby, selectedCategory]);

  const handleTagClick = (tag: string) => {
    if (selectedCategory === tag) setSelectedCategory(CATEGORY_LABELS.ALL);
    else setSelectedCategory(tag);
  };

  const filteredStores = useMemo(() => {
    if (!stores) return [];
    let result = stores;
    return result;
  }, [stores, keyword, selectedCategory]);

  const handleLocateMe = () => {
    requestLocationForce();
    setLocateTrigger((prev) => prev + 1);
    setSelectedStore(null);
  };

  return (
    <Page className="bg-gray-100 flex flex-col h-screen overflow-y-auto scroll-smooth">
      <Box className="sticky top-0 z-[1000] bg-[#D83231] shadow-md pb-2">
        <Box className="pt-6 pl-4 ">
          <Text className="font-bold text-2xl text-white">Bản đồ</Text>
          <Text className="font-normal text-sm text-white opacity-90">
            voucher ở mọi nơi, tìm kiếm ngay nào !!!
          </Text>
        </Box>
        <div className="px-2">
          <MapSearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            selectedCategory={selectedCategory}
            onTagClick={handleTagClick}
          />
        </div>
      </Box>

      <div className="w-full h-[65svh] relative shrink-0 z-0">
        <MapContainer
          center={position}
          zoom={18}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          dragging={true}
          scrollWheelZoom={false}
        >
          <MapFix />

          <MapClickHandler onClick={() => setShowFilterMenu(false)} />
          <TileLayer url="http://mt0.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}" />

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
                      setShowFilterMenu(false);
                    },
                  }}
                />
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>

        <Box className="absolute right-4 bottom-10 z-[400] flex flex-col items-end">
          <button
            onClick={handleLocateMe}
            className="w-11 h-11 rounded-full shadow-md flex items-center justify-center text-white bg-[#D83231] active:scale-90 transition-transform"
          >
            {locLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent" />
            ) : (
              <FaLocationArrow />
            )}
          </button>

          <MapFilterButton
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            isOpen={showFilterMenu}
            setIsOpen={setShowFilterMenu}
          />
        </Box>
      </div>

      <StoreListSection
        filteredStores={filteredStores}
        selectedStore={selectedStore}
        onSelectStore={setSelectedStore}
      />
    </Page>
  );
};

export default MapViewComponent;
