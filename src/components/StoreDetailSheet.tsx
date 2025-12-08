import { useMemo } from 'react';
import { Sheet, Button, Text, Box } from 'zmp-ui';
import { useStore } from '@/hooks/useStore';
import { Voucher } from '@/types/store';

const StoreDetailSheet = () => {
  const { selectedStore, setSelectedStore, saveVoucher, myVouchers } = useStore();

  const vouchers = selectedStore?.vouchers || [];

  const savedVoucherIds = useMemo(() => {
    return new Set((myVouchers || []).map((item) => item.voucher_id));
  }, [myVouchers]);

  return (
    <Sheet
      visible={!!selectedStore}
      onClose={() => setSelectedStore(null)}
      autoHeight
      mask
      handler
      swipeToClose
    >
      {selectedStore && (
        <Box p={4} className="pb-10">
          <div className="flex gap-4">
            <img
              src={selectedStore.image || 'https://via.placeholder.com/100'}
              className="w-24 h-24 rounded-lg object-cover bg-gray-100"
              alt={selectedStore.name}
              onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100')}
            />
            <div className="flex-1">
              <Text.Title className="text-orange-600 font-bold">{selectedStore.name}</Text.Title>
              <Text size="small" className="text-gray-500 mt-1">
                {selectedStore.address}
              </Text>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-100 my-4"></div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <Text.Title size="small" className="font-bold">
                Voucher hiện có
              </Text.Title>
              <span className="text-xs text-gray-400">{vouchers.length} mã</span>
            </div>

            {vouchers.length > 0 ? (
              <div className="space-y-3">
                {vouchers.map((v: Voucher) => {
                  const isSaved = savedVoucherIds.has(v.id);

                  return (
                    <div
                      key={v.id}
                      className="border border-gray-200 rounded-xl p-3 flex justify-between items-center shadow-sm"
                    >
                      <div className="flex-1 pr-2">
                        <Text className="font-bold text-gray-800">{v.title}</Text>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-mono">
                            {v.code}
                          </span>
                          <span className="text-xs text-orange-500 font-bold">
                            Giảm {v.discount}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="small"
                        className={
                          isSaved
                            ? 'bg-gray-400 text-gray-700 min-w-[70px]'
                            : 'bg-orange-500 text-white min-w-[70px]'
                        }
                        onClick={() => !isSaved && saveVoucher(v.id)}
                        disabled={isSaved}
                      >
                        {isSaved ? 'Đã lưu' : 'Lưu'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Text className="text-gray-400 italic">Quán này chưa có voucher nào :(</Text>
              </div>
            )}
          </div>
        </Box>
      )}
    </Sheet>
  );
};

export default StoreDetailSheet;
