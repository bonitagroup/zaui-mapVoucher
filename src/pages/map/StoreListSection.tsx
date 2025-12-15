import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Box, Text, Sheet, List, Icon } from 'zmp-ui';
import { Store } from '@/types/store';
import StoreListItem from '@/components/map/StoreListItem';
import { MdOutlineFilterList } from 'react-icons/md';
import { CATEGORY_LABELS } from '@/constants/categories';

interface StoreListSectionProps {
  filteredStores: Store[];
  selectedStore: Store | null;
  onSelectStore: (store: Store | null) => void;
}

const FILTER_OPTIONS = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Ăn uống', value: 'food|drink' },
  { label: 'Dịch vụ', value: 'service' },
  { label: 'Giải trí', value: 'playground' },
  { label: 'Sức khỏe', value: 'health' },
];

const StoreListSection: React.FC<StoreListSectionProps> = ({
  filteredStores,
  selectedStore,
  onSelectStore,
}) => {
  const hotListRef = useRef<HTMLDivElement>(null);
  const otherListRef = useRef<HTMLDivElement>(null);

  const [hotFilter, setHotFilter] = useState('ALL');
  const [nearbyFilter, setNearbyFilter] = useState('ALL');

  const [activeSheet, setActiveSheet] = useState<'HOT' | 'NEARBY' | null>(null);

  const rawHotStores = useMemo(() => {
    return filteredStores;
  }, [filteredStores]);

  const rawOtherStores = useMemo(() => {
    return filteredStores;
  }, [filteredStores]);

  const applyFilter = (stores: Store[], filterType: string) => {
    if (filterType === 'ALL') return stores;
    return stores.filter((store) => {
      const cat = (store.category || '').toLowerCase();
      if (filterType.includes('|')) {
        const types = filterType.split('|');
        return types.some((t) => cat.includes(t));
      }
      return cat.includes(filterType);
    });
  };

  const displayHotStores = useMemo(() => {
    return applyFilter(rawHotStores, hotFilter);
  }, [rawHotStores, hotFilter]);

  const displayNearbyStores = useMemo(() => {
    return applyFilter(rawOtherStores, nearbyFilter);
  }, [rawOtherStores, nearbyFilter]);

  useEffect(() => {
    if (!selectedStore) return;
    const handleScrollToTop = (container: HTMLDivElement | null, storeId: number) => {
      if (!container) return;
      const element = container.querySelector(`#store-item-${storeId}`) as HTMLElement;
      if (element) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const offset = elementRect.top - containerRect.top;
        container.scrollTo({ top: container.scrollTop + offset, behavior: 'smooth' });
      }
    };

    const isHot = displayHotStores.find((s) => s.id === selectedStore.id);
    if (isHot) {
      handleScrollToTop(hotListRef.current, selectedStore.id);
    } else {
      handleScrollToTop(otherListRef.current, selectedStore.id);
    }
  }, [selectedStore, displayHotStores, displayNearbyStores]);

  const handleSelectFilter = (value: string) => {
    if (activeSheet === 'HOT') {
      setHotFilter(value);
    } else if (activeSheet === 'NEARBY') {
      setNearbyFilter(value);
    }
    setActiveSheet(null);
  };

  return (
    <div className="bg-gray-100 rounded-t-3xl min-h-screen relative z-10 -mt-6 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
      <div className="px-1 pb-safe pt-2">
        {rawHotStores.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between flex-col bg-white px-4 py-1 rounded-xl shadow-sm items-center mb-3">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full opacity-50 mt-2"></div>

              <div className="flex flex-row items-center justify-between w-full py-1 mb-2">
                <Text className="font-bold text-gray-700 uppercase text-lg">VOUCHERS HOT</Text>

                <Box
                  onClick={() => setActiveSheet('HOT')}
                  className={`flex flex-row gap-1 text-sm border rounded-full px-3 py-1 cursor-pointer active:opacity-60 transition-colors ${
                    hotFilter !== 'ALL'
                      ? 'bg-red-50 border-red-500 text-red-500'
                      : 'border-red-300 text-red-500'
                  }`}
                >
                  <Text className="items-center font-medium">
                    {hotFilter === 'ALL'
                      ? 'Lọc'
                      : FILTER_OPTIONS.find((f) => f.value === hotFilter)?.label}
                  </Text>
                  <MdOutlineFilterList className="text-2xl" />
                </Box>
              </div>

              <div
                ref={hotListRef}
                className="flex flex-col gap-3 w-full max-h-[400px] overflow-y-auto scroll-smooth pr-1 custom-scrollbar relative"
              >
                {displayHotStores.length > 0 ? (
                  displayHotStores.map((store) => (
                    <div key={store.id}>
                      <StoreListItem
                        store={store}
                        onSelect={onSelectStore}
                        isSelected={selectedStore?.id === store.id}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm">Không có kết quả lọc</div>
                )}
              </div>
            </div>
          </div>
        )}

        {rawOtherStores.length > 0 && (
          <div className="mb-20">
            <div className="flex justify-between flex-col bg-white px-4 py-2 rounded-xl shadow-sm items-center mb-3">
              <div className="flex flex-row items-center justify-between w-full py-2 mb-2">
                <div className="flex flex-row items-center justify-between w-full py-1">
                  <Text className="font-bold text-gray-700 uppercase text-base">
                    KHÁM PHÁ QUANH ĐÂY
                  </Text>

                  <Box
                    onClick={() => setActiveSheet('NEARBY')}
                    className={`flex flex-row gap-1 text-sm border rounded-full px-3 py-1 cursor-pointer active:opacity-60 transition-colors ${
                      nearbyFilter !== 'ALL'
                        ? 'bg-red-50 border-red-500 text-red-500'
                        : 'border-red-300 text-red-500'
                    }`}
                  >
                    <Text className="items-center font-medium">
                      {nearbyFilter === 'ALL'
                        ? 'Lọc'
                        : FILTER_OPTIONS.find((f) => f.value === nearbyFilter)?.label}
                    </Text>
                    <MdOutlineFilterList className="text-2xl" />
                  </Box>
                </div>
              </div>

              <div
                ref={otherListRef}
                className="flex flex-col gap-3 w-full max-h-[650px] overflow-y-auto scroll-smooth pr-1 custom-scrollbar relative"
              >
                {displayNearbyStores.length > 0 ? (
                  displayNearbyStores.map((store) => (
                    <div key={store.id}>
                      <StoreListItem
                        store={store}
                        onSelect={onSelectStore}
                        isSelected={selectedStore?.id === store.id}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm">Không có kết quả lọc</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Sheet
        visible={!!activeSheet}
        onClose={() => setActiveSheet(null)}
        autoHeight
        mask
        handler
        swipeToClose
        title="Chọn danh mục hiển thị"
      >
        <div className="p-4 flex flex-col gap-2 pb-20">
          {FILTER_OPTIONS.map((opt) => {
            const isActive =
              activeSheet === 'HOT' ? hotFilter === opt.value : nearbyFilter === opt.value;

            return (
              <div
                key={opt.value}
                onClick={() => handleSelectFilter(opt.value)}
                className={`p-3  rounded-xl border flex justify-between items-center cursor-pointer ${
                  isActive
                    ? 'bg-red-50 border-red-500 text-red-600'
                    : 'border-gray-100 text-gray-700'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {isActive && <Icon icon="zi-check" className="text-red-600" />}
              </div>
            );
          })}
        </div>
      </Sheet>
    </div>
  );
};

export default React.memo(StoreListSection);
