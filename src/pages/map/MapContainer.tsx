import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

import { GiCampCookingPot, GiNoodles, GiCoffeeCup, GiTeapot } from 'react-icons/gi';
import { FaBowlRice } from 'react-icons/fa6';
import { IoFastFoodOutline } from 'react-icons/io5';

import { useUserLocation } from '@/hooks/useUserLocation';
import { useStore } from '@/hooks/useStore';
import { Icon } from 'zmp-ui';
import { Store } from '@/types/store';
import bbq from '@/static/grill.png';

const createCustomPin = (color: string, content: React.ReactNode | string) => {
  const iconSize = 46;

  let innerHtml = '';
  if (typeof content === 'string' && (content.startsWith('http') || content.startsWith('/'))) {
    innerHtml = `<img src="${content}" style="width: 22px; height: 22px; object-fit: contain;" />`;
  } else {
    innerHtml = renderToStaticMarkup(
      <div style={{ color: color, fontSize: '22px', display: 'flex' }}>{content}</div>
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

const PIN_COLORS = {
  FOOD: '#FF5722',
  DRINK: '#009688',
  SNACK: '#9C27B0',
  COFFEE: '#795548',
  DEFAULT: '#607D8B',
};

const Icons = {
  User: L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9356/9356230.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  }),

  Hotpot: createCustomPin(PIN_COLORS.FOOD, <GiCampCookingPot className="text-slate-600" />), // Lẩu
  BBQ: createCustomPin(PIN_COLORS.FOOD, bbq), // Nướng (Dùng ảnh ngoài)
  Rice: createCustomPin(PIN_COLORS.FOOD, <FaBowlRice className="text-slate-600" />), // Cơm
  Noodles: createCustomPin(PIN_COLORS.FOOD, <GiNoodles className="text-slate-600" />), // Bún/Phở
  FastFood: createCustomPin(PIN_COLORS.FOOD, <IoFastFoodOutline className="text-slate-600" />), // Đồ ăn nhanh

  MilkTea: createCustomPin(
    PIN_COLORS.DRINK,
    'https://cdn-icons-png.flaticon.com/512/3081/3081162.png'
  ),
  Tea: createCustomPin(PIN_COLORS.DRINK, <GiTeapot className="text-slate-600" />), // Trà
  Coffee: createCustomPin(PIN_COLORS.COFFEE, <GiCoffeeCup className="text-slate-600" />), // Cafe

  Snack: createCustomPin(
    PIN_COLORS.SNACK,
    'https://cdn-icons-png.flaticon.com/512/2515/2515183.png'
  ),
  Default: createCustomPin(PIN_COLORS.DEFAULT, <IoFastFoodOutline className="text-slate-600" />),
};

const getStoreIcon = (category: string | undefined) => {
  if (!category) return Icons.Default;
  const cat = category.toLowerCase();

  if (cat.includes('lẩu') || cat.includes('hotpot')) return Icons.Hotpot;
  if (cat.includes('nướng') || cat.includes('bbq')) return Icons.BBQ;
  if (cat.includes('cơm') || cat.includes('rice')) return Icons.Rice;
  if (cat.includes('bún') || cat.includes('phở') || cat.includes('mì')) return Icons.Noodles;
  if (cat.includes('fastfood') || cat.includes('gà rán') || cat.includes('pizza'))
    return Icons.FastFood;

  if (cat.includes('trà sữa') || cat.includes('milktea')) return Icons.MilkTea;
  if (cat.includes('cà phê') || cat.includes('coffee')) return Icons.Coffee;
  if (cat.includes('trà') || cat.includes('tea')) return Icons.Tea;

  if (cat.includes('vặt') || cat.includes('snack')) return Icons.Snack;

  return Icons.Default;
};

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.flyTo(center, 14, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

const MapViewComponent: React.FC = () => {
  const { position, refreshLocation, loading: locLoading } = useUserLocation();
  const { stores, fetchNearby, setSelectedStore } = useStore();

  useEffect(() => {
    if (position[0] && position[1]) {
      if (fetchNearby) fetchNearby();
    }
  }, [position, fetchNearby]);

  return (
    <div className="w-full h-[60vh] z-0 relative bg-gray-100">
      <style>
        {`
          .custom-pin-icon { background: none; border: none; }
          .loader {
            border: 2px solid #f3f3f3; border-top: 2px solid #fff;
            border-radius: 50%; width: 16px; height: 16px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}
      </style>

      <div className="absolute bottom-4 right-4 z-[9999]">
        <button
          onClick={refreshLocation}
          disabled={locLoading}
          className="bg-orange-500 hover:bg-orange-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all"
        >
          {locLoading ? (
            <div className="loader"></div>
          ) : (
            <Icon icon="zi-location-solid" size={24} />
          )}
        </button>
      </div>

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
        />
        <MapUpdater center={position} />

        <Marker position={position} icon={Icons.User}>
          <Popup>📍 Bạn đang ở đây</Popup>
        </Marker>

        {stores &&
          stores.map((store: Store) => {
            if (!store.lat || !store.lng) return null;
            return (
              <Marker
                key={store.id}
                position={[store.lat, store.lng]}
                icon={getStoreIcon(store.category)}
                eventHandlers={{
                  click: () => setSelectedStore(store),
                }}
              />
            );
          })}
      </MapContainer>
    </div>
  );
};

export default MapViewComponent;
