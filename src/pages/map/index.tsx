import React from 'react';
import { Page } from 'zmp-ui';
import MapViewComponent from './MapContainer';
import StoreDetailSheet from '@/components/StoreDetailSheet';
import { useStore } from '@/hooks/useStore';
import { Store } from '@/types/store';

// Component hiển thị từng dòng quán ăn
const RestaurantItem = ({ data }: { data: Store }) => (
  <div className="flex bg-white p-3 rounded-lg shadow-sm mb-2 border-l-4 border-orange-500 active:opacity-70 transition-opacity">
    <div className="flex-1">
      <h4 className="font-bold text-gray-800">{data.name}</h4>
      <p className="text-xs text-gray-500 line-clamp-1">{data.address}</p>
    </div>
    {data.vouchers && data.vouchers[0] && (
      <div className="flex items-center ml-2">
        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
          {data.vouchers[0].discount}
        </span>
      </div>
    )}
  </div>
);

const MapPage: React.FC = () => {
  const { stores, setSelectedStore } = useStore();

  // --- SỬA LỖI TẠI ĐÂY ---
  // Nếu stores là null hoặc undefined -> Dùng mảng rỗng []
  const safeStores = stores || [];

  return (
    <Page className="flex flex-col h-full bg-white">
      {/* Phần 1: Bản đồ */}
      <MapViewComponent />

      {/* Phần 2: List quán ăn bên dưới */}
      <div className="flex-1 bg-gray-50 -mt-4 rounded-t-3xl z-10 relative shadow-inner p-4 overflow-y-auto pb-20">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <h3 className="font-bold text-lg mb-3 text-orange-600">Địa điểm quanh đây</h3>

        {/* Render danh sách an toàn */}
        {safeStores.length > 0 ? (
          safeStores.map((store) => (
            <div key={store.id} onClick={() => setSelectedStore(store)}>
              <RestaurantItem data={store} />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-10">
            <p>Đang tìm quán...</p>
            <p className="text-xs">(Hoặc chưa có quán nào quanh đây)</p>
          </div>
        )}
      </div>

      <StoreDetailSheet />
    </Page>
  );
};

export default MapPage;
