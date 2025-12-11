import React from 'react';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { FaUtensils } from 'react-icons/fa';
import { GiHealthNormal } from 'react-icons/gi';
import { MdRoomService } from 'react-icons/md';
import { RiDrinks2Fill } from 'react-icons/ri';

import { Store } from '@/types/store';

export const createCustomPin = (color: string, content: React.ReactNode | string) => {
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

export const getCategoryContent = (category: string | undefined) => {
  if (!category) return <FaUtensils className="text-slate-600" />;

  const cat = category.toLowerCase();

  if (
    cat.includes('drink') ||
    cat.includes('coffee') ||
    cat.includes('cà phê') ||
    cat.includes('tea') ||
    cat.includes('trà') ||
    cat.includes('milktea')
  ) {
    return <RiDrinks2Fill className="text-[#597718]" />;
  }

  if (
    cat.includes('health') ||
    cat.includes('spa') ||
    cat.includes('massage') ||
    cat.includes('dental') ||
    cat.includes('nha khoa') ||
    cat.includes('sức khỏe') ||
    cat.includes('thẩm mỹ')
  ) {
    return <GiHealthNormal className="text-[#EF4444]" />;
  }

  if (
    cat.includes('service') ||
    cat.includes('hotel') ||
    cat.includes('motel') ||
    cat.includes('khách sạn') ||
    cat.includes('nhà nghỉ') ||
    cat.includes('dịch vụ')
  ) {
    return <MdRoomService className="text-[#e68d27]" />;
  }

  return <FaUtensils className="text-[#AF672D]" />;
};

const getCategoryColor = (category: string | undefined) => {
  if (!category) return '#EF4444';

  const cat = category.toLowerCase();

  if (
    cat.includes('health') ||
    cat.includes('spa') ||
    cat.includes('massage') ||
    cat.includes('dental') ||
    cat.includes('nha khoa') ||
    cat.includes('sức khỏe') ||
    cat.includes('thẩm mỹ')
  ) {
    return '#00A300';
  }

  if (
    cat.includes('service') ||
    cat.includes('hotel') ||
    cat.includes('motel') ||
    cat.includes('khách sạn') ||
    cat.includes('nhà nghỉ') ||
    cat.includes('dịch vụ')
  ) {
    return '#0f80e9';
  }

  return '#B4000F';
};

export const getStorePin = (store: Store) => {
  const pinColor = getCategoryColor(store.category);

  const iconContent = getCategoryContent(store.category);

  return createCustomPin(pinColor, iconContent);
};
