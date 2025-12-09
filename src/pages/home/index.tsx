import React, { useEffect, useState } from 'react';
import { Page, Input, Box, Text, Icon } from 'zmp-ui';
import { useStore } from '@/hooks/useStore';
import { useNavigate } from 'react-router-dom';
import WelcomeHeader from './WelcomeHeader';
import TrendingList from './TrendingList';
import FlashSaleList from './FlashSaleList';
import NearbyMapCard from './NearbyMapCard';
import { Store } from '@/types/store';

const HomePage: React.FC = () => {
  const { search, stores, loading, fetchNearby } = useStore();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const safeStores = Array.isArray(stores) ? stores : [];

  const handleSearch = (text: string) => {
    setKeyword(text);
  };

  const exitSearchMode = () => {
    setIsSearchFocused(false);
    setKeyword('');
    fetchNearby();
  };

  const handleStoreClick = (store: Store) => {
    navigate(`/store/${store.id}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword.trim()) {
        search(keyword);
      } else if (keyword === '') {
        if (!isSearchFocused) fetchNearby();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, search, fetchNearby, isSearchFocused]);

  return (
    <Page className="bg-gray-100 h-full pb-20 relative">
      <WelcomeHeader />

      <Box p={4} className="-mt-[80px] relative z-10">
        <div
          onClick={() => setIsSearchFocused(true)}
          className="bg-white rounded-full h-12 flex items-center px-4 shadow-sm border border-gray-100 active:scale-95 transition-transform"
        >
          <Icon icon="zi-search" className="text-gray-500 mr-2" />
          <Text className="text-gray-400 text-sm flex-1">Bạn muốn ăn gì hôm nay?</Text>
        </div>
      </Box>
      <div className="bg-white pb-2 pt-4 rounded-2xl m-2 shadow-sm border border-gray-100">
        <TrendingList stores={safeStores.slice(0, 5)} loading={loading} />
      </div>

      <div className="bg-white pb-2 pt-4 rounded-2xl m-2 shadow-sm border border-gray-100">
        <FlashSaleList />
      </div>

      <div className="bg-white pb-2 pt-4 rounded-2xl m-2 shadow-sm border border-gray-100">
        <NearbyMapCard />
      </div>

      <div className="bg-white p-4 pb-2 pt-4 rounded-2xl m-2 shadow-sm border border-gray-100">
        <Text.Title size="normal" className="font-extrabold text-gray-800 uppercase tracking-tight">
          Tin tức nổi bật
        </Text.Title>
      </div>

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
            <Text.Title size="small" className="text-gray-500 mb-3 uppercase font-bold text-xs">
              {keyword ? `Kết quả cho "${keyword}"` : 'Nhập từ khoá để tìm kiếm'}
            </Text.Title>

            {loading && (
              <div className="flex flex-col items-center justify-center mt-10 space-y-2">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-400 text-xs">Đang tìm kiếm...</span>
              </div>
            )}

            {!loading && safeStores.length === 0 && (
              <div className="text-center text-gray-400 mt-10 italic">
                <div className="text-4xl mb-2">🤔</div>
                <p>Không tìm thấy quán nào.</p>
              </div>
            )}

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

                    <div className="mt-auto flex gap-1 overflow-hidden">
                      {store.vouchers && store.vouchers.length > 0 ? (
                        <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100 whitespace-nowrap font-medium">
                          Giảm {store.vouchers[0].discount}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                          Chưa có mã
                        </span>
                      )}
                    </div>
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
