import type { Story, Meta } from '@storybook/react';
import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import { useState, useCallback } from 'react';
import { ResourceIcon } from 'base';
import ChevronRight from '../../icons/chevron-right.svg';
import type { ImageCarouselProps } from './image-carousel';
import ImageCarousel from './image-carousel';

export default {
  component: ImageCarousel,
  title: 'Base/ImageCarousel',
} as Meta;

const mockData = {
  items: [
    {
      title: 'Find me on Twitter',
      link: 'https://twitter.com/kendalmintcode',
      imageUrl: 'https://placeimg.com/300/300/any',
    },
    {
      title: 'Welcome to Ark Labs',
      link: 'https://ark-labs.co.uk',
      imageUrl: 'https://placeimg.com/300/300/animals',
    },
    {
      title: 'Some sort of third title',
      link: 'https://twitter.com/kendalmintcode',
      imageUrl: 'https://placeimg.com/300/300/architecture',
    },
    {
      title: 'A personal site perhaps?',
      link: 'https://robkendal.co.uk',
      imageUrl: 'https://placeimg.com/300/300/nature',
    },
    {
      title: 'Super item number five',
      link: 'https://twitter.com/kendalmintcode',
      imageUrl: 'https://placeimg.com/300/300/people',
    },
    {
      title: 'Super item number six',
      link: 'https://twitter.com/kendalmintcode',
      imageUrl: 'https://placeimg.com/300/300/tech',
    },
    {
      title: 'Super item number seven',
      link: 'https://twitter.com/kendalmintcode',
      imageUrl: 'https://placeimg.com/300/300/animals',
    },
    {
      title: 'Super item number eight',
      link: 'https://twitter.com/kendalmintcode',
      imageUrl: 'https://placeimg.com/300/300/people',
    },
    {
      title: 'Super item number the last',
      link: 'https://twitter.com/kendalmintcode',
      imageUrl: 'https://placeimg.com/300/300/tech',
    },
  ],
};

const Template: Story<ImageCarouselProps> = (args) => {
  return (
    <div className="container p-16 ">
      <ImageCarousel items={mockData.items} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
