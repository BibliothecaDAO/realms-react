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

export const LaborValues = ({
  labor_generated,
  part_labor,
  vault,
  remaining,
}) => {
  const [generated, setLaborGenerated] = useState({
    generated: 0,
    part: 0,
    vault: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLaborGenerated({
        generated: labor_generated || 0,
        part: part_labor || 0,
        vault: vault || 0,
      });
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div className="text-base text-left">
      <div>
        <div>
          {' '}
          <span className="text-gray-600">Produced:</span>{' '}
          {(generated.generated * BASE_RESOURCES_PER_CYCLE).toFixed()} /{' '}
          {generated.generated}
        </div>
        <div>
          <span className="text-gray-600">Production:</span>{' '}
          {(generated.part * 100).toFixed(3)}%
        </div>
      </div>{' '}
      <div>
        {' '}
        <span className="text-gray-600">Queue: </span>
        {remaining}
      </div>
      <div>
        <span className="text-gray-600">Vault: </span> {generated.vault}
      </div>
    </div>
  );
};
