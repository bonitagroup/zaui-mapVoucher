import React from 'react';
import { Page } from 'zmp-ui';
import MapViewComponent from './MapContainer';
import StoreDetailSheet from '@/components/StoreDetailSheet';

const MapPage: React.FC = () => {
  return (
    <Page className="flex flex-col h-full bg-white">
      <MapViewComponent />

      <StoreDetailSheet />
    </Page>
  );
};

export default MapPage;
