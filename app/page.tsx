'use client';

import { Button, Card, Text, Title, Container, Group, Stack, Badge, TextInput, Select } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { nprogress } from '@mantine/nprogress';

export default function Home() {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      type: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Nama minimal 2 karakter' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email tidak valid'),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    nprogress.start();
    
    notifications.show({
      title: 'Berhasil!',
      message: `Selamat datang, ${values.name}! 🎉`,
      color: 'teal',
    });
    
    console.log(values);
    
    setTimeout(() => {
      nprogress.complete();
    }, 1000);
  };

  const showNotification = () => {
    notifications.show({
      title: 'Demo Notifikasi',
      message: 'Ini adalah contoh notifikasi dari Mantine UI!',
      color: 'blue',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Container size="lg" className="py-12">
        <Stack gap="xl">
          {/* Header dengan kombinasi Tailwind + Mantine */}
          <div className="text-center mb-8">
            <Title order={1} className="mb-4 text-4xl font-bold text-gray-800 dark:text-white">
              🚀 Dayton Fintech
            </Title>
            <Text size="lg" c="dimmed" className="max-w-2xl mx-auto">
              Demo integrasi Next.js 16 + Mantine UI + Tailwind CSS
            </Text>
            <Group justify="center" mt="md">
              <Badge size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                Next.js 16
              </Badge>
              <Badge size="lg" variant="gradient" gradient={{ from: 'teal', to: 'lime' }}>
                Mantine UI
              </Badge>
              <Badge size="lg" variant="gradient" gradient={{ from: 'pink', to: 'orange' }}>
                Tailwind CSS
              </Badge>
            </Group>
          </div>

          {/* Grid dengan Tailwind */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1: Form Demo */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                📝 Form Demo (Mantine Form)
              </Title>
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                  <TextInput
                    label="Nama"
                    placeholder="Masukkan nama Anda"
                    {...form.getInputProps('name')}
                  />
                  <TextInput
                    label="Email"
                    placeholder="email@example.com"
                    type="email"
                    {...form.getInputProps('email')}
                  />
                  <Select
                    label="Tipe Akun"
                    placeholder="Pilih tipe akun"
                    data={[
                      { value: 'personal', label: 'Personal' },
                      { value: 'business', label: 'Bisnis' },
                      { value: 'corporate', label: 'Corporate' },
                    ]}
                    {...form.getInputProps('type')}
                  />
                  <Button type="submit" fullWidth variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                    Submit Form
                  </Button>
                </Stack>
              </form>
            </Card>

            {/* Card 2: Komponen Demo */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                🎨 Komponen Demo
              </Title>
              <Stack gap="md">
                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Buttons
                  </Text>
                  <Group>
                    <Button variant="filled" color="blue">
                      Filled
                    </Button>
                    <Button variant="outline" color="teal">
                      Outline
                    </Button>
                    <Button variant="light" color="grape">
                      Light
                    </Button>
                  </Group>
                </div>

                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Notifications
                  </Text>
                  <Button onClick={showNotification} variant="gradient" gradient={{ from: 'pink', to: 'orange' }}>
                    Tampilkan Notifikasi
                  </Button>
                </div>

                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Badges & Text
                  </Text>
                  <Group>
                    <Badge color="green">Success</Badge>
                    <Badge color="red">Error</Badge>
                    <Badge color="yellow">Warning</Badge>
                    <Badge color="blue">Info</Badge>
                  </Group>
                </div>
              </Stack>
            </Card>
          </div>

          {/* Info Card dengan Tailwind styling */}
          <Card shadow="md" padding="xl" radius="md" className="bg-gradient-to-r from-purple-500 to-pink-500">
            <div className="text-white">
              <Title order={2} className="text-white mb-4">
                ✨ Fitur yang Terinstall
              </Title>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Text className="font-semibold text-white text-lg mb-2">Core</Text>
                  <ul className="space-y-1 text-sm">
                    <li>✅ @mantine/core</li>
                    <li>✅ @mantine/hooks</li>
                    <li>✅ @mantine/form</li>
                  </ul>
                </div>
                <div>
                  <Text className="font-semibold text-white text-lg mb-2">UI Components</Text>
                  <ul className="space-y-1 text-sm">
                    <li>✅ @mantine/notifications</li>
                    <li>✅ @mantine/modals</li>
                    <li>✅ @mantine/carousel</li>
                    <li>✅ @mantine/dropzone</li>
                  </ul>
                </div>
                <div>
                  <Text className="font-semibold text-white text-lg mb-2">Features</Text>
                  <ul className="space-y-1 text-sm">
                    <li>✅ @mantine/charts</li>
                    <li>✅ @mantine/nprogress</li>
                    <li>✅ Tailwind CSS v4</li>
                    <li>✅ TypeScript</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <Text size="sm" c="dimmed">
              Selamat coding! 🎉 Semua komponen Mantine dan Tailwind sudah siap digunakan.
            </Text>
          </div>
        </Stack>
      </Container>
    </div>
  );
}
