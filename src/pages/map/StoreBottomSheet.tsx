import React, { useState, useEffect } from 'react';
import { Box, Icon, Button, Text as ZText } from 'zmp-ui'; // Đã thêm ZText
import { Store } from '@/types/store';
import { useNavigate } from 'react-router-dom';
import { FaDirections, FaStar, FaRegClock } from 'react-icons/fa';

interface StoreBottomSheetProps {
  isSheetCollapsed: boolean;
  setIsSheetCollapsed: (val: boolean) => void;
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;
  keyword: string;
  filteredStores: Store[];
  setTargetZoom: (zoom: number) => void;
}

const StoreBottomSheet: React.FC<StoreBottomSheetProps> = ({
  selectedStore,
  setSelectedStore,
  filteredStores,
  setTargetZoom,
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (selectedStore) {
      setIsVisible(true);
    }
  }, [selectedStore]);

  const StoreCard = ({ store }: { store: Store }) => {
    // 1. KHAI BÁO BIẾN hasFlashSale
    const hasFlashSale = store.vouchers?.some((v: any) => v.type === 'FLASH_SALE');

    return (
      <div
        className="bg-white rounded-2xl p-4 mb-5 shadow-xl border border-gray-100 flex flex-col h-max w-[55vw] max-w-[300px] shrink-0 snap-center relative"
        onClick={() => {
          setTargetZoom(18);
          setSelectedStore(store);
        }}
      >
        <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 group shrink-0">
          <img
            src={store.image || 'https://via.placeholder.com/400x200'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt={store.name}
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200')}
          />

          <Box className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
            {hasFlashSale && (
              <ZText className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <Icon icon="zi-poll" size={10} /> Flash Sale
              </ZText>
            )}
            {store.vouchers && store.vouchers.length > 0 && !hasFlashSale && (
              <ZText className="bg-white/95 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100 shadow-sm">
                {store.vouchers.length} voucher
              </ZText>
            )}
          </Box>
          {selectedStore?.id === store.id && (
            <div className="absolute inset-0 border-2 border-[#D83231] rounded-xl pointer-events-none z-20"></div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="font-extrabold text-base text-gray-900 line-clamp-1 mb-1">{store.name}</h3>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-xs font-bold text-gray-800">4.8</span>
            </div>
            <span className="text-gray-300 text-xs">|</span>
            <span className="text-xs text-gray-500 line-clamp-1 flex-1">
              0 đánh giá • {store.distance ? `${store.distance.toFixed(1)}km` : '25m'}
            </span>
          </div>

          <div className="text-xs text-gray-500 line-clamp-1 mb-3">{store.address}</div>

          <div className="mt-auto flex items-center gap-2">
            <Button
              className="flex-1 bg-[#d83231] hover:bg-[#d12323] active:bg-[#a81b1b] text-white font-bold rounded-lg h-9 text-xs shadow-md shadow-pink-100 border-none"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/store/${store.id}`);
              }}
            >
              Xem chi tiết
            </Button>

            <div
              className="w-9 h-9 flex items-center justify-center border border-red-100 bg-red-50 rounded-lg text-[#ea4c62] active:scale-95 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Chỉ đường...');
              }}
            >
              <FaDirections size={16} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`fixed left-4 z-[999] transition-all duration-300 ${
          isVisible ? 'bottom-[370px]' : 'bottom-[60px]'
        }`}
      >
        <button
          onClick={() => setIsVisible(!isVisible)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full shadow-lg font-bold text-sm transition-all border border-gray-100
            ${
              isVisible
                ? 'bg-white text-gray-700 hover:bg-gray-50'
                : 'bg-[#ea4c62] text-white hover:bg-[#d43f54]'
            }
          `}
        >
          <Icon icon={isVisible ? 'zi-chevron-down' : 'zi-chevron-up'} size={18} />
          <span>{isVisible ? 'Ẩn' : 'Hiện'}</span>
        </button>
      </div>

      <Box
        className={`
          fixed bottom-0 left-0 right-0 z-[1000] pb-safe
          transition-transform duration-300 ease-in-out
          ${isVisible ? 'translate-y-0' : 'translate-y-[120%]'}
        `}
      >
        <div className="flex overflow-x-auto gap-3 px-4 pb-6 pt-2 snap-x scrollbar-hide">
          {filteredStores.length === 0 ? (
            <div className="w-full bg-white rounded-xl p-4 text-center shadow-lg mx-auto border border-gray-100">
              <span className="text-gray-500 text-sm">Không tìm thấy quán nào ở khu vực này</span>
            </div>
          ) : (
            filteredStores.map((store) => <StoreCard key={store.id} store={store} />)
          )}

          <div className="w-2 shrink-0"></div>
        </div>
      </Box>
    </>
  );
};

export default StoreBottomSheet;
