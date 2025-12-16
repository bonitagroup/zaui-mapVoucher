import React, { useEffect, useState, useMemo } from 'react';
import { Page, Box, Text } from 'zmp-ui';
import { useStore } from '@/hooks/useStore';
import CategoryTabs from './CategoryTabs';
import FlashSaleSection from './FlashSaleSection';
import StoreDealList from './StoreDealList';

const PromotionPage: React.FC = () => {
  const { stores, flashSales, fetchNearby, fetchFlashSales } = useStore();
  const [activeTab, setActiveTab] = useState('Tất cả');

  useEffect(() => {
    fetchFlashSales();
    fetchNearby();
  }, []);

  const filteredStores = useMemo(() => {
    if (!stores) return [];
    if (activeTab === 'Tất cả') return stores;
    return stores.filter(
      (s) =>
        s.category &&
        s.category
          .toLowerCase()
          .includes(
            activeTab === 'Ẩm thực'
              ? 'food'
              : activeTab === 'Dịch vụ'
              ? 'service'
              : activeTab === 'Giải trí'
              ? 'playground'
              : activeTab.toLowerCase()
          )
    );
  }, [stores, activeTab]);

  return (
    <Page className="bg-gray-50 h-screen flex flex-col overflow-hidden">
      <Box className="bg-[#D83231] pt-12 pb-4 px-4 sticky top-0 z-50 shadow-md">
        <Text.Title size="xLarge" className="text-white font-black uppercase">
          Khuyến Mãi
        </Text.Title>
        <Text size="small" className="text-white/90 mt-1 font-medium">
          Nhanh tay, lựa chọn ngay !!!
        </Text>
      </Box>
      {/* Container chính cuộn được */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-safe scroll-smooth">
        {/* 2. Tabs dạng Pills */}
        <CategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 3. Flash Sale */}
        {(activeTab === 'Tất cả' || activeTab === 'Flash Sale') && (
          <FlashSaleSection flashSales={flashSales} />
        )}

        {/* 4. Danh sách quán */}
        <StoreDealList stores={filteredStores} />
      </div>
    </Page>
  );
};

export default PromotionPage;
