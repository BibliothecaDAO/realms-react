import { useEffect, useState } from 'react';

import { useSpring, animated } from 'react-spring';
import { Pulse } from '@/components/ui/Pulse';
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
        <div className="flex justify-between">
          <span className="flex">
            <Pulse
              active={generated.generated * BASE_RESOURCES_PER_CYCLE > 0}
            />
            <span className="mx-1 text-gray-600 ">Produced:</span>{' '}
          </span>
          {(generated.generated * BASE_RESOURCES_PER_CYCLE).toFixed()} /{' '}
          {generated.generated}
        </div>
        <div className="flex justify-between">
          <span className="flex">
            <Pulse active={generated.part > 0} />
            <span className="mx-1 text-gray-600">Production:</span>{' '}
          </span>
          {(generated.part * 100).toFixed(3)}%
        </div>
      </div>{' '}
      <div className="flex justify-between">
        {' '}
        <span className="flex">
          <Pulse active={remaining > 0} />
          <span className="mx-1 text-gray-600">Queue: </span>
        </span>
        {remaining}
      </div>
      <div className="flex justify-between">
        <span className="flex">
          <Pulse active={generated.vault > 0} />
          <span className="mx-1 text-gray-600">Vault: </span>{' '}
        </span>
        {(generated.vault * BASE_RESOURCES_PER_CYCLE).toFixed(2)}
      </div>
    </div>
  );
};
