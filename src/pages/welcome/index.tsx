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
      <div className="relative flex-shrink-0 bg-gradient-to-br from-red-400 via-[#D83231] to-red-900 flex flex-col items-center justify-center pt-20 pb-8 rounded-b-[40px] z-0">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-0 w-32 h-32 bg-orange-300 opacity-20 rounded-full blur-3xl"></div>

        <div
          className={`transition-all duration-700 transform ${
            visible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          } text-center z-10 px-4`}
        >
          <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md leading-tight uppercase">
            Thái Nguyên <br /> Voucher Maps
          </h1>

          <div className="mt-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block border border-white/10">
            <p className="text-white text-[10px] font-semibold tracking-wide">
              "Đi đâu cũng có deal, ăn gì cũng tiết kiệm"
            </p>
          </div>
        </div>

        <div
          className={`mt-6 relative transition-all duration-1000 delay-300 transform ${
            visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-110"></div>

          <img
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            className="w-48 h-48 object-cover rounded-full border-[4px] border-white/40 shadow-2xl relative z-10 animate-[bounce_4s_infinite]"
            alt="Food Hero"
          />

          <div className="absolute -right-2 top-8 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-lg z-20 animate-bounce delay-100 flex items-center gap-1">
            <span className="text-[10px] font-bold text-[#D83231]">-50%</span>
          </div>
          <div className="absolute -left-2 bottom-8 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-lg z-20 animate-bounce delay-300">
            <Icon icon="zi-location" className="text-[#D83231] pb-6 text-lg" />
          </div>
        </div>
      </div>

      <div
        className={`flex-1 bg-white -mt-8 relative z-10 rounded-t-[32px] px-6 pt-4 pb-safe flex flex-col transition-all duration-700 delay-500 transform ${
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
