import React, { useEffect, useState, useMemo } from 'react';
import { Page, Header, Box, useSnackbar, Tabs } from 'zmp-ui';
import { useMyWallet } from '@/hooks/useMyWallet';
import VoucherTicket from './VoucherTicket';
import { useNavigate } from 'react-router-dom';

const MyVoucherPage: React.FC = () => {
  const { myVouchers, fetchMyWallet, useVoucher, loading } = useMyWallet();
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [, setTick] = useState(0);

  useEffect(() => {
    fetchMyWallet();
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [fetchMyWallet]);

  const handleUse = async (id: number) => {
    if (!useVoucher) return;
    const result: any = await useVoucher(id);
    if (result.success) {
      openSnackbar({ text: '✅ Sử dụng thành công!', type: 'success' });
    } else {
      openSnackbar({ text: result.message || 'Lỗi', type: 'error' });
    }
  };

  const { activeVouchers, historyVouchers } = useMemo(() => {
    const active: any[] = [];
    const history: any[] = [];
    const now = new Date().getTime();

    (myVouchers || []).forEach((item: any) => {
      const savedTime = new Date(item.saved_at).getTime();
      const holdingTime = (item.holding_time || 30) * 60 * 1000;
      const expireHoldTime = savedTime + holdingTime;
      const endDate = new Date(item.end_date).getTime();

      const isExpired = now > endDate;
      const isHoldExpired = now > expireHoldTime;
      const isUsed = item.status === 'USED';

      if (!isExpired && !isHoldExpired && !isUsed) {
        active.push(item);
      } else {
        history.push({ ...item });
      }
    });

    return { activeVouchers: active, historyVouchers: history };
  }, [myVouchers]);

  const EmptyState = ({ text }: { text: string }) => (
    <div className="flex flex-col items-center justify-center mt-12 opacity-60">
      <div className="text-4xl mb-2">🎫</div>
      <p className="text-gray-500 text-sm font-medium">{text}</p>
      <button
        onClick={() => navigate('/home')}
        className="mt-4 text-[#D83231] font-bold text-sm hover:underline"
      >
        Săn voucher mới →
      </button>
    </div>
  );

  return (
    <Page className="bg-gray-50 h-full pb-safe">
      <Header
        title="Ví Voucher Của Tôi"
        showBackIcon={true}
        className="bg-[#D83231] text-white"
        textColor="white"
      />

      <div className="mt-[80px] h-full flex flex-col">
        <Tabs id="my-voucher-tabs" className="flex-1 flex flex-col">
          <Tabs.Tab key="active" label={`Khả dụng (${activeVouchers.length})`}>
            <Box className="p-4 bg-gray-50 min-h-[80vh]">
              {loading ? (
                <div className="text-center py-10 text-gray-400 text-xs">Đang tải ví...</div>
              ) : activeVouchers.length > 0 ? (
                activeVouchers.map((item) => (
                  <VoucherTicket key={item.wallet_id} item={item} onUse={handleUse} />
                ))
              ) : (
                <EmptyState text="Bạn chưa có voucher nào khả dụng" />
              )}
            </Box>
          </Tabs.Tab>

          <Tabs.Tab key="history" label="Lịch sử">
            <Box className="p-4 bg-gray-50 min-h-[80vh]">
              {historyVouchers.length > 0 ? (
                historyVouchers.map((item) => (
                  <VoucherTicket key={item.wallet_id} item={item} onUse={() => {}} isHistory />
                ))
              ) : (
                <EmptyState text="Chưa có lịch sử sử dụng" />
              )}
            </Box>
          </Tabs.Tab>
        </Tabs>
      </div>
    </Page>
  );
};

export default MyVoucherPage;
