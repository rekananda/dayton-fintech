'use client';

import { Group, Stack, Badge, Box, Button, Grid, Loader, Center, Text } from '@mantine/core';
import { LandingLayout } from '@/components/layouts/LandingLayout';
import MainText from '@/components/Atoms/MainText';
import RippleEffect from '@/components/Atoms/Effect/RippleEffect';
import Ornament from '@/components/Atoms/Effect/Ornament';
import TimelineCard from '@/components/Molecules/Cards/TimelineCard';
import useViewport from '@/hooks/useViewport';
import TopicTitle from '@/components/Molecules/Text/TopicTitle';
import RippleCard from '@/components/Molecules/Cards/RippleCard';
import Accordion from '@/components/Atoms/Accordion';
import Carousel, { CarouselCard } from '@/components/Molecules/Carousel';
import { CarouselCardT, CarouselItemT } from '@/components/Molecules/Carousel/type';
import Table from '@/components/Atoms/Table';
import { useEffect } from 'react';
import { TimelineCardT } from '@/components/Molecules/Cards/TimelineCard/type';
import { AccordionItemT } from '@/components/Atoms/Accordion/type';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading, setLandingData, resetToDummy } from '@/store/landingSlice';
import AnimatedText from '@/components/Atoms/AnimatedText';

export default function LandingPage() {
  const { isMobile } = useViewport();
  const dispatch = useAppDispatch();
  const { menus, timelines, businessModels, events, legals, qnas, config, isLoading } = useAppSelector((state) => state.landing);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        dispatch(setLoading(true));
        const response = await fetch('/api/landing');
        
        if (!response.ok) {
          console.log('Failed to fetch landing data');
        }
        
        const data = await response.json();
        dispatch(setLandingData(data));
      } catch (err) {
        console.error('Error fetching landing data:', err);
        dispatch(resetToDummy());
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchLandingData();
  }, [dispatch]);

  const listTimeline: TimelineCardT[] = timelines.map((item) => ({
    icon: item.icon,
    title: item.title,
    description: item.description,
    color: item.color,
  }));

  const listBussinessModel = businessModels;

  const listEvents: CarouselItemT<CarouselCardT>[] = events.map((item) => {
    const extraDetail: { [key: string]: string } = {};
    if (item.meetingLink) extraDetail.meetingLink = item.meetingLink;
    if (item.location) extraDetail.location = item.location;
    
    return {
      image: item.imageUrl,
      detail: {
        date: item.date,
        title: item.title,
        description: item.description,
        ...(Object.keys(extraDetail).length > 0 && { extraDetail }),
      },
    };
  });

  const listLegal: TimelineCardT[] = legals.map((item) => ({
    title: item.title,
    description: item.description,
    numberedIcon: item.order,
    withIndicator: false,
  }));

  const listQnA: AccordionItemT[] = qnas.map((item) => ({
    value: item.id.toString(),
    title: item.question,
    content: <MainText variant='body' fz={16}>{item.answer}</MainText>,
  }));

  const mainWhatsappLink = config.whatsappLink;

  const hasExplanationMenu = menus.some(menu => menu.href === 'explanation');
  const shouldShowExplanation = timelines.length > 0 && hasExplanationMenu;
  const hasProfitSharingMenu = menus.some(menu => menu.href === 'profit-sharing');
  const shouldShowProfitSharing = businessModels.length > 0 && hasProfitSharingMenu;
  const hasEventsMenu = menus.some(menu => menu.href === 'events');
  const shouldShowEvents = events.length > 0 && hasEventsMenu;
  const hasLegalMenu = menus.some(menu => menu.href === 'legal');
  const shouldShowLegal = legals.length > 0 && hasLegalMenu;
  const hasQnaMenu = menus.some(menu => menu.href === 'qna');
  const shouldShowQna = qnas.length > 0 && hasQnaMenu;
  const hasRegisterMenu = menus.some(menu => menu.href === 'register');

  if (isLoading) {
    return (
      <LandingLayout>
        <Center h="100vh">
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text>Memuat data...</Text>
          </Stack>
        </Center>
      </LandingLayout>
    );
  }

  return (
    <LandingLayout>
      <Stack pt={90} gap={0}>
        <Box id="home" className={`home-section ${isMobile ? 'home-section-mobile' : ''}`} >
          <Stack 
            className='home-section-content' 
            align='center' 
            gap={isMobile ? 28 : 40} 
            pt={isMobile ? 134 : 80}  
            pb={isMobile ? 134 : 100}
          >
            {config.mainBadges?.map((badge, index) => (
              <AnimatedText key={`main-badge-${index}`} delay={index * 0.1} animationType="fadeUp">
                <Badge variant="outline" className='main-badge'>
                  <span dangerouslySetInnerHTML={{ __html: badge }} />
                </Badge>
              </AnimatedText>
            ))}
            <AnimatedText delay={0.2} animationType="fadeUp">
              <MainText 
                className='home-main-text' 
                variant={isMobile ? 'heading3' : 'heading1'} 
                maw={isMobile ? 320 : 990} 
                ta='center'
                fw={isMobile ? '600' : '700'}
              >
                {config.mainTitle}
              </MainText>
            </AnimatedText>
            <AnimatedText delay={0.3} animationType="fadeUp">
              <MainText variant='body' maw={isMobile ? 320 : 650} ta='center' fz={20}>
                {config.mainDescription}
              </MainText>
            </AnimatedText>
            <Group maw={isMobile ? 400 : 650} justify='center'>
              {config.secondaryBadges?.map((badge, index) => (
                <AnimatedText key={`secondary-badge-${index}`} delay={0.4 + index * 0.1} animationType="fadeUp">
                  <Badge variant="outline" className='main-badge2'>
                    <span dangerouslySetInnerHTML={{ __html: badge }} />
                  </Badge>
                </AnimatedText>
              ))}
            </Group>
            <AnimatedText delay={0.5} animationType="fadeUp">
              <Button className='main-button' size="xl" color='primary' radius='xl' mt={isMobile ? 4 : 40} onClick={() => window.open(mainWhatsappLink, '_blank')}>
                Daftar via WhatsApp
              </Button>
            </AnimatedText>
          </Stack>

          <RippleEffect className="home-ripple ripple-l" position='left' color='primary.8' size={isMobile ? 250 : 450}/>
          <RippleEffect className="home-ripple ripple-r" position='center' color='primary.8' size={isMobile ? 300 : 460}/>

          <Ornament className='home-ornament ornament-1' size={isMobile ? 30 : 45} type='candle' angle={-15}/>
          <Ornament className='home-ornament ornament-2' size={isMobile ? 30 : 45} type='coin' angle={15}/>
          <Ornament className='home-ornament ornament-3' size={isMobile ? 30 : 45} type='graph' angle={15}/>
          <Ornament className='home-ornament ornament-4' size={isMobile ? 30 : 45} type='waterfall' angle={-15}/>
        </Box>

        {shouldShowExplanation && (
          <Stack id="explanation" align='center' py={80} px={isMobile ? 20 : 100}>
            <AnimatedText delay={0.1} animationType="fadeUp">
              <TopicTitle title="Rahasia di Balik Performa Stabil Kami" badge="Strategi Kami" />
            </AnimatedText>

            <Box className={`timeline-container ${isMobile ? 'left' : 'center'}`} mt={isMobile ? 16 : 60}>
              <Box className='timeline-ornament' w={isMobile ? '60dvw' : '30dvw'} />
              <Box className='timeline-line' w={2}/>
              {listTimeline.map((item, index) => (
                <AnimatedText key={`timeline-${timelines[index]?.id || index}`} delay={0.2 + index * 0.15} animationType="fadeUp">
                  <Box 
                    className={`timeline-item ${index%2==0? "even" : "odd"}`} 
                    pb={index !== listTimeline.length-1 ? isMobile ? 20 : 50 : 0}
                  >
                    <TimelineCard {...item} />
                  </Box>
                </AnimatedText>
              ))}
            </Box>
          </Stack>
        )}

        {shouldShowProfitSharing && (
          <Stack id="profit-sharing" align='center' py={80} px={isMobile ? 20 : 100} gap={isMobile ? 32 : 64}>
            <AnimatedText delay={0.1} animationType="fadeUp">
              <TopicTitle title="Berbagi Profit, Bukan Risiko" badge="Model Bisnis" />
            </AnimatedText>

            <Grid w='100%' gutter={isMobile ? 32 : 40} justify='center'>
              {listBussinessModel.map((item, index) => {
                const maxContent = 3;
                const colSpan = listBussinessModel.length > maxContent ? maxContent : listBussinessModel.length;
                const { tables, tnc, ...rest } = item;

                return (
                  <Grid.Col span={{ base: 12, md: 12/colSpan }} key={`business-model-${item.id}`}>
                    <AnimatedText delay={0.2 + index * 0.15} animationType="fadeUp">
                      <RippleCard {...rest} ripple={index%2==0 ? ['bottom-left'] : ['top-right']}>
                        <Stack>
                          {tables?.map((tableprops, tableIndex) => {
                            const columns = tableprops.columns || [];
                            const datas = tableprops.datas || [];
                            
                            if (columns.length === 0 || datas.length === 0) {
                              return null;
                            }

                            return (
                              <Table
                                key={`table-${item.id}-${tableIndex}`}
                                columns={columns}
                                datas={datas}
                              />
                            );
                          })}
                          {tnc && <MainText variant='body' fz={14}>{tnc}</MainText>}

                        </Stack>
                      </RippleCard>
                    </AnimatedText>
                  </Grid.Col>
                );
              })}
            </Grid>
          </Stack>
        )}

        {shouldShowEvents && <Stack id="events" align='center' py={80} gap={isMobile ? 32 : 48}>
          <AnimatedText delay={0.1} animationType="fadeUp">
            <TopicTitle title="Belajar Bareng, Raih Hasil Lebih Baik" badge="Acara Mendatang" px={isMobile ? 20 : 100}/>
          </AnimatedText>
          <AnimatedText delay={0.2} animationType="fadeUp">
            <Stack gap={isMobile ? 24 : 32} w="100%">
              <Carousel items={listEvents} renderDetail={ (props: CarouselCardT) => <CarouselCard {...props} />} />
            </Stack>
          </AnimatedText>
        </Stack>}

        {shouldShowLegal && <Stack id="legal" align='center' py={80} px={isMobile ? 20 : 100} gap={isMobile ? 32 : 64}>
          <AnimatedText delay={0.1} animationType="fadeUp">
            <TopicTitle title="Ketentuan Layanan & Perlindungan Data" badge="Legal" />
          </AnimatedText>
          
          <Grid gutter={isMobile ? 32 : 40} justify='center'>
            {listLegal.map((item, index) => (
              <Grid.Col span={{ base: 12, md: 6 }} key={`legal-${legals[index]?.id || index}`}>
                <AnimatedText delay={0.2 + index * 0.15} animationType="fadeUp">
                  <TimelineCard {...item} withIndicator={false} h='100%'/>
                </AnimatedText>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>}

        {shouldShowQna && <Grid id="qna" justify='center' py={80} px={isMobile ? 20 : 100} gutter={isMobile ? 32 : 40} w='100%'>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <AnimatedText delay={0.1} animationType="fadeUp">
              <TopicTitle title="Pertanyaan yang Sering Diajukan" badge="F.A.Q" align={isMobile ? 'center' : 'left'} />
            </AnimatedText>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <AnimatedText delay={0.2} animationType="fadeUp">
              <Box>
                <Accordion items={listQnA} />
              </Box>
            </AnimatedText>
          </Grid.Col>
        </Grid>}

        {hasRegisterMenu && <Box id="register" py={80} px={isMobile ? 20 : 100}> 
          <AnimatedText delay={0.1} animationType="fadeUp">
            <RippleCard 
              ripple={['bottom-left', 'top-right']} 
              rippleProps={{ type: 'circle', rippleSize: isMobile ? [300, 300] : [500, 500] }}
            > 
              <Stack align='center' gap={isMobile ? 24 : 48} py={50}>
                <AnimatedText delay={0.2} animationType="fadeUp">
                  <MainText variant={isMobile ? 'heading4' : 'heading2'} ta='center' maw={isMobile ? 320 : 720}>
                    Mulai Langkah Pertamamu, Menuju Trading yang Terukur
                  </MainText>
                </AnimatedText>
                <AnimatedText delay={0.3} animationType="fadeUp">
                  <Button className='main-button' size="xl" radius='xl' onClick={() => window.open(mainWhatsappLink, '_blank')}>
                    Daftar via WhatsApp
                  </Button>
                </AnimatedText>
              </Stack>
            </RippleCard>
          </AnimatedText>
        </Box>}
      </Stack>
    </LandingLayout>
  );
}
