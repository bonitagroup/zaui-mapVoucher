import { Routes, Route } from 'react-router-dom';
import { Box } from 'zmp-ui';
import HomePage from '@/pages/home';
import MapPage from '@/pages/map';
import VoucherPage from '@/pages/voucher';
import ProfilePage from '@/pages/profile';
import CustomBottomNavigation from './navigation';

const Layout = () => {
  return (
    <Box className="flex-1 flex flex-col h-screen overflow-hidden">
      <Box className="flex-1 overflow-auto relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/voucher" element={<VoucherPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Box>

      <CustomBottomNavigation />
    </Box>
  );
};

export default Layout;
