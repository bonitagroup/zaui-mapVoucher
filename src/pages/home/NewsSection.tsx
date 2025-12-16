import React from 'react';
import { Text, Button } from 'zmp-ui';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { categoryState, newsState } from '@/state';

const NewsSection = () => {
  const navigate = useNavigate();
  const [news] = useAtom(newsState);
  const [categories] = useAtom(categoryState);

  return (
    <div className="bg-white p-4 pt-4 pb-4 rounded-2xl m-2 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <Text.Title size="normal" className="font-extrabold text-gray-800 uppercase tracking-tight">
          TIN TỨC NỔI BẬT
        </Text.Title>
        <Text
          size="small"
          className="text-[#D83231] font-medium cursor-pointer active:opacity-60 hover:underline"
          onClick={() => navigate('/news')}
        >
          Xem tất cả
        </Text>
      </div>

      <div className="flex flex-col gap-4">
        {news.length > 0 ? (
          news.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="border border-red-500 rounded-2xl p-2.5 shadow-sm bg-white"
              onClick={() => navigate(`/news/${item.id}`)}
            >
              <div className="h-44 w-full rounded-xl overflow-hidden mb-3 relative bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200')}
                />
              </div>

              <Text.Title
                size="normal"
                className="font-extrabold text-gray-900 leading-tight mb-3 line-clamp-2 px-1"
              >
                {item.title}
              </Text.Title>

              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-4">
                  <Text className="text-[#D83231] font-bold text-sm">{categories.find(d => d.id === item.categoryId)?.name}</Text>

                  <div className="flex items-center gap-1 text-gray-500 text-sm font-medium">
                    <FaEye size={14} />
                    <span>{item.views}</span>
                  </div>
                </div>

                <Button
                onClick={() => navigate(`/news/${item.id}`)}
                  size="small"
                  className="bg-[#D83231] text-white font-bold h-8 rounded-full px-5 shadow-lg shadow-red-100 border-none"
                >
                  Xem ngay
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm py-4 text-center">Chưa có tin tức mới</div>
        )}
      </div>
    </div>
  );
};

export default NewsSection;
