'use client';

import useViewport from '@/hooks/useViewport';
import { Carousel as MantineCarousel } from '@mantine/carousel';
import { Box, Image, Stack, Anchor, Group } from "@mantine/core";
import { CarouselCardT, CarouselT } from './type';
import { IconChevronLeft, IconChevronRight, IconMapPin, IconCalendar, IconVideo } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import MainText from '@/components/Atoms/MainText';
import Autoplay from 'embla-carousel-autoplay';
import dayjs from 'dayjs';
import MainButton from '@/components/Atoms/Button/MainButton';
import './style.css';

const Carousel = ({ renderDetail, items, carouselProps, ...rest }: CarouselT) => {
  const { isMobile } = useViewport();
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  return (
    <Stack gap={isMobile ? 24 : 32} w="100%" {...rest}>
      <MantineCarousel
          slideSize="80%"
          withIndicators={false}
          withControls={true}
          controlSize={40}
          controlsOffset={isMobile ? 'sm' : 150}
          nextControlIcon={<IconChevronRight size={20} />}
          previousControlIcon={<IconChevronLeft size={20} />}
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={() => autoplay.current.play()}
          onSlideChange={(index) => setActiveEventIndex(index)}
          emblaOptions={{
            loop: true, align: 'center'
          }}
          {...carouselProps}
      >
        {items.map((item, key) => (
          <MantineCarousel.Slide key={key} className={`carousel-slide ${activeEventIndex === key ? 'slide-active' : ''}`}>
            <Image src={item.image} alt={item.detail?.title ?? `slide ${key + 1}`} h="100%" w="100%"/>
          </MantineCarousel.Slide>
        ))}
      </MantineCarousel>
      {renderDetail && renderDetail(items[activeEventIndex]?.detail)}
    </Stack>
  );
};

export const CarouselCard = ({ date, title, description, extraDetail }: CarouselCardT) => {
  const { isMobile } = useViewport();

  const isToday = date ? dayjs(date).isSame(dayjs(), 'day') : false;
  const meetingLink = extraDetail?.meetingLink;
  const location = extraDetail?.location;

  const generateCalendarUrl = () => {
    if (!date || !title) return '';
    
    const eventDate = dayjs(date);
    const startDate = eventDate.format('YYYYMMDDTHHmmss[Z]');
    const endDate = eventDate.add(1, 'hour').format('YYYYMMDDTHHmmss[Z]');
    
    let details = description || '';
    if (meetingLink) {
      details += `\n\nMeeting Link: ${meetingLink}`;
    }
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startDate}/${endDate}`,
      details: details,
      location: location || '',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <Box className='flex justify-center' px={isMobile ? 20 : 100}>
      <Stack gap={20} maw={isMobile ? 320 : 720}>
        <MainText variant="body" fw="400" fz={20}>
          {date && dayjs(date).format('MMM D, YYYY') }
        </MainText>
        <MainText variant="heading4" fz={isMobile ? 24 : 32}>
          {title}
        </MainText>
        <MainText variant="body" c="gray" fz={isMobile ? 16 : 20} style={{ whiteSpace: 'pre-line' }}>
          {description}
        </MainText>
        {extraDetail && (
          <Stack gap={12}>
            {Object.entries(extraDetail).map(([key, value]) => {
              if (key === 'meetingLink' && value) {
                if (isToday) {
                  return (
                    <Anchor
                      key={key}
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      w="100%"
                    >
                      <MainButton
                        leftSection={<IconVideo size={18} />}
                        fullWidth
                      >
                        Buka Meeting
                      </MainButton>
                    </Anchor>
                  );
                } else {
                  return (
                    <Anchor
                      key={key}
                      href={generateCalendarUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      w="100%"
                    >
                      <MainButton
                        leftSection={<IconCalendar size={18} />}
                        fullWidth
                        variant="outline"
                      >
                        Tambah ke Kalender
                      </MainButton>
                    </Anchor>
                  );
                }
              }
              
              if (key === 'location') {
                return null;
              }
              
              return (
                <MainText key={key} variant="body" fw="400" fz={20}>
                  {key}: {value}
                </MainText>
              );
            })}
            {!meetingLink && location && (
              <Group gap={8} align="center">
                <IconMapPin size={20} stroke={1.5} />
                <MainText variant="body" fw="400" fz={20}>
                  {location}
                </MainText>
              </Group>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default Carousel;