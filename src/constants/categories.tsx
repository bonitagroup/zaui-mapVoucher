import {
  FaLayerGroup,
  FaHeartbeat,
  FaConciergeBell,
  FaUtensils,
  FaCoffee,
  FaHamburger,
  FaMugHot,
} from 'react-icons/fa';

export const CATEGORY_LABELS = {
  ALL: 'Tất cả',
  HEALTH: 'Sức khỏe',
  SERVICE: 'Dịch vụ',
  FOOD: 'Ăn uống',
  FLASH_SALE: 'Flash Sale',
  DRINK: 'Đồ uống',
  SNACK: 'Ăn vặt',
};

export const MAP_CATEGORY_CONFIG = [
  {
    key: 'ALL',
    label: CATEGORY_LABELS.ALL,
    icon: <FaLayerGroup />,
    color: 'bg-gray-600',
    activeColor: 'bg-white',
    ringColor: 'ring-gray-100',
  },
  {
    key: 'HEALTH',
    label: CATEGORY_LABELS.HEALTH,
    icon: <FaHeartbeat />,
    color: 'bg-green-600',
    activeColor: 'bg-green-600',
    ringColor: 'ring-green-100',
  },
  {
    key: 'FOOD',
    label: CATEGORY_LABELS.FOOD,
    icon: <FaUtensils />,
    color: 'bg-red-500',
    activeColor: 'bg-red-500',
    ringColor: 'ring-red-100',
  },
  {
    key: 'SERVICE',
    label: CATEGORY_LABELS.SERVICE,
    icon: <FaConciergeBell />,
    color: 'bg-blue-500',
    activeColor: 'bg-blue-500',
    ringColor: 'ring-blue-100',
  },
];

export const VOUCHER_TABS = [
  CATEGORY_LABELS.ALL,
  CATEGORY_LABELS.FLASH_SALE,
  'F&B',
  'Cafe',
  CATEGORY_LABELS.SNACK,
  'Nhà hàng',
  'Trà sữa',
];
