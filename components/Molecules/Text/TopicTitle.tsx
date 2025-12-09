'use client';

import MainText from "@/components/Atoms/MainText";
import useViewport from "@/hooks/useViewport";
import { Badge, Stack } from "@mantine/core";
import { TopicTitleT } from "./type";

const TopicTitle = ({ title, badge, align='center', ...rest }: TopicTitleT) => {
  const { isMobile } = useViewport();
  return (
    <Stack align={align} {...rest}>
      <Badge variant="outline" className='title-badge'>{badge}</Badge>
      <MainText 
        className='home-main-text' 
        variant={isMobile ? 'heading5' : 'heading3'} 
        maw={isMobile ? 320 : 'unset'} 
        ta={align}
        fw={isMobile ? '600' : '700'}
      >
        {title}
      </MainText>

    </Stack>
  )
}

export default TopicTitle;