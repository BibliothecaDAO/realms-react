import { Tooltip } from '@bibliotheca-dao/ui-lib/base/utility';
import { useEffect, useMemo, useState } from 'react';

import { Pulse } from '@/components/ui/Pulse';
import { BASE_RESOURCES_PER_CYCLE } from '@/constants/globals';

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
    }, 5000);
    return () => clearInterval(interval);
  }, [labor_generated, part_labor, vault]);

  return (
    <div className="text-base text-left">
      <LaborRow
        title={'Produced'}
        pulse={generated.generated * BASE_RESOURCES_PER_CYCLE > 0}
        value={
          <span className="text-lg">
            {' '}
            {(generated.generated * BASE_RESOURCES_PER_CYCLE).toFixed()}
          </span>
        }
        tooltipText={<span>Resources produced | total labor units</span>}
      />
      <LaborRow
        title={'Production'}
        pulse={generated.part > 0}
        value={<span>{(generated.part * 100).toFixed(3)}%</span>}
        tooltipText={<span>% completion of production</span>}
      />

      <LaborRow
        title={'Queue'}
        pulse={remaining > 0}
        value={remaining}
        tooltipText={
          <span>You will continue to produce for {remaining} more cycles.</span>
        }
      />
      {/* <LaborRow
        title={'Vault'}
        pulse={generated.vault > 0}
        value={(generated.vault * BASE_RESOURCES_PER_CYCLE).toFixed(2)}
        tooltipText={
          <span>This is what will accrue to your vault after harvest.</span>
        }
      /> */}
    </div>
  );
};

export const LaborRow = ({ pulse, value, tooltipText, title }) => {
  return (
    <Tooltip
      placement="top"
      className="flex w-full"
      tooltipText={
        <div className="p-2 rounded bg-gray-1000">{tooltipText}</div>
      }
    >
      <div className="flex justify-between w-full rounded hover:bg-gray-1000">
        <span className="flex">
          <Pulse active={pulse} />
          <span className="mx-1 text-gray-600">{title}: </span>{' '}
        </span>
        {value}
      </div>
    </Tooltip>
  );
};
