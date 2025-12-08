import React from 'react';

interface VoucherProps {
  title: string;
  expiry: string;
  code: string;
}

const VoucherCard: React.FC<VoucherProps> = ({ title, expiry, code }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex mb-4 relative">
      {/* Phần bên trái: Hình ảnh hoặc % giảm giá */}
      <div className="w-24 bg-orange-500 flex items-center justify-center text-white font-bold text-xl p-2 text-center border-r-2 border-dashed border-white">
        HOT
      </div>

      {/* Phần bên phải: Thông tin */}
      <div className="flex-1 p-3">
        <h4 className="font-bold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-500 mt-1">HSD: {expiry}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">
            {code}
          </span>
          <button className="text-xs bg-teal-500 text-white px-3 py-1 rounded-full shadow hover:bg-teal-600">
            Dùng ngay
          </button>
        </div>
      </div>

      {/* Trang trí hình tròn khuyết để tạo hình vé */}
      <div className="absolute top-1/2 -left-2 w-4 h-4 bg-gray-100 rounded-full mt-[-8px]"></div>
      <div className="absolute top-1/2 -right-2 w-4 h-4 bg-gray-100 rounded-full mt-[-8px]"></div>
    </div>
  );
};

export default VoucherCard;
