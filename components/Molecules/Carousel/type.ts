import { CarouselProps } from "@mantine/carousel";
import { StackProps } from "@mantine/core";

export type CarouselCardT= {
  date: string;
  title: string;
  description: string;
  extraDetail?: {
    [key: string]: string;
  }
}

export type CarouselItemT<T> = {
  image: string;
  detail: T;
}

export type CarouselT<T = CarouselCardT> = StackProps & {
  renderDetail?: (props: T) => React.ReactElement;
  carouselProps?: CarouselProps;
  items: CarouselItemT<T>[];
};