import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from 'zmp-ui';
import HomePage from '@/pages/home';
import MapPage from '@/pages/map';
import VoucherPage from '@/pages/voucher';
import ProfilePage from '@/pages/profile';
import WelcomePage from '@/pages/welcome';
import CustomBottomNavigation from './navigation';
import StoreDetailPage from '@/pages/store';
import MyVoucherPage from '@/pages/profile/my-voucher/index';
import RegisterStore from '@/pages/store/register';
import ManagementStore from '@/pages/store/management';
import News from '@/pages/news';
import { useUserInit } from '@/hooks/useUserInit';

const Layout = () => {
  const location = useLocation();
  useUserInit();
  const isNotShowBotton =
    location.pathname === '/welcome' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/news/');

  return (
    <Box className="flex-1 flex flex-col h-screen overflow-hidden">
      <Box className="flex-1 overflow-auto relative">
        <Routes>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/voucher" element={<VoucherPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/store/:id" element={<StoreDetailPage />} />
          <Route path="/my-voucher" element={<MyVoucherPage />} />
          <Route path="/register" element={<RegisterStore />} />
          <Route path="/management" element={<ManagementStore />} />

          <Route path="/management" element={<ManagementStore />} />

          <Route path="/news/:id" element={<News />} />
        </Routes>
      </Box>

      {!isNotShowBotton && <CustomBottomNavigation />}
    </Box>
  );
};

export default Layout;
