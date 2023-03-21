import type { ReactElement } from 'react-markdown/lib/react-markdown';
import {
  Anger,
  Brilliance,
  Detection,
  Enlightenment,
  Fox,
  Fury,
  Giants,
  Perfection,
  Power,
  Protection,
  Rage,
  Reflection,
  Skill,
  Titans,
  Twins,
  Vitriol,
} from './ordericons';

const Components: { [key: string]: (props: any) => ReactElement } =
  Object.freeze({
    power: (props) => <Power {...props} />,
    anger: (props) => <Anger {...props} />,
    brilliance: (props) => (
      <Brilliance {...props} className={props.className} />
    ),
    detection: (props) => <Detection {...props} />,
    enlightenment: (props) => <Enlightenment {...props} />,
    fox: (props) => <Fox {...props} />,
    fury: (props) => <Fury {...props} />,
    giants: (props) => <Giants {...props} />,
    perfection: (props) => <Perfection {...props} />,
    reflection: (props) => <Reflection {...props} />,
    skill: (props) => <Skill {...props} />,
    titans: (props) => <Titans {...props} className={props.className} />,
    twins: (props) => <Twins {...props} />,
    vitriol: (props) => <Vitriol {...props} />,
    rage: (props) => <Rage {...props} />,
    protection: (props) => <Protection {...props} />,
  });

export const BastionOrderIcon = (props: any) => {
  const order = props.order.toLowerCase();

  return <>{Components[order](props)}</>;
};
