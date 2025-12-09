import { Text, Icon, Page } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useUserLocation } from '@/hooks/useUserLocation';

const userIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/9356/9356230.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const defaultStoreIcon = L.divIcon({
  className: 'custom-pin-icon',
  html: `<div style="background-color: #FF5722; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const NearbyMapCard = () => {
  const navigate = useNavigate();
  const { stores } = useStore();
  const { position } = useUserLocation();

  const count = Array.isArray(stores) ? stores.length : 0;

  const mapCenter: [number, number] =
    position[0] && position[1] ? position : [21.597631, 105.840984];

  return (
    <div className="bg-white mb-2 px-4 pb-4 pt-2">
      <div className="flex justify-between items-end mb-3">
        <Text.Title size="normal" className="font-extrabold text-gray-800 uppercase tracking-tight">
          BẢN ĐỒ GẦN ĐÂY
        </Text.Title>
      </div>

      <div className="relative h-48 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <MapContainer
          key={`${mapCenter[0]}-${mapCenter[1]}`}
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false} // Tắt nút zoom +/-
          dragging={false} // Tắt kéo thả
          scrollWheelZoom={false} // Tắt cuộn chuột
          doubleClickZoom={false} // Tắt double click
          touchZoom={false} // Tắt zoom bằng 2 ngón tay
          attributionControl={false} // Ẩn dòng copyright cho gọn
        >
          <TileLayer url="http://mt0.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}" />

          {position[0] && position[1] && <Marker position={position} icon={userIcon} />}

          {stores &&
            stores.map((store) => {
              if (!store.lat || !store.lng) return null;
              return (
                <Marker key={store.id} position={[store.lat, store.lng]} icon={defaultStoreIcon} />
              );
            })}
        </MapContainer>

        <div
          className="absolute inset-0 z-[1000] bg-black/5 active:bg-black/10 transition-colors cursor-pointer flex items-end justify-center pb-2"
          onClick={() => navigate('/map')}
        >
          <div className="bg-white/90  backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center gap-1 text-xs text-gray-700 font-medium">
            <Icon icon="zi-location-solid" className="text-red-500" size={14} />
            Tìm thấy <span className="font-bold">{count}</span> địa điểm
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate('/map')}
        className="w-full py-3 mt-5 rounded-xl border border-[#D83231] text-[#D83231] font-bold text-sm bg-white active:bg-red-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <Icon icon="zi-location-solid" size={20} />
        Mở bản đồ đầy đủ
      </button>
    </div>
  );
};

export default NearbyMapCard;
