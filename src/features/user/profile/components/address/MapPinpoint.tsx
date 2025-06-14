import dynamic from 'next/dynamic';

const MapPinpoint = dynamic(() => import('./MapPinpointInner'), {
  ssr: false,
});

export default MapPinpoint;
