// FILE: src/pages/home/index.tsx
import React, { useEffect, useState } from 'react';
import { Page, Input, Box, Text } from 'zmp-ui';
import { useStore } from '@/hooks/useStore';
import { useNavigate } from 'react-router-dom';
import WelcomeHeader from './WelcomeHeader';
import StoreDetailSheet from '@/components/StoreDetailSheet';
import { Store } from '@/types/store';

const HomePage: React.FC = () => {
  const { search, stores, setSelectedStore, loading, fetchNearby } = useStore();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const safeStores = Array.isArray(stores) ? stores : [];

  // Logic 1: Tìm kiếm ngay khi nhấn Enter hoặc icon kính lúp
  const handleSearch = (text: string) => {
    if (text.trim()) {
      search(text);
    } else {
      fetchNearby();
    }
  };

  // Logic 2: Debounce (Tự động tìm sau khi ngừng gõ 500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Chỉ gọi search nếu keyword khác rỗng,
      // nếu rỗng thì useEffect này không làm gì cả (để tránh conflict với fetchNearby ban đầu)
      if (keyword.trim()) {
        search(keyword);
      } else if (keyword === '') {
        // Khi xoá hết chữ thì load lại quán gần đây
        fetchNearby();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, search, fetchNearby]);

  return (
    <Page className="bg-gray-100 h-full pb-20">
      <WelcomeHeader />

      <Box p={4} className="-mt-[80px] relative z-10">
        <Input.Search
          placeholder="Bạn muốn ăn gì hôm nay?"
          className="bg-white rounded-full h-12 border-none"
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={(val) => handleSearch(val)}
          clearable
        />
      </Box>

      <Box px={4} mt={1}>
        <div className="flex justify-between items-end pt-6 mb-3 pb-2">
          <Text.Title size="normal" className="font-bold">
            {keyword ? `Kết quả cho "${keyword}"` : 'Gợi ý quanh đây'}
          </Text.Title>
          <span
            className="text-xs text-orange-600 font-bold bg-orange-100 px-6 py-1 rounded-full active:opacity-70"
            onClick={() => navigate('/map')}
          >
            Xem bản đồ &rarr;
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-10 space-y-2">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400 text-xs">Đang tìm quán ngon...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {safeStores.length > 0 ? (
              safeStores.map((store: Store) => (
                <div
                  key={store.id}
                  className="bg-white p-3 rounded-xl shadow-sm active:opacity-70 flex flex-col h-full border border-gray-100"
                  onClick={() => setSelectedStore(store)}
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
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-400 mt-10 italic">
                <div className="text-4xl mb-2">🤔</div>
                <p>Không tìm thấy quán nào.</p>
                <p className="text-xs">Thử tìm từ khoá khác xem sao!</p>
              </div>
            )}
          </div>
        )}
      </Box>

      <StoreDetailSheet />
    </Page>
  );
};

export default HomePage;
