import { usePopper } from '@bibliotheca-dao/core-lib/hooks';
/* import {
  faArrowRightFromBracket,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; */
import { Portal } from '@headlessui/react';
import type { Story, Meta } from '@storybook/react';
import clsx from 'clsx';
import Gear from '../../icons/settings.svg';
import { Button } from '../button';
import type { MenuProps } from './menu';
import { Menu } from './menu';
// eslint-disable-next-line import/no-unresolved

export default {
  component: Menu,
  title: 'Navigation/Menu',
} as Meta;

const Template: Story<MenuProps> = () => {
  const [trigger, container] = usePopper({
    placement: 'right-start',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
  });

  return (
    <Menu>
      <Menu.Button variant="tertiary" ref={trigger}>
        Click me!
      </Menu.Button>
      <Portal>
        <Menu.Items ref={container}>
          <Menu.Group>
            <Menu.Item>
              {({ active }) => (
                <Button
                  leftIcon={<Gear className="w-6 h-6" />}
                  variant="tertiary"
                  size="sm"
                  className={clsx(
                    'block',
                    active
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-white text-gray-500'
                  )}
                  fullWidth
                >
                  Settings
                </Button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Button
                  leftIcon={<Gear />}
                  variant="tertiary"
                  size="sm"
                  className={clsx(
                    'block',
                    active
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-white text-gray-500'
                  )}
                  fullWidth
                >
                  Logout
                </Button>
              )}
            </Menu.Item>
          </Menu.Group>
        </Menu.Items>
      </Portal>
    </Menu>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
