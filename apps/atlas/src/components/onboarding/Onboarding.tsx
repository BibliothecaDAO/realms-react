import Joyride from 'react-joyride';
import { MyActions } from '../empire/MyActions';

export function Onboarding() {
  const joyride = {
    steps: [
      {
        target: '.jr-empire',
        content:
          'This is your empire toggle. Click it to open your empire panel.',
      },
      {
        target: '.jr-sound',
        content: 'Control your sound here.',
      },
      {
        target: '.jr-realms',
        content: 'Search for Realms here',
      },
    ],
  };

  return (
    <div className="z-50 flex w-screen h-screen p-16">
      {/* <Joyride steps={joyride.steps} /> */}

      <div className="w-full p-20 bg-black rounded-2xl">
        <div>
          <h1 className="animate-pulse">
            The rage of the Realms is upon us....
          </h1>
          <MyActions />
        </div>
      </div>
    </div>
  );
}
