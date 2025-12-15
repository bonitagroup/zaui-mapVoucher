import React, { useEffect, useState } from 'react';
import { Page, Header, Box, Text, Button, Icon, useSnackbar } from 'zmp-ui';
import { useParams } from 'react-router-dom';
import api from '@/services/api';
import { useStore } from '@/hooks/useStore';
import { FaDirections } from 'react-icons/fa';

const StoreDetailPage: React.FC = () => {
  const { id } = useParams(); // Lấy ID quán từ URL
  const { saveVoucher, myVouchers } = useStore();
  const { openSnackbar } = useSnackbar();

  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách ID voucher đã lưu để check trạng thái nút bấm
  const savedVoucherIds = new Set(myVouchers.map((v: any) => v.voucher_id));

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Gọi API lấy chi tiết quán (Backend đã có hàm getStoreDetail)
        const res: any = await api.get(`/api/store/detail/${id}`);
        if (res && res.data) {
          setStore(res.data);
        }
      } catch (error) {
        console.error('Lỗi lấy chi tiết quán:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const handleSave = (voucherId: number) => {
    saveVoucher(voucherId);
    openSnackbar({ text: 'Đã lưu vào ví!', type: 'success' });
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="w-8 h-8 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );

  if (!store) return <div className="text-center mt-20">Không tìm thấy quán</div>;
  const openMap = () => {
    const lat = store.lat;
    const lng = store.lng;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    window.location.href = url;
  };

  return (
    <Page className="bg-white pb-20 relative">
      {/* Header trong suốt đè lên ảnh */}
      <Header
        title="Chi tiết quán"
        showBackIcon
        className="absolute top-0 left-0 right-0 z-50 bg-transparent text-white shadow-none"
        style={{ background: 'transparent' }}
        textColor="white"
      />

      {/* Ảnh bìa */}
      <div className="relative h-60 w-full">
        <img
          src={store.image || 'https://via.placeholder.com/400x200'}
          className="w-full h-full object-cover"
          alt={store.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <Text.Title size="large" className="font-bold mb-1">
            {store.name}
          </Text.Title>
          <div className="flex items-center gap-1 text-sm opacity-90">
            <Icon icon="zi-location-solid" size={16} />
            <span className="line-clamp-1">{store.address}</span>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <Box p={4} className="-mt-4 bg-white rounded-t-2xl relative z-10 min-h-screen">
        <div className="flex gap-4 mb-6 border-b border-gray-100 pb-4">
          <div className="flex-1 text-center">
            <div className="font-bold text-lg">4.8 ⭐</div>
            <div className="text-xs text-gray-500">Đánh giá</div>
          </div>
          <div className="w-[1px] bg-gray-200"></div>
          <div className="flex-1 text-center">
            <div className="font-bold text-lg text-green-600">Đang mở</div>
            <div className="text-xs text-gray-500">07:00 - 22:00</div>
          </div>

        </div>

        <div className="flex justify-between items-center mb-4">

          <Text.Title size="normal" className="font-bold uppercase">
            Voucher ưu đãi ({store.vouchers?.length || 0})
          </Text.Title>

          <div className="">
            <button
              onClick={openMap}
              className="
                flex items-center gap-2
                bg-green-600 active:bg-green-700
                text-white font-bold
                px-4 py-2 rounded-full
                shadow-lg
              "
            >
              <FaDirections size={18} />
              Đường đi
            </button>
          </div>
        </div>


        <div className="space-y-4">
          {store.vouchers &&
            store.vouchers.map((v: any) => {
              const isSaved = savedVoucherIds.has(v.id);
              return (
                <div
                  key={v.id}
                  className="border border-orange-100 bg-orange-50/30 rounded-xl p-3 flex justify-between items-center relative overflow-hidden"
                >
                  {/* Trang trí */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>

                  <div className="flex-1 pl-3">
                    <Text className="font-bold text-gray-800">{v.title}</Text>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-white border border-gray-200 text-xs px-2 py-0.5 rounded text-gray-500 font-mono">
                        {v.code}
                      </span>
                      <span className="text-orange-600 font-bold text-xs">Giảm {v.discount}</span>
                    </div>
                  </div>

                  <Button
                    size="small"
                    className={`h-8 min-w-[80px] text-xs font-bold shadow-none ${
                      isSaved ? 'bg-gray-200 text-gray-500' : 'bg-orange-500 text-white'
                    }`}
                    disabled={isSaved}
                    onClick={() => !isSaved && handleSave(v.id)}
                  >
                    {isSaved ? 'Đã lưu' : 'Lưu'}
                  </Button>
                </div>
              );
            })}

          {(!store.vouchers || store.vouchers.length === 0) && (
            <div className="text-center text-gray-400 italic py-4">Chưa có voucher nào</div>
          )}
        </div>
      </Box>
    </Page>
  );
};

export default StoreDetailPage;
