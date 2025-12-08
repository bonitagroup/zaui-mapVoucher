import { getSystemInfo } from 'zmp-sdk';
import { App, SnackbarProvider, ZMPRouter } from 'zmp-ui';
import { RecoilRoot } from 'recoil';
import { AppProps } from 'zmp-ui/app';
import Layout from './layout';

const MyApp = () => {
  const ZMPSnackbarProvider = SnackbarProvider as any;

  return (
    <RecoilRoot>
      <App theme={getSystemInfo().zaloTheme as AppProps['theme']}>
        <ZMPSnackbarProvider>
          <ZMPRouter>
            <Layout />
          </ZMPRouter>
        </ZMPSnackbarProvider>
      </App>
    </RecoilRoot>
  );
};

export default MyApp;
