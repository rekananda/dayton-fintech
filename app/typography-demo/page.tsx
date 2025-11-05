'use client';

import { Container, Card, Stack, Divider, Paper } from '@mantine/core';
import { Heading1, Heading2, Heading3, Heading4, Body, BodyBold, BodySemibold } from '@/components/typography';

export default function TypographyDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <Container size="xl">
        <Stack gap="xl">
          {/* Headings - Mantine */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="lg">
              <h2 className="text-2xl font-semibold mb-4">Mantine UI Components</h2>
              
              <div>
                <Heading1>Heading 1 - Inter Semi Bold 80px</Heading1>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<Heading1>Text</Heading1>`} atau {`<Title order={1}>Text</Title>`}
                </code>
              </div>

              <Divider />

              <div>
                <Heading2>Heading 2 - Inter Semi Bold 48px</Heading2>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<Heading2>Text</Heading2>`} atau {`<Title order={2}>Text</Title>`}
                </code>
              </div>

              <Divider />

              <div>
                <Heading3>Heading 3 - Inter Semi Bold 40px</Heading3>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<Heading3>Text</Heading3>`} atau {`<Title order={3}>Text</Title>`}
                </code>
              </div>

              <Divider />

              <div>
                <Heading4>Heading 4 - Inter Semi Bold 32px</Heading4>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<Heading4>Text</Heading4>`} atau {`<Title order={4}>Text</Title>`}
                </code>
              </div>

              <Divider />

              <div>
                <Body>Body Regular - Inter Regular 20px</Body>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<Body>Text</Body>`}
                </code>
              </div>

              <Divider />

              <div>
                <BodySemibold>Body Semi Bold - Inter Semi Bold 20px</BodySemibold>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<BodySemibold>Text</BodySemibold>`}
                </code>
              </div>

              <Divider />

              <div>
                <BodyBold>Body Bold - Inter Bold 20px</BodyBold>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<BodyBold>Text</BodyBold>`}
                </code>
              </div>
            </Stack>
          </Card>

          {/* Tailwind Classes */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="lg">
              <h2 className="text-2xl font-semibold mb-4">Tailwind CSS Classes</h2>
              
              <div>
                <h1 className="text-heading1">Heading 1 - Inter Semi Bold 80px</h1>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<h1 className="text-heading1">Text</h1>`}
                </code>
              </div>

              <Divider />

              <div>
                <h2 className="text-heading2">Heading 2 - Inter Semi Bold 48px</h2>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<h2 className="text-heading2">Text</h2>`}
                </code>
              </div>

              <Divider />

              <div>
                <h3 className="text-heading3">Heading 3 - Inter Semi Bold 40px</h3>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<h3 className="text-heading3">Text</h3>`}
                </code>
              </div>

              <Divider />

              <div>
                <h4 className="text-heading4">Heading 4 - Inter Semi Bold 32px</h4>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<h4 className="text-heading4">Text</h4>`}
                </code>
              </div>

              <Divider />

              <div>
                <p className="text-body">Body Regular - Inter Regular 20px</p>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<p className="text-body">Text</p>`}
                </code>
              </div>

              <Divider />

              <div>
                <p className="text-body-semibold">Body Semi Bold - Inter Semi Bold 20px</p>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<p className="text-body-semibold">Text</p>`}
                </code>
              </div>

              <Divider />

              <div>
                <p className="text-body-bold">Body Bold - Inter Bold 20px</p>
                <code className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {`<p className="text-body-bold">Text</p>`}
                </code>
              </div>
            </Stack>
          </Card>

          {/* Combined Usage */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="lg">
              <h2 className="text-2xl font-semibold mb-4">Kombinasi Mantine + Tailwind</h2>
              
              <Paper p="md" radius="md" className="bg-primary-0">
                <Heading1 className="text-primary-9 mb-4">
                  Title dengan Mantine Heading1 + Tailwind Color
                </Heading1>
                <Body className="text-gray-700">
                  Body text dengan kombinasi Mantine Body component dan Tailwind text color.
                </Body>
              </Paper>

              <Paper p="md" radius="md" className="bg-success-0">
                <Heading2 className="text-success-9 mb-4">
                  Kombinasi Styling
                </Heading2>
                <BodySemibold className="text-gray-800">
                  Body semibold dengan styling kombinasi.
                </BodySemibold>
              </Paper>
            </Stack>
          </Card>

          {/* Real World Example */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <h2 className="text-2xl font-semibold mb-4">Contoh Penggunaan Real</h2>
              
              <div>
                <Heading1 className="mb-4">Dayton Fintech</Heading1>
                <Heading2 className="mb-4 text-primary-6">Platform Fintech Terpercaya</Heading2>
                <Body className="mb-4">
                  Kami menyediakan layanan fintech terlengkap dengan teknologi terdepan untuk memudahkan 
                  transaksi keuangan Anda.
                </Body>
                <BodySemibold className="mb-2">Fitur Utama:</BodySemibold>
                <Body className="mb-1">• Transaksi mudah dan cepat</Body>
                <Body className="mb-1">• Keamanan berlapis</Body>
                <Body>• Support 24/7</Body>
              </div>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </div>
  );
}

