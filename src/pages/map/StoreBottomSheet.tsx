import React, { useState, useRef, useEffect } from 'react';
import { Box, Text, Icon } from 'zmp-ui';
import { Store } from '@/types/store';
import StoreListItem from '@/components/map/StoreListItem';

interface StoreBottomSheetProps {
  filteredStores: Store[];
  selectedStore: Store | null;
  isSheetCollapsed?: boolean;
  setIsSheetCollapsed?: (val: boolean) => void;
  setSelectedStore?: (store: Store | null) => void;
  keyword?: string;
  setTargetZoom?: (zoom: number) => void;
}

const StoreBottomSheet: React.FC<StoreBottomSheetProps> = ({ filteredStores, selectedStore }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const startY = useRef<number>(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedStore) {
      const element = document.getElementById(`store-item-${selectedStore.id}`);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        element.classList.add('ring-2', 'ring-red-500');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-red-500');
        }, 15000);
      }
    }
  }, [selectedStore]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const diff = startY.current - endY;
    if (diff > 50) setIsExpanded(true);
    else if (diff < -50) setIsExpanded(false);
  };

  const hotStores = filteredStores.slice(0, 3);
  const otherStores = filteredStores.slice(3);

  return (
    <div
      ref={sheetRef}
      className={`fixed left-0 right-0 bottom-0 bg-white rounded-t-[24px] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-[1000] transition-all duration-500 ease-in-out flex flex-col ${
        isExpanded ? 'h-[85vh]' : 'h-[35vh]'
      }`}
    >
      <div
        className="w-full pt-3 pb-1 flex justify-center cursor-pointer flex-shrink-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
      </div>

      <div className="px-4 pb-2 flex justify-between items-center flex-shrink-0 border-b border-transparent">
        <Text.Title size="normal" className="font-extrabold text-gray-800 uppercase">
          {filteredStores.length} Địa điểm gần bạn
        </Text.Title>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-gray-500 text-sm active:opacity-60"
        >
          {isExpanded ? 'Thu gọn' : 'Xem thêm'}
          <Icon icon={isExpanded ? 'zi-chevron-down' : 'zi-chevron-up'} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-safe pt-2 bg-gray-50 scroll-smooth">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <Text className="font-bold text-gray-700 uppercase text-sm">VOUCHER HOT</Text>
          </div>
          <div className="flex flex-col gap-3">
            {hotStores.map((store) => (
              <StoreListItem key={store.id} store={store} />
            ))}
          </div>
        </div>
        {otherStores.length > 0 && (
          <div className="mb-20">
            <div className="flex justify-between items-center mb-3">
              <Text className="font-bold text-gray-700 uppercase text-sm">CÓ THỂ BẠN QUAN TÂM</Text>
            </div>
            <div className="flex flex-col gap-3">
              {otherStores.map((store) => (
                <StoreListItem key={store.id} store={store} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(StoreBottomSheet);
