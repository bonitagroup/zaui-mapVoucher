import React, { useEffect, useState, useRef } from 'react';
import { Page, Input, Box, Text, Icon } from 'zmp-ui';
import { usePublicStore } from '@/hooks/usePublicStore';
import { useNavigate } from 'react-router-dom';
import WelcomeHeader from './WelcomeHeader';
import TrendingList from './TrendingList';
import FlashSaleList from './FlashSaleList';
import { Store } from '@/types/store';
import { useUserLocation } from '@/hooks/useUserLocation';
import NewsSection from './NewsSection';
import CategoryQuickAccess from './CategoryQuickAccess';

import { useRecoilState } from 'recoil';
import { lastFetchedLocationState } from '@/states/state';
import { calculateDistance } from '@/utils/location';

const HomePage: React.FC = () => {
  const { search, stores, loading, fetchNearby, fetchFlashSales } = usePublicStore();
  const navigate = useNavigate();

  const { position, checkLocationSilent } = useUserLocation();
  const [keyword, setKeyword] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  const [lastFetched, setLastFetched] = useRecoilState(lastFetchedLocationState);

  const isFetchingRef = useRef(false);
  const isFirstRenderSearch = useRef(true);

  const safeStores = Array.isArray(stores) ? stores : [];

  const handleSearch = (text: string) => {
    setKeyword(text);
  };

  const exitSearchMode = () => {
    setIsSearchFocused(false);
    setKeyword('');
    if (position && position[0]) {
      fetchNearby({
        lat: position[0],
        lng: position[1],
        category: selectedCategory,
        forceRefresh: true,
      });
    }
  };

  const handleStoreClick = (store: Store) => {
    navigate(`/store/${store.id}`);
  };

  const handleSelectCategory = (catValue: string) => {
    setSelectedCategory(catValue);
    if (position && position[0] && position[1]) {
      fetchNearby({
        lat: position[0],
        lng: position[1],
        category: catValue,
        forceRefresh: true,
      });
      fetchFlashSales(catValue);
      setLastFetched([position[0], position[1]]);
    }
  };

  useEffect(() => {
    checkLocationSilent();
  }, []);

  useEffect(() => {
    if (position && position[0] && position[1]) {
      if (isFetchingRef.current) return;

      const hasData = stores && stores.length > 0;
      const isDefaultCategory = selectedCategory === 'Tất cả';

      let shouldRefetch = true;
      if (hasData && isDefaultCategory && lastFetched) {
        const dist = calculateDistance(position[0], position[1], lastFetched[0], lastFetched[1]);
        if (dist < 0.1) {
          shouldRefetch = false;
        }
      }

      if (!shouldRefetch) return;

      isFetchingRef.current = true;

      const fetchData = async () => {
        try {
          await fetchNearby({
            lat: position[0],
            lng: position[1],
            category: selectedCategory,
          });
          fetchFlashSales(selectedCategory);

          setLastFetched([position[0], position[1]]);
        } finally {
          setTimeout(() => {
            isFetchingRef.current = false;
          }, 500);
        }
      };

      fetchData();
    }
  }, [position[0], position[1], selectedCategory]);

  useEffect(() => {
    if (isFirstRenderSearch.current) {
      isFirstRenderSearch.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (keyword.trim()) {
        search(keyword);
      } else if (keyword === '') {
        if (!isSearchFocused && position[0]) {
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [keyword, isSearchFocused]);

  return (
    <Page className="bg-gray-100 h-full pb-20 relative">
      <WelcomeHeader />

      <CategoryQuickAccess onSelect={handleSelectCategory} activeCategory={selectedCategory} />

      <Box className="pt-2 pb-2 mx-2 relative z-10">
        <div
          onClick={() => setIsSearchFocused(true)}
          className="bg-white rounded-full h-12 flex items-center px-4 shadow-sm border border-gray-300 active:scale-95 transition-transform"
        >
          <Icon icon="zi-search" className="text-red-600 mr-2" />
          <Text className="text-gray-400 text-sm flex-1">Tìm kiếm theo yêu cầu...</Text>
        </div>
      </Box>

      <div className="bg-white pb-2 pt-4 rounded-2xl m-2 shadow-sm border border-gray-100">
        <TrendingList stores={safeStores.slice(0, 5)} loading={loading} />
      </div>

      <div className="bg-white pb-2 pt-4 rounded-2xl m-2 shadow-sm border border-gray-100">
        <FlashSaleList />
      </div>

      <NewsSection />

      {isSearchFocused && (
        <div className="fixed inset-0 bg-gray-50 z-[9999] flex flex-col animate-[fadeIn_0.2s_ease-in-out]">
          <div className="px-4 pt-8 pb-4 flex items-center border-b bg-[#D83231] border-gray-50">
            <div
              onClick={exitSearchMode}
              className="w-8 h-8 flex items-center justify-center -ml-2 mr-2 rounded-full active:bg-gray-100 transition-colors cursor-pointer"
            >
              <Icon icon="zi-chevron-left-header" className="text-white text-xl" />
            </div>
            <Text.Title size="normal" className="font-bold text-white pl-3">
              Tìm kiếm
            </Text.Title>
          </div>

          <div className="bg-white p-4 flex items-center gap-3 shadow-sm pt-safe-top">
            <div className="flex-1">
              <Input.Search
                placeholder="Nhập tên quán, món ăn..."
                className="bg-gray-100 rounded-full h-10 border-none"
                value={keyword}
                onChange={(e) => handleSearch(e.target.value)}
                clearable
                autoFocus
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {!loading && safeStores.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {safeStores.map((store: Store) => (
                  <div
                    key={store.id}
                    className="bg-white p-3 rounded-xl shadow-sm active:opacity-70 flex flex-col h-full border border-gray-100"
                    onClick={() => handleStoreClick(store)}
                  >
                    <img
                      src={store.image || 'https://via.placeholder.com/150'}
                      className="h-24 w-full object-cover rounded-lg mb-2 bg-gray-100"
                      alt={store.name}
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                    />
                    <Text className="font-bold line-clamp-1 text-gray-800">{store.name}</Text>
                    <Text size="xxSmall" className="text-gray-500 line-clamp-1 mb-2">
                      {store.address}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Page>
  );
};

export default HomePage;
