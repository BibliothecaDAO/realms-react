import { useEffect, useState } from 'react';

import { useSpring, animated } from 'react-spring';
import {
  BASE_LABOR_UNITS,
  BASE_RESOURCES_PER_CYCLE,
} from '@/constants/buildings';

function Number({ end, start = 0 }) {
  const { number } = useSpring({
    number: end,
    from: { number: start },
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });
  return <animated.div>{number.to((x) => x.toFixed(0))}</animated.div>;
}

export const LaborValues = ({ last_harvest, labor_balance }) => {
  const [generated, setLaborGenerated] = useState({
    generated: 0,
    part: 0,
    vault: 0,
  });
  const now = new Date().getTime();
  console.log('now', now);
  console.log('last_harvest', last_harvest);
  console.log('labor_balance', labor_balance);

  const getLaborGenerated = ({ last_harvest, labor_balance }): number[] => {
    const lastHarvest = new Date(last_harvest);

    let labor;

    if (labor_balance > now) {
      labor = (now - lastHarvest.getTime()) / 1000;
    } else {
      labor = (labor_balance - lastHarvest.getTime()) / 1000;
    }

    const generated_labor = Math.floor(labor / BASE_LABOR_UNITS) * 0.7;

    const labor_remaining = labor % BASE_LABOR_UNITS;

    const vault = Math.floor(generated_labor * 0.3);

    return [generated_labor, labor_remaining / BASE_LABOR_UNITS, vault];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const generation = getLaborGenerated({
        last_harvest: last_harvest,
        labor_balance: labor_balance,
      });

      setLaborGenerated({
        generated: generation[0],
        part: generation[1],
        vault: generation[2],
      });
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <>
      <span>{(generated.generated * BASE_RESOURCES_PER_CYCLE).toFixed()}</span>{' '}
      <Number end={generated.generated} />
      {' / '}
      {generated.part.toFixed(3)}
      <span>Vault:</span> <Number end={generated.vault} />{' '}
    </>
  );
};
