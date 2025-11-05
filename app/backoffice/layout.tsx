'use client';

import { BackofficeLayout } from '@/components/layouts/BackofficeLayout';

export default function BackofficeLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BackofficeLayout>{children}</BackofficeLayout>;
}

