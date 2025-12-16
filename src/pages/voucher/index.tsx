import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Page, Box, Text } from 'zmp-ui';
import { useStore } from '@/hooks/useStore';
import CategoryTabs from './CategoryTabs';
import FlashSaleSection from './FlashSaleSection';
import StoreDealList from './StoreDealList';

const PromotionPage: React.FC = () => {
  const { stores, flashSales, fetchNearby, fetchFlashSales } = useStore();
  const [activeTab, setActiveTab] = useState('Tất cả');

  const getCategoryKeyword = (tabName: string) => {
    const lowerTab = tabName.toLowerCase();

    if (lowerTab === 'ẩm thực') return 'food|drink';
    if (lowerTab === 'lưu trú' || lowerTab === 'dịch vụ') return 'service';
    if (lowerTab === 'giải trí') return 'playground';
    if (lowerTab === 'sức khỏe') return 'health';
    if (lowerTab === 'thể thao') return 'sport';
    if (lowerTab === 'tất cả' || lowerTab === 'flash sale') return 'Tất cả';

    return tabName;
  };

  useEffect(() => {
    const apiCategory = getCategoryKeyword(activeTab);
    fetchFlashSales(apiCategory);

    if (stores.length === 0) {
      fetchNearby();
    }
  }, [activeTab]);

  const filteredStores = useMemo(() => {
    if (!stores) return [];
    if (activeTab === 'Tất cả' || activeTab === 'Flash Sale') return stores;

    const keyword = getCategoryKeyword(activeTab);

    return stores.filter(
      (s) => s.category && s.category.toLowerCase().includes(keyword.toLowerCase())
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

      <div className="flex-1 overflow-y-auto no-scrollbar pb-safe scroll-smooth">
        <CategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <FlashSaleSection flashSales={flashSales} />

        <StoreDealList stores={filteredStores} />
      </div>
    </Page>
  );
};

export default PromotionPage;
