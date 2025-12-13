import React from 'react';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { FaUtensils } from 'react-icons/fa';
import { GiHealthNormal } from 'react-icons/gi';
import { MdRoomService } from 'react-icons/md';
import { RiDrinks2Fill } from 'react-icons/ri';
import { Store } from '@/types/store';

export const createCustomPin = (
  color: string,
  content: React.ReactNode | string,
  isSelected: boolean = false
) => {
  const iconSize = isSelected ? 60 : 46;

  let innerHtml = '';

  if (
    typeof content === 'string' &&
    (content.startsWith('http') || content.startsWith('/') || content.startsWith('data:'))
  ) {
    innerHtml = `<img src="${content}" style="width: ${isSelected ? 30 : 22}px; height: ${
      isSelected ? 30 : 22
    }px; object-fit: contain;" />`;
  } else {
    innerHtml = renderToStaticMarkup(
      <div
        style={{
          color: color,
          fontSize: isSelected ? '28px' : '22px',
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
      <div style="
        position: relative; 
        width: ${iconSize}px; 
        height: ${iconSize}px; 
        filter: drop-shadow(0 3px ${isSelected ? 8 : 3}px rgba(0,0,0,${isSelected ? 0.5 : 0.3}));
        transform-origin: bottom center;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        ${isSelected ? 'transform: scale(1.1); z-index: 9999;' : ''}
      ">
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

export const getCategoryContent = (category: string | undefined) => {
  if (!category) return <FaUtensils className="text-slate-600" />;
  const cat = category.toLowerCase();

  if (cat.includes('drink')) {
    return <RiDrinks2Fill className="text-[#597718]" />;
  }
  if (cat.includes('health')) {
    return <GiHealthNormal className="text-[#EF4444]" />;
  }
  if (cat.includes('service')) {
    return <MdRoomService className="text-[#e68d27]" />;
  }
  return <FaUtensils className="text-[#AF672D]" />;
};

const getCategoryColor = (category: string | undefined) => {
  if (!category) return '#EF4444';
  const cat = category.toLowerCase();
  if (cat.includes('health')) {
    return '#00A300';
  }
  if (cat.includes('service')) {
    return '#0f80e9';
  }
  return '#B4000F';
};

export const getStorePin = (store: Store, isSelected: boolean) => {
  const pinColor = getCategoryColor(store.category);
  const iconContent = getCategoryContent(store.category);
  return createCustomPin(pinColor, iconContent, isSelected);
};

export const getUserPin = () => {
  return L.divIcon({
    className: 'custom-pin-icon',
    html: `
      <div style="
        width: 60px; 
        height: 60px; 
        display: flex; 
        justify-content: center; 
        align-items: flex-end;
      ">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/9356/9356230.png" 
          class="user-marker-bounce" 
          style="width: 100%; height: 100%; object-fit: contain;"
        />
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
  });
};
