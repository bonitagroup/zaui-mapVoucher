import React, { useEffect, useState } from 'react';
import { Page, Button, Text, Icon } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleContinue = () => {
    navigate('/home');
  };

  const BRAND_COLOR = '#D83231';

  return (
    <Page className="relative flex flex-col h-screen bg-white overflow-y-auto">
      <div className="relative flex-shrink-0 h-[50vh] w-full flex flex-col pb-20 justify-center z-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dzpyhq3z5/image/upload/v1765443946/Ảnh_chụp_màn_hình_2025-12-11_160519_snnauc.png"
            className="w-full h-full object-cover opacity-50"
            alt="Bản đồ Thái Nguyên"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/50 to-white"></div>
        </div>

        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className={`absolute top-[20%] left-[15%] text-red-500 transform transition-all duration-1000 delay-300 ${
              visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
          >
            <div className="animate-[bounce_3s_infinite]">
              <Icon icon="zi-location-solid" size={32} className="drop-shadow-md" />
            </div>
            <div className="w-6 h-1.5 bg-black/10 rounded-full blur-[1px] mx-auto animate-pulse mt-1"></div>
          </div>

          <div
            className={`absolute top-[30%] right-[15%] transform transition-all duration-1000 delay-500 ${
              visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
          >
            <div className="relative animate-[bounce_4s_infinite]">
              <div className="w-12 h-12 bg-white p-1 rounded-full shadow-lg border-2 border-orange-500 z-10 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&q=80"
                  className="w-full h-full rounded-full object-cover"
                  alt="Store"
                />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rotate-45 transform origin-center -z-10"></div>
            </div>
          </div>

          <div
            className={`absolute bottom-[30%] left-[45%] transform transition-all duration-1000 delay-700 ${
              visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
          >
            <div className="relative animate-[bounce_2.5s_infinite]">
              <Icon icon="zi-location-solid" size={48} className="text-[#D83231] drop-shadow-xl" />
              <div className="absolute -top-4 -right-8 bg-yellow-400 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm border border-white rotate-6">
                VOUCHER
              </div>
            </div>
          </div>
        </div>

        <div
          className={`relative z-10 text-center px-4  transition-all duration-700 transform ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl font-black text-gray-800 text-left tracking-tighter leading-none drop-shadow-sm mb-3">
            THÁI NGUYÊN <br />
            <span className="text-[#D83231] text-5xl">VOUCHER MAPS</span>
          </h1>

          <p className="text-[#D83231] text-base font-bold bg-white/80 backdrop-blur-md py-1.5 px-4 rounded-xl inline-block shadow-sm border border-white/50">
            "Đi đâu cũng có deal, ăn gì cũng tiết kiệm"
          </p>
        </div>
      </div>

      <div
        className={`flex-1 bg-white -mt-8 relative z-10 rounded-t-[32px] border-t border-[#D83231] px-6 pt-4 pb-safe flex flex-col transition-all duration-700 delay-500 transform ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="text-center mb-4 flex-shrink-0">
          <Text.Title className="text-lg font-bold text-gray-800 uppercase">
            Khám phá Thái Nguyên
          </Text.Title>
          <Text className="text-gray-500 mt-1 text-xs px-2 line-clamp-2">
            Tìm quán ngon, nhận voucher ưu đãi và tiết kiệm chi phí mỗi ngày.
          </Text>
        </div>

        <div className="space-y-3 mb-2 flex-1 overflow-y-auto min-h-0">
          <FeatureItem
            icon="zi-location-solid"
            text="Bản đồ quán ăn phủ sóng toàn TP"
            color={BRAND_COLOR}
          />
          <FeatureItem
            icon="zi-star-solid"
            text="Hàng ngàn Voucher độc quyền"
            color={BRAND_COLOR}
          />
          <FeatureItem icon="zi-link" text="Xác thực và liên kết tài khoản" color={BRAND_COLOR} />
        </div>

        <div className="mt-auto pt-2 pb-4">
          <Button
            fullWidth
            size="large"
            onClick={handleContinue}
            className="rounded-xl h-12 text-lg font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform"
            style={{
              backgroundColor: BRAND_COLOR,
              border: 'none',
            }}
          >
            Bắt đầu trải nghiệm
          </Button>
        </div>
      </div>
    </Page>
  );
};

const FeatureItem = ({ icon, text, color }: { icon: string; text: string; color: string }) => (
  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-red-50 transition-colors">
    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
      <Icon icon={icon as any} style={{ color: color }} />
    </div>
    <Text className="text-gray-700 font-medium text-sm line-clamp-1">{text}</Text>
  </div>
);

export default WelcomePage;
