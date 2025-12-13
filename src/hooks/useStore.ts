import { usePublicStore } from './usePublicStore';
import { useMyWallet } from './useMyWallet';

export const useStore = () => {
  const publicData = usePublicStore();
  const walletData = useMyWallet();

  return {
    ...publicData,
    ...walletData,
    loading: publicData.loading || walletData.loading,
  };
};
