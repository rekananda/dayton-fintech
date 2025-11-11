'use client';

import { Group, Stack, Badge, Box, Button, Grid } from '@mantine/core';
import { LandingLayout } from '@/components/layouts/LandingLayout';
import MainText from '@/components/Atoms/MainText';
import './landingpage.css';
import RippleEffect from '@/components/Atoms/Effect/RippleEffect';
import Ornament from '@/components/Atoms/Effect/Ornament';
import TimelineCard from '@/components/Molecules/Cards/TimelineCard';
import { listLegal, listQnA, listRippleCard, listTimeline } from '@/variables/dummy';
import useViewport from '@/hooks/useViewport';
import TopicTitle from '@/components/Molecules/Text/TopicTitle';
import RippleCard from '@/components/Molecules/Cards/RippleCard';
import Accordion from '@/components/Atoms/Accordion';

export default function LandingPage() {
  const { isMobile } = useViewport();

  return (
    <LandingLayout>
      <Stack pt={90} gap={0}>
        <Box className={`home-section ${isMobile ? 'home-section-mobile' : ''}`} >
          <Stack 
            id="home" 
            className='home-section-content' 
            align='center' 
            gap={isMobile ? 28 : 40} 
            pt={isMobile ? 134 : 80}  
            pb={isMobile ? 134 : 100}
          >
            <Badge variant="outline" className='main-badge'>Gold • XAUUSD • H1 • Tren</Badge>
            <MainText 
              className='home-main-text' 
              variant={isMobile ? 'heading3' : 'heading1'} 
              maw={isMobile ? 320 : 990} 
              ta='center'
              fw={isMobile ? '600' : '700'}
            >
              Trading Emas Otomatis, Aman dan Terukur
            </MainText>
            <MainText variant='body' maw={isMobile ? 320 : 650} ta='center' fz={20}>
              Pendekatan trend-following yang disiplin dengan target adaptif mengikuti volatilitas, pengendalian eksposur, serta jeda otomatis saat rilis data berdampak tinggi.
            </MainText>
            <Group maw={isMobile ? 400 : 650} justify='center'>
              <Badge variant="outline" className='main-badge2'>Profit Sharing <b>25%</b></Badge>
              <Badge variant="outline" className='main-badge2'>Referral hingga <b>10%</b></Badge>
              <Badge variant="outline" className='main-badge2'><b>Broker MT4 • H1</b></Badge>
            </Group>
            <Button className='main-button' size="xl" color='primary' radius='xl' mt={isMobile ? 4 : 40}>
              Daftar via WhatsApp
            </Button>
          </Stack>

          <RippleEffect className="home-ripple ripple-l" position='left' color='primary.8' size={isMobile ? 250 : 450}/>
          <RippleEffect className="home-ripple ripple-r" position='center' color='primary.8' size={isMobile ? 300 : 460}/>

          <Ornament className='home-ornament ornament-1' size={isMobile ? 30 : 45} type='candle' angle={-15}/>
          <Ornament className='home-ornament ornament-2' size={isMobile ? 30 : 45} type='coin' angle={15}/>
          <Ornament className='home-ornament ornament-3' size={isMobile ? 30 : 45} type='graph' angle={15}/>
          <Ornament className='home-ornament ornament-4' size={isMobile ? 30 : 45} type='waterfall' angle={-15}/>
        </Box>

        <Stack align='center' py={80} px={isMobile ? 20 : 100}>
          <TopicTitle title="Rahasia di Balik Performa Stabil Kami" badge="Strategi Kami" />

          <Box className={`timeline-container ${isMobile ? 'left' : 'center'}`} mt={isMobile ? 16 : 60}>
            <Box className='timeline-line' w={2}/>
            {listTimeline.map((item, key) => (
              <Box 
                key={key} 
                className={`timeline-item ${key%2==0? "even" : "odd"}`} 
                pb={key !== listTimeline.length-1 ? isMobile ? 20 : 50 : 0}
              >
                <TimelineCard {...item} />
              </Box>
            ))}
          </Box>
        </Stack>

        <Stack align='center' py={80} px={isMobile ? 20 : 100} gap={isMobile ? 32 : 64}>
          <TopicTitle title="Berbagi Profit, Bukan Risiko" badge="Model Bisnis" />

          <Grid w='100%' gutter={isMobile ? 32 : 40} justify='center'>
            {listRippleCard.map((item, key) => {
              const maxContent = 3;
              const colSpan = listRippleCard.length > maxContent ? maxContent : listRippleCard.length;

              return (
                <Grid.Col span={{ base: 12, md: 12/colSpan }} key={key}>
                  <RippleCard {...item} />
                </Grid.Col>
              )
            })}
          </Grid>
        </Stack>

        <Stack align='center' py={80} px={isMobile ? 20 : 100}>
          <TopicTitle title="Belajar Bareng, Raih Hasil Lebih Baik" badge="Acara Mendatang" />
        </Stack>

        <Stack align='center' py={80} px={isMobile ? 20 : 100} gap={isMobile ? 32 : 64}>
          <TopicTitle title="Ketentuan Layanan & Perlindungan Data" badge="Legal" />
          
          <Grid gutter={isMobile ? 32 : 40} justify='center'>
            {listLegal.map((item, key) => (
              <Grid.Col span={{ base: 12, md: 6 }} key={key}>
                <TimelineCard {...item} withIndicator={false} h='100%'/>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>

        <Grid justify='center' py={80} px={isMobile ? 20 : 100} gutter={isMobile ? 32 : 40} w='100%'>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TopicTitle title="Pertanyaan yang Sering Diajukan" badge="F.A.Q" align='left' />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Box>
              <Accordion items={listQnA} />
            </Box>
          </Grid.Col>
        </Grid>

        <Box py={80} px={isMobile ? 20 : 100}> 
          <RippleCard 
            ripple={['bottom-left', 'top-right']} 
            rippleProps={{ type: 'circle', rippleSize: isMobile ? [300, 300] : [500, 500] }}
          > 
            <Stack align='center' gap={isMobile ? 24 : 48} py={50}>
              <MainText variant={isMobile ? 'heading4' : 'heading2'} ta='center' maw={isMobile ? 320 : 720}>
                Mulai Langkah Pertamamu, Menuju Trading yang Terukur
              </MainText>
              <Button className='main-button' size="xl" radius='xl'>
                Daftar via WhatsApp
              </Button>
            </Stack>
          </RippleCard>
        </Box>
      </Stack>
    </LandingLayout>
  );
}
