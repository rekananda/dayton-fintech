import MainText from "@/components/Atoms/MainText";
import useViewport from "@/hooks/useViewport";
import { Badge, Stack, StackProps } from "@mantine/core";

type PropsTopicTitleT = StackProps & {
  title: string;
  badge: string;
}

const TopicTitle = ({ title, badge, ...rest }: PropsTopicTitleT) => {
  const { isMobile } = useViewport();
  return (
    <Stack align="center" {...rest}>
      <Badge variant="outline" className='title-badge'>{badge}</Badge>
      <MainText 
        className='home-main-text' 
        variant={isMobile ? 'heading5' : 'heading3'} 
        maw={isMobile ? 320 : 'unset'} 
        ta='center'
        fw={isMobile ? '600' : '700'}
      >
        {title}
      </MainText>

    </Stack>
  )
}

export default TopicTitle;