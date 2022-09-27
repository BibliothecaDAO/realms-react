import { useEffect, useState } from 'react';
import Joyride, { STATUS, ACTIONS } from 'react-joyride';
import useGameStatus from '@/hooks/desiege/useGameStatus';
import useGameVariables from '@/hooks/desiege/useGameVariables';
import ElementLabel from '@/shared/ElementsLabel';

type Prop = {
  showTutorial: boolean;
  onCloseTutorial: () => void;
  didShowTutorial: () => void;
};

enum OnboardingTutorials {
  GameControls = 'desiege-game-controls-tutorial',
}

const Tutorial: React.FC<Prop> = (props) => {
  const currGameContext = useGameVariables();
  const gameStatus = useGameStatus({ gameIdx: currGameContext.data?.gameIdx });

  const [showTutorial, setShowTutorial] = useState(props.showTutorial);

  useEffect(() => {
    if (props.showTutorial !== showTutorial) {
      setShowTutorial(props.showTutorial);
    }
  }, [props.showTutorial]);

  useEffect(() => {
    const previouslyShown = localStorage.getItem(
      OnboardingTutorials.GameControls
    );
    if (!previouslyShown && gameStatus.data == 'active') {
      setShowTutorial(true);
      props.didShowTutorial();
    }
  }, [gameStatus.data]);

  if (gameStatus.data != 'active') {
    return null;
  }

  return (
    <Joyride
      continuous
      run={showTutorial}
      showProgress
      callback={(data) => {
        const { status, action } = data;
        if (
          [STATUS.FINISHED, STATUS.SKIPPED].includes(status as any) ||
          action == ACTIONS.CLOSE
        ) {
          localStorage.setItem(OnboardingTutorials.GameControls, '1');
          setShowTutorial(false);
          props.onCloseTutorial();
        }
      }}
      showSkipButton
      steps={[
        {
          title: 'Dark Portal Lifetime',
          target: '#portal-timer',
          content: (
            <>
              A Dark Portal has opened near the Divine City. Some Mages are
              calling this event the <ElementLabel>Divine Eclipse</ElementLabel>
              . The Dark Portal can only remain open for a limited time. During
              this time, the Divine City is vulnerable to Dark magic.
            </>
          ),
          disableBeacon: true,
        },
        {
          target: '#mana-ball-light',
          content: (
            <>
              This is a spell to measure the remaining{' '}
              <ElementLabel>Elements</ElementLabel> remaining for this game.
            </>
          ),
        },
        {
          title: <ElementLabel>Elements</ElementLabel>,
          target: '#token-balance',
          content: (
            <>
              This shows how much <ElementLabel>Elements</ElementLabel> you can
              conjure during this game. Once the Dark Portal closes, these
              Elements cannot be re-used if the Dark portal opens again. Cast
              your spells with purpose.
            </>
          ),
        },
        {
          title: 'Portal Boost Effect',
          target: '#action-boost',
          content:
            'The effects of the Dark Portal are not fully understood. What some Mages in the Divine Library discovered is spell effects grow stronger with time. This effect applies to both Light Shield and Dark Attack spells.',
        },
        {
          title: 'Spell Power',
          target: '#action-amount',
          content: (
            <>
              A proper Mage carefully chooses the right amount of{' '}
              <ElementLabel>Elements</ElementLabel> to power their spells.
            </>
          ),
        },

        {
          title: 'Shield Indicator',
          target: '#shield-indicator',
          content: (
            <>
              <ElementLabel side="dark">Dark elements</ElementLabel> diminish
              the Light shield.{' '}
              <ElementLabel side="light">Light elements</ElementLabel> can
              restore the shield. When the Shield is down, the City Vitality can
              be attacked directly.
            </>
          ),
        },
        {
          title: 'Vitality Indicator',
          target: '#vitality-indicator',
          content: (
            <>
              <ElementLabel side="dark">Dark elements</ElementLabel> can drain
              the vitality of the Divine City. There is no known spell to
              restore vitality. The Dark side must drain the Vitality to 0 to
              conquer. The Light side must protect the Divine City with a shield
              until the Dark Portal closes.
            </>
          ),
        },
      ]}
    />
  );
};

export default Tutorial;
