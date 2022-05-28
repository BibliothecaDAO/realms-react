import { twMerge } from 'tailwind-merge';
interface HealthBarProps {
  vitality: number;
  troopId: number;
}

interface TroopProps {
  vitality: number;
  troopId: number;
  tier: string;
  className?: string;
}

const troops = [
  { id: 1, vitality: 8 },
  { id: 1, vitality: 8 },
];

export const HealthBar = (props: HealthBarProps) => {
  const getVitality = () => {
    const vit = troops.find((a) => a.id === props.troopId)?.vitality ?? 0;
    return (props.vitality / vit) * 100;
  };

  const getColour = () => {
    const vit = getVitality();
    if (vit > 70) {
      return 'bg-green-200 ';
    } else if (vit > 50) {
      return 'bg-yellow-200 ';
    } else if (vit > 25) {
      return 'bg-red-200 ';
    } else {
      return 'bg-red-500 ';
    }
  };

  return (
    <div
      style={{
        height: `${getVitality()}%`,
      }}
      className={`relative bottom-0 w-2 ${getColour()}`}
    ></div>
  );
};

export const TroopType = () => {
  return <div></div>;
};

const STYLES = {
  tier: {
    t1: 'w-12 h-24',
    t2: 'w-24 h-24',
    t3: 'w-48 h-24',
  },
} as const;

export const Troop = (props: TroopProps) => {
  return (
    <div
      className={`${twMerge(
        STYLES.tier[props.tier],
        props.className
      )} bg-white rounded`}
    >
      <HealthBar troopId={props.troopId} vitality={props.vitality} />
    </div>
  );
};
