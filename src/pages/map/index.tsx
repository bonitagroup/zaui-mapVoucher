import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Icon, Box, Button, Text, Page, Header } from 'zmp-ui';
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
  const { position, requestLocationForce, loading: locLoading, isDenied } = useUserLocation();
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
        fetchNearby({ category: selectedCategory, forceRefresh: true });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [position, fetchNearby, selectedCategory]);

  useEffect(() => {
    requestLocationForce();
  }, []);

  const handleTagClick = (tag: string) => {
    if (selectedCategory === tag) {
      setSelectedCategory(CATEGORY_LABELS.ALL);
    } else {
      setSelectedCategory(tag);
    }
  };

  const filteredStores = useMemo(() => {
    if (!stores) return [];

    let result = stores;

    if (selectedCategory === CATEGORY_LABELS.FLASH_SALE) {
      result = result.filter(
        (store) => store.vouchers && store.vouchers.some((v: any) => v.type === 'FLASH_SALE')
      );
    } else if (selectedCategory === CATEGORY_LABELS.VOUCHERHOT) {
      result = result.filter((store) => store.vouchers && store.vouchers.length > 0);
    } else if (selectedCategory === CATEGORY_LABELS.FOOD) {
      result = result.filter((store) => {
        const cat = (store.category || '').toLowerCase();
        return cat.includes('food') || cat.includes('drink');
      });
    } else if (selectedCategory !== CATEGORY_LABELS.ALL) {
      const targetCat = selectedCategory.toLowerCase();
      result = result.filter((store) => {
        const storeCat = (store.category || '').toLowerCase();
        if (targetCat === 'thể thao' && storeCat.includes('sport')) return true;
        if (
          targetCat === 'giải trí' &&
          (storeCat.includes('playground') || storeCat.includes('game'))
        )
          return true;
        if (targetCat === 'dịch vụ' && storeCat.includes('service')) return true;
        if (targetCat === 'sức khỏe' && storeCat.includes('health')) return true;

        return storeCat.includes(targetCat);
      });
    }

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
  }, [stores, keyword, selectedCategory]);

  const handleLocateMe = () => {
    requestLocationForce();
    setLocateTrigger((prev) => prev + 1);
    setSelectedStore(null);
  };

  return (
    <Page>
      <Box className="fixed top-0 left-0 w-full z-50">
        <Box className="bg-[#D83231] py-2 shadow-md">
          <Box className="flex flex-col items-start gap-3">
            <Text.Title size="normal" className="font-bold text-white">
              Bản đồ
            </Text.Title>
            <Text.Title size="small" className="font-bold text-white">
              Bản đồ
            </Text.Title>
          </Box>
        </Box>
      </Box>
      <Box className="w-full h-full relative bg-gray-100 flex flex-col">
        <MapSearchBar
          keyword={keyword}
          setKeyword={setKeyword}
          selectedCategory={selectedCategory}
          onTagClick={handleTagClick}
        />

        <Box className="absolute inset-0 z-0">
          {isDenied && (
            <div className="absolute inset-0 z-[3000] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100 shadow-sm animate-bounce">
                <Icon icon="zi-poll-solid" className="text-red-500 text-4xl" />
              </div>

              <Text.Title size="normal" className="font-bold text-gray-800 mb-2">
                Cho phép định vị?
              </Text.Title>

              <Text size="small" className="text-gray-500 mb-6 max-w-[280px]">
                Để tìm quán gần bạn, vui lòng bấm nút bên dưới và chọn <strong>"Cho phép"</strong>{' '}
                khi được hỏi.
              </Text>

              <Button
                onClick={() => requestLocationForce()}
                className="bg-[#D83231] font-bold rounded-full shadow-lg shadow-red-200"
              >
                Cấp quyền truy cập
              </Button>

              <div
                className="mt-6 text-xs text-gray-400 font-medium cursor-pointer underline"
                onClick={() => requestLocationForce()}
              >
                Thử lại
              </div>
            </div>
          )}
          <MapContainer
            center={position}
            zoom={18}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            className="pb-[35vh]"
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
                        setShowFilterMenu(false);
                      },
                    }}
                  />
                );
              })}
            </MarkerClusterGroup>
          </MapContainer>

          <Box className="absolute right-4 top-[120px] z-[999] flex flex-col items-end gap-3 pointer-events-none translate-y-12">
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
          keyword={keyword}
          setTargetZoom={setTargetZoom}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          filteredStores={filteredStores}
        />
      </Box>
    </Page>
  );
};

export default MapViewComponent;
