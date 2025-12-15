import React, { useMemo } from 'react';
import { FiFilter } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { MAP_CATEGORY_CONFIG, CATEGORY_LABELS } from '@/constants/categories';

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
  const activeOption = useMemo(
    () => MAP_CATEGORY_CONFIG.find((opt) => opt.label === selectedCategory),
    [selectedCategory]
  );

  return (
    <div className="flex flex-col items-end gap-2 pointer-events-none relative z-[2000]">
      <div className="flex flex-col items-end gap-3 mb-1">
        {MAP_CATEGORY_CONFIG.map((opt, index) => {
          const transitionDelay = isOpen ? `${index * 50}ms` : '0ms';
          const isSelected = selectedCategory === opt.label;

          return (
            <div
              key={opt.key}
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
                  ${isSelected ? `text-blue-600 ring-2 ${opt.ringColor}` : ''}
                `}
              >
                {opt.label}
              </span>

              <div
                className={`
                  w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 border-2 border-white
                  ${opt.color}
                  ${isSelected ? 'scale-110 ring-2 ring-white shadow-xl' : 'active:scale-95'}
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
          w-11 h-11 rounded-full shadow-2xl flex items-center justify-center pointer-events-auto 
          transition-all duration-500 ease-in-out relative
          ${
            isOpen
              ? 'bg-gray-800 rotate-90'
              : activeOption && selectedCategory !== CATEGORY_LABELS.ALL
              ? activeOption.activeColor
              : 'bg-[#D83231] hover:bg-[#d38080]'
          }
        `}
      >
        <div
          className={`transition-all duration-300 absolute inset-0 flex items-center justify-center ${
            isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {selectedCategory !== CATEGORY_LABELS.ALL && activeOption ? (
            <div className="text-white text-xl drop-shadow-md">{activeOption.icon}</div>
          ) : (
            <FiFilter size={25} className="text-white" />
          )}
        </div>

        <div
          className={`transition-all duration-300 absolute inset-0 flex items-center justify-center ${
            isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 rotate-[-90deg]'
          }`}
        >
          <IoClose size={22} className="text-white" />
        </div>
      </button>

      {isOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
};

export default MapFilterButton;
