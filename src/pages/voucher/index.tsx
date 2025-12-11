import React, { useEffect, useState, useMemo } from 'react';
import { Page, Box, Header } from 'zmp-ui';
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
    return stores.filter((s) => s.category?.toLowerCase().includes(activeTab.toLowerCase()));
  }, [stores, activeTab]);

  return (
    <Page className="bg-gray-100 h-full">
      <Header title="Khuyến mãi" showBackIcon />
      <Box className="h-20 bg-gray-100" />

      <CategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="overflow-y-auto h-full pb-safe">
        {activeTab === 'Tất cả' || activeTab === 'Flash Sale' ? (
          <FlashSaleSection flashSales={flashSales} />
        ) : null}

        <StoreDealList stores={filteredStores} />
      </div>
    </Page>
  );
};

export default PromotionPage;
