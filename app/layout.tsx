import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import styles Mantine
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/charts/styles.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { NavigationProgress } from '@mantine/nprogress';
import { AuthProvider } from '@/lib/auth-context';
import { mainTheme } from '@/config/mantineTheme';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "600", "700"], // Regular, SemiBold, Bold
});

export const metadata: Metadata = {
  title: "Dayton Fintech",
  description: "Aplikasi Fintech dengan Next.js, Mantine UI, dan Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" {...mantineHtmlProps} className={inter.variable}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body
        className="font-sans antialiased"
        suppressHydrationWarning
      >
        <MantineProvider theme={mainTheme}>
          <ModalsProvider>
            <AuthProvider>
              <Notifications />
              <NavigationProgress />
              {children}
            </AuthProvider>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
