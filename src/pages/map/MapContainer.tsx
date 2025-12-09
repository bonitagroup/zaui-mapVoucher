import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Input, Icon, Text as ZText, Button, Box } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';

import { useUserLocation } from '@/hooks/useUserLocation';
import { useStore } from '@/hooks/useStore';
import { Store } from '@/types/store';

import { GiCampCookingPot, GiNoodles, GiCoffeeCup, GiTeapot } from 'react-icons/gi';
import { FaBowlRice } from 'react-icons/fa6';
import { IoFastFoodOutline } from 'react-icons/io5';
import bbq from '@/static/grill.png';

const createCustomPin = (color: string, content: React.ReactNode | string) => {
  const iconSize = 46;
  let innerHtml = '';
  if (
    typeof content === 'string' &&
    (content.startsWith('http') || content.startsWith('/') || content.startsWith('data:'))
  ) {
    innerHtml = `<img src="${content}" style="width: 22px; height: 22px; object-fit: contain;" />`;
  } else {
    innerHtml = renderToStaticMarkup(
      <div
        style={{
          color: color,
          fontSize: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    );
  }
  const pinSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="${iconSize}" height="${iconSize}">
      <path fill="${color}" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
      <circle cx="200" cy="192" r="150" fill="white" />
    </svg>
  `;
  return L.divIcon({
    className: 'custom-pin-icon',
    html: `
      <div style="position: relative; width: ${iconSize}px; height: ${iconSize}px; filter: drop-shadow(0 3px 3px rgba(0,0,0,0.3));">
        ${pinSvg}
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 75%; display: flex; align-items: center; justify-content: center;">
          ${innerHtml}
        </div>
      </div>
    `,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize],
    popupAnchor: [0, -iconSize + 10],
  });
};

const getCategoryContent = (category: string | undefined) => {
  if (!category) return <IoFastFoodOutline className="text-slate-600" />;
  const cat = category.toLowerCase();
  if (cat.includes('lẩu') || cat.includes('hotpot'))
    return <GiCampCookingPot className="text-slate-600" />;
  if (cat.includes('nướng') || cat.includes('bbq')) return bbq;
  if (cat.includes('cơm') || cat.includes('rice')) return <FaBowlRice className="text-slate-600" />;
  if (cat.includes('bún') || cat.includes('phở') || cat.includes('mì'))
    return <GiNoodles className="text-slate-600" />;
  if (cat.includes('fastfood') || cat.includes('gà rán') || cat.includes('pizza'))
    return <IoFastFoodOutline className="text-slate-600" />;
  if (cat.includes('trà sữa') || cat.includes('milktea'))
    return 'https://cdn-icons-png.flaticon.com/512/3081/3081162.png';
  if (cat.includes('cà phê') || cat.includes('coffee'))
    return <GiCoffeeCup className="text-slate-600" />;
  if (cat.includes('trà') || cat.includes('tea')) return <GiTeapot className="text-slate-600" />;
  if (cat.includes('vặt') || cat.includes('snack'))
    return 'https://cdn-icons-png.flaticon.com/512/2515/2515183.png';
  return <IoFastFoodOutline className="text-slate-600" />;
};

const getStorePin = (store: Store) => {
  const hasFlashSale = store.vouchers?.some((v: any) => v.type === 'FLASH_SALE');
  const hasVoucher = store.vouchers && store.vouchers.length > 0;
  let pinColor = '#607D8B';
  if (hasFlashSale) pinColor = '#F97316';
  else if (hasVoucher) pinColor = '#EF4444';
  const iconContent = getCategoryContent(store.category);
  return createCustomPin(pinColor, iconContent);
};

const MapController = ({ center, selectedStore, filteredStores, targetZoom, keyword }: any) => {
  const map = useMap();

  useEffect(() => {
    if (keyword && filteredStores.length > 0 && !selectedStore) {
      const validPoints = filteredStores.filter((s: any) => s.lat && s.lng);
      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints.map((s: any) => [s.lat, s.lng]));
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

const MapViewComponent: React.FC = () => {
  const { position, refreshLocation, loading: locLoading } = useUserLocation();
  const { stores, fetchNearby, selectedStore, setSelectedStore } = useStore();
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const [targetZoom, setTargetZoom] = useState(16);

  useEffect(() => {
    if (position[0] && position[1]) {
      if (fetchNearby) fetchNearby();
    }
  }, [position, fetchNearby]);

  const filteredStores = useMemo(() => {
    if (!stores) return [];
    if (!keyword.trim()) return stores;
    const lowerKeyword = keyword.toLowerCase();
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerKeyword) ||
        (s.category && s.category.toLowerCase().includes(lowerKeyword)) ||
        (s.vouchers && s.vouchers.some((v: any) => v.title.toLowerCase().includes(lowerKeyword)))
    );
  }, [stores, keyword]);

  return (
    <Box className="w-full h-full relative bg-gray-100 flex flex-col">
      <style>{`.custom-pin-icon { background: none; border: none; }`}</style>

      <Box className="absolute top-0 left-0 right-0 z-[1000] p-4 flex flex-col gap-3 pointer-events-none">
        <Box className="bg-white rounded-xl shadow-md pointer-events-auto flex items-center pr-2">
          <Input.Search
            placeholder="Tìm món lẩu, nướng..."
            className="border-none h-11 flex-1"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            clearable
          />
        </Box>
        <Box className="flex gap-2 pointer-events-auto overflow-x-auto scrollbar-hide">
          <Box className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-gray-100">
            <Box className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></Box>
            <ZText size="xSmall" className="font-bold text-gray-700">
              Flash Sale
            </ZText>
          </Box>
          <Box className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-gray-100">
            <Box className="w-2.5 h-2.5 rounded-full bg-red-500"></Box>
            <ZText size="xSmall" className="font-bold text-gray-700">
              Có Voucher
            </ZText>
          </Box>
        </Box>
      </Box>

      <Box className="flex-1 relative z-0">
        <MapContainer
          center={position}
          zoom={18}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer url="http://mt0.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}" />

          <MapController
            center={position}
            selectedStore={selectedStore}
            filteredStores={filteredStores}
            targetZoom={targetZoom}
            keyword={keyword}
          />

          <Marker
            position={position}
            icon={L.icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/9356/9356230.png',
              iconSize: [40, 40],
              iconAnchor: [20, 40],
            })}
          />

          <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} maxClusterRadius={20}>
            {filteredStores.map((store: Store) => {
              if (!store.lat || !store.lng) return null;
              return (
                <Marker
                  key={store.id}
                  position={[store.lat, store.lng]}
                  icon={getStorePin(store)}
                  eventHandlers={{
                    click: () => {
                      setTargetZoom(18);
                      setSelectedStore(store);
                    },
                  }}
                />
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>

        <Box className="absolute right-4 bottom-64 z-[999]">
          <button
            onClick={refreshLocation}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 active:scale-90 transition-transform"
          >
            {locLoading ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent animate-spin rounded-full"></div>
            ) : (
              <Icon icon="zi-location-solid" />
            )}
          </button>
        </Box>
      </Box>

      <Box className="bg-white rounded-t-3xl shadow-[0_-5px_10px_rgba(0,0,0,0.05)] z-[1000] relative -mt-4 pb-safe max-h-[45vh] flex flex-col">
        <Box className="w-full flex justify-center pt-3 pb-1">
          <Box className="w-10 h-1 bg-gray-200 rounded-full"></Box>
        </Box>

        <Box className="px-4 py-2 flex justify-between items-end">
          <ZText.Title className="font-bold text-gray-800">
            {selectedStore
              ? 'ĐANG CHỌN 1 QUÁN'
              : keyword
              ? `KẾT QUẢ (${filteredStores.length})`
              : `GẦN ĐÂY (${filteredStores.length})`}
          </ZText.Title>
          {selectedStore && (
            <ZText
              size="small"
              className="text-blue-500 font-bold"
              onClick={() => setSelectedStore(null)}
            >
              Thoát
            </ZText>
          )}
        </Box>

        <Box className="overflow-y-auto flex-1 px-4 pb-4">
          {selectedStore ? (
            <Box
              className="flex gap-3 py-3 border border-orange-200 bg-orange-50 rounded-xl px-3"
              onClick={() => navigate(`/store/${selectedStore.id}`)}
            >
              <img
                src={selectedStore.image || 'https://via.placeholder.com/80'}
                className="w-20 h-20 rounded-xl object-cover bg-gray-100 shrink-0"
              />
              <Box className="flex-1 min-w-0 flex flex-col justify-between">
                <ZText className="font-bold text-gray-800 line-clamp-1">{selectedStore.name}</ZText>
                <ZText className="text-xs text-gray-500 line-clamp-2">
                  {selectedStore.address}
                </ZText>
                <Box className="flex justify-end mt-2">
                  <Button size="small" className="h-7 text-xs bg-[#D83231] text-white px-4">
                    Xem chi tiết
                  </Button>
                </Box>
              </Box>
            </Box>
          ) : (
            <>
              {filteredStores.length === 0 && (
                <Box className="text-center py-8">
                  <ZText className="text-gray-400">Không tìm thấy quán nào</ZText>
                </Box>
              )}
              {filteredStores.map((store) => {
                const hasFlashSale = store.vouchers?.some((v: any) => v.type === 'FLASH_SALE');
                return (
                  <Box
                    key={store.id}
                    className="flex gap-3 py-3 border-b border-gray-50 active:bg-gray-50 transition-colors"
                    onClick={() => {
                      setTargetZoom(18);
                      setSelectedStore(store);
                    }}
                  >
                    <img
                      src={store.image || 'https://via.placeholder.com/80'}
                      className="w-20 h-20 rounded-xl object-cover bg-gray-100 shrink-0"
                    />
                    <Box className="flex-1 min-w-0 flex flex-col justify-between">
                      <Box>
                        <ZText className="font-bold text-gray-800 line-clamp-1">{store.name}</ZText>
                        <Box className="mt-1 flex flex-wrap gap-1">
                          {hasFlashSale && (
                            <ZText className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              ⚡ Flash Sale
                            </ZText>
                          )}
                          {store.vouchers && store.vouchers.length > 0 && !hasFlashSale && (
                            <ZText className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
                              {store.vouchers.length} voucher
                            </ZText>
                          )}
                        </Box>
                      </Box>
                      <Box className="flex justify-between items-end mt-1">
                        <ZText className="text-gray-500 text-xs">
                          {store.distance ? `${store.distance.toFixed(1)}km` : 'Gần đây'}
                        </ZText>
                        <Button
                          size="small"
                          className="h-7 text-xs bg-[#D83231] text-white px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/store/${store.id}`);
                          }}
                        >
                          Chi tiết
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MapViewComponent;
