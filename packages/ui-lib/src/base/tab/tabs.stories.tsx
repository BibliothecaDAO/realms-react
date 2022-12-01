import type { Story, Meta } from '@storybook/react';
import { useState } from 'react';
import type { TabsProps } from './tabs';
import { Tabs } from './tabs';

export default {
  component: Tabs,
  title: 'Navigation/Tabs',
} as Meta;

const Template: Story<TabsProps> = (args) => {
  const [categories] = useState({
    Overview: [
      {
        id: 1,
        title: 'Does drinking coffee make you smarter?',
        date: '5h ago',
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
    ],
    Resources: [
      {
        id: 1,
        title: 'Is tech making coffee better or worse?',
        date: 'Jan 7',
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: 'The most innovative things happening in coffee',
        date: 'Mar 19',
        commentCount: 24,
        shareCount: 12,
      },
    ],
    Army: [
      {
        id: 1,
        title: 'Ask Me Anything: 10 answers to your questions about coffee',
        date: '2d ago',
        commentCount: 9,
        shareCount: 5,
      },
      {
        id: 2,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
    ],
  });

  return (
    <div className="p-8 bg-gray-1000/30">
      <Tabs {...args}>
        <Tabs.List>
          {Object.keys(categories).map((category) => (
            <Tabs.Tab key={category}>{category}</Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panels className="mt-2">
          {Object.values(categories).map((_, idx) => (
            <Tabs.Panel key={idx}>Content here</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = { variant: 'primary' };

export const Default = Template.bind({});
Default.args = {};
