import React from 'react';
import {
  FaFilter,
  FaUtensils,
  FaHeartbeat,
  FaConciergeBell,
  FaLayerGroup,
  FaTimes,
} from 'react-icons/fa';

interface MapFilterButtonProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MapFilterButton: React.FC<MapFilterButtonProps> = ({
  selectedCategory,
  onSelectCategory,
  isOpen,
  setIsOpen,
}) => {
  const filterOptions = [
    { label: 'Tất cả', icon: <FaLayerGroup />, color: 'bg-gray-600', ring: 'ring-gray-300' },
    { label: 'Sức khỏe', icon: <FaHeartbeat />, color: 'bg-green-600', ring: 'ring-green-300' },
    { label: 'Dịch vụ', icon: <FaConciergeBell />, color: 'bg-pink-500', ring: 'ring-pink-300' },
    { label: 'Ăn uống', icon: <FaUtensils />, color: 'bg-red-500', ring: 'ring-red-300' },
  ];

  return (
    <div className="flex flex-col items-end gap-4 pointer-events-none relative z-[2000]">
      <div className="flex flex-col items-end gap-3 mb-1">
        {filterOptions.map((opt, index) => {
          const transitionDelay = isOpen ? `${index * 50}ms` : '0ms';
          const isSelected = selectedCategory === opt.label;

          return (
            <div
              key={opt.label}
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory(opt.label);
                setIsOpen(false);
              }}
              style={{ transitionDelay }}
              className={`
                flex items-center gap-3 cursor-pointer pointer-events-auto transition-all duration-300 ease-out transform
                ${
                  isOpen
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-4 scale-75 pointer-events-none absolute bottom-0 right-0'
                }
              `}
            >
              <span
                className={`
                bg-white/90 backdrop-blur-md text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-gray-100
                transition-all duration-200
                ${isSelected ? 'text-blue-600' : ''}
              `}
              >
                {opt.label}
              </span>

              <div
                className={`
                  w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 border-2 border-white
                  ${opt.color}
                  ${isSelected ? `ring-2 ${opt.ring} scale-110` : 'active:scale-95'}
                `}
              >
                <div className="text-sm drop-shadow-md">{opt.icon}</div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`
          w-12 h-12 rounded-full shadow-xl flex items-center justify-center pointer-events-auto 
          transition-all duration-500 ease-in-out relative border-2 border-white
          ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-white hover:bg-gray-50'}
          ${
            !isOpen && selectedCategory !== 'Tất cả' ? 'bg-blue-600 text-white border-blue-100' : ''
          }
        `}
      >
        <div
          className={`transition-all duration-300 ${
            isOpen ? 'scale-0 opacity-0 absolute' : 'scale-100 opacity-100'
          }`}
        >
          <FaFilter
            size={16}
            className={selectedCategory !== 'Tất cả' ? 'text-white' : 'text-gray-600'}
          />
        </div>

        <div
          className={`transition-all duration-300 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 absolute'
          }`}
        >
          <FaTimes size={18} className="text-white" />
        </div>

        {!isOpen && selectedCategory !== 'Tất cả' && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {isOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
};

export default MapFilterButton;
