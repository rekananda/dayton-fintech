'use client';

import dynamic from 'next/dynamic';
import { ControlLayoutT } from './type';

const ControlLayout = dynamic(() => import('./ControlLayout'), {
  ssr: false,
});

const ControlLayoutClient = (props: ControlLayoutT) => {
  return <ControlLayout {...props} />;
};

export default ControlLayoutClient;

