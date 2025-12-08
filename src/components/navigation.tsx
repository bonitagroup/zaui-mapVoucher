import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, Icon } from 'zmp-ui';

const CustomBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <BottomNavigation
      fixed
      activeKey={location.pathname}
      onChange={(key) => navigate(key)}
      className="z-50"
    >
      <BottomNavigation.Item key="/home" label="Trang chủ" icon={<Icon icon="zi-home" />} />
      <BottomNavigation.Item key="/map" label="Bản đồ" icon={<Icon icon="zi-location" />} />
      <BottomNavigation.Item key="/voucher" label="Voucher" icon={<Icon icon="zi-star" />} />
      <BottomNavigation.Item key="/profile" label="Tài khoản" icon={<Icon icon="zi-user" />} />
    </BottomNavigation>
  );
};

export default CustomBottomNavigation;
