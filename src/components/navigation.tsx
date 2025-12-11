import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation } from 'zmp-ui';
import { FaHome, FaMapMarkedAlt, FaFireAlt, FaUser } from 'react-icons/fa';

const CustomBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeColor = '#d83231';
  const defaultColor = '#94a3b8';

  const getColor = (path) => {
    return location.pathname === path ? activeColor : defaultColor;
  };

  return (
    <BottomNavigation
      fixed
      activeKey={location.pathname}
      onChange={(key) => navigate(key)}
      className="z-[2000]  [&_.zaui-bottom-navigation-item-active]:text-[#d83231]"
    >
      <BottomNavigation.Item
        key="/home"
        label="Trang chủ"
        icon={<FaHome size={24} color={getColor('/home')} />}
      />

      <BottomNavigation.Item
        key="/map"
        label="Bản đồ"
        icon={<FaMapMarkedAlt size={24} color={getColor('/map')} />}
      />

      <BottomNavigation.Item
        key="/voucher"
        label="Khuyến mãi"
        icon={<FaFireAlt size={24} color={getColor('/voucher')} />}
      />

      <BottomNavigation.Item
        key="/profile"
        label="Tài khoản"
        icon={<FaUser size={24} color={getColor('/profile')} />}
      />
    </BottomNavigation>
  );
};

export default CustomBottomNavigation;
