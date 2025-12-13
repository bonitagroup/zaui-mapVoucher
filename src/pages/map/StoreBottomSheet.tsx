import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Icon } from 'zmp-ui';
import { Store } from '@/types/store';
import StoreCard from '@/components/map/StoreCard';

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
  const [isVisible, setIsVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedStore) {
      setIsVisible(true);
      setTimeout(() => {
        const cardId = `store-card-${selectedStore.id}`;
        const element = document.getElementById(cardId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }
      }, 300);
    }
  }, [selectedStore]);

  const handleSelectStore = useCallback(
    (store: Store) => {
      setTargetZoom(18);
      setSelectedStore(store);
    },
    [setTargetZoom, setSelectedStore]
  );

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
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 px-4 pb-6 pt-2 snap-x scrollbar-hide"
        >
          {filteredStores.length === 0 ? (
            <div className="w-full bg-white rounded-xl p-4 pb-16 text-center shadow-lg mx-auto border border-gray-100">
              <span className="text-gray-500 text-sm">Không tìm thấy quán nào ở khu vực này</span>
            </div>
          ) : (
            filteredStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                isSelected={selectedStore?.id === store.id}
                onSelect={handleSelectStore}
              />
            ))
          )}
          <div className="w-2 shrink-0">&nbsp;</div>
        </div>
      </Box>
    </>
  );
};

export default React.memo(StoreBottomSheet);
