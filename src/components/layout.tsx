import { Routes, Route, useLocation } from 'react-router-dom'; // Thêm useLocation
import { Box } from 'zmp-ui';
import HomePage from '@/pages/home';
import MapPage from '@/pages/map';
import VoucherPage from '@/pages/voucher';
import ProfilePage from '@/pages/profile';
import WelcomePage from '@/pages/welcome';
import CustomBottomNavigation from './navigation';
import StoreDetailPage from '@/pages/store';
import MyVoucherPage from '@/pages/profile/my-voucher/index';

const Layout = () => {
  const location = useLocation();
  const isWelcomePage = location.pathname === '/' || location.pathname === '/welcome';

  return (
    <Box className="flex-1 flex flex-col h-screen overflow-hidden">
      <Box className="flex-1 overflow-auto relative">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/voucher" element={<VoucherPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/store/:id" element={<StoreDetailPage />} />
          <Route path="/my-voucher" element={<MyVoucherPage />} />
        </Routes>
      </Box>

      {!isWelcomePage && <CustomBottomNavigation />}
    </Box>
  );
};

export default Layout;
