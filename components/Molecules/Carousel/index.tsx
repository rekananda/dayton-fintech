import useViewport from '@/hooks/useViewport';
import { Carousel as MantineCarousel } from '@mantine/carousel';
import { Box, Image, Stack } from "@mantine/core";
import { CarouselCardT, CarouselT } from './type';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import MainText from '@/components/Atoms/MainText';
import Autoplay from 'embla-carousel-autoplay';
import dayjs from 'dayjs';
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

export const CarouselCard = ({ date, title, description }: CarouselCardT) => {
  const { isMobile } = useViewport();

  return (
    <Box className='flex justify-center' px={isMobile ? 20 : 100}>
      <Stack gap={20} maw={isMobile ? 320 : 720}>
        <MainText variant="body" fw="400" fz={20}>
          {date && dayjs(date).format('MMM D, YYYY') }
        </MainText>
        <MainText variant="heading4" fz={isMobile ? 24 : 32}>
          {title}
        </MainText>
        <MainText variant="body" c="gray" fz={isMobile ? 16 : 20}>
          {description}
        </MainText>
      </Stack>
    </Box>
  );
}

export default Carousel;