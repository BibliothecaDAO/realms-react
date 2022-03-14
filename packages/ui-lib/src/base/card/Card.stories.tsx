import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Image from 'next/image';
import { Card, CardBody, CardText, CardTitle } from './Card';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Card/BasicCard',
  component: Card,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  // argTypes: {
  //   bg: {
  //     options: ['sky', 'green', 'blue', 'red'],
  //   },
  // },
} as ComponentMeta<typeof Card>;

export const BasicCardExample: ComponentStory<typeof Card> = (_args) => (
  <div className="flex flex-wrap">
    <div className="w-full mb-6 md:mb-0 md:p-3 md:w-4/12">
      <Card>
        <Image
          src="https://res.cloudinary.com/beloved/image/upload/v1608682938/Assets/632198_sgrp38.jpg"
          alt="image"
          width={1200}
          height={600}
          priority={true}
          className="h-auto max-w-full"
        />
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardText>
            Some quick example text to build on the card title and make up the
            bulk of the card&apos;s content.
          </CardText>
        </CardBody>
      </Card>
    </div>
  </div>
);
export const LoadingCardExample: ComponentStory<typeof Card> = (_args) => (
  <div className="flex flex-wrap">
    <div className="w-full mb-6 md:mb-0 md:p-3 md:w-4/12">
      <Card>
        <CardBody loading={true}>
          <CardTitle>Card title</CardTitle>
          <CardText>
            Some quick example text to build on the card title and make up the
            bulk of the card&apos;s content.
          </CardText>
        </CardBody>
      </Card>
    </div>
  </div>
);
