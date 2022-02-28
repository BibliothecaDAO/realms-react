import Power from "../../public/svg/orders/power.svg";
import Anger from "../../public/svg/orders/anger.svg";
import Brilliance from "../../public/svg/orders/brilliance.svg";
import Detection from "../../public/svg/orders/detection.svg";
import Enlightenment from "../../public/svg/orders/enlightenment.svg";
import Fox from "../../public/svg/orders/fox.svg";
import Fury from "../../public/svg/orders/fury.svg";
import Giants from "../../public/svg/orders/giants.svg";
import Perfection from "../../public/svg/orders/perfection.svg";
import Rage from "../../public/svg/orders/rage.svg";
import Reflection from "../../public/svg/orders/reflection.svg";
import Skill from "../../public/svg/orders/skill.svg";
import Titans from "../../public/svg/orders/titans.svg";
import Twins from "../../public/svg/orders/twins.svg";
import Vitriol from "../../public/svg/orders/vitriol.svg";
import Protection from "../../public/svg/orders/protection.svg";
type Props = {
  order: String;
};

const Components = Object.freeze({
  power: <Power />,
  anger: <Anger />,
  brilliance: <Brilliance />,
  detection: <Detection />,
  enlightenment: <Enlightenment />,
  "the fox": <Fox />,
  fury: <Fury />,
  giants: <Giants />,
  perfection: <Perfection />,
  reflection: <Reflection />,
  skill: <Skill />,
  titans: <Titans />,
  "the twins": <Twins />,
  vitriol: <Vitriol />,
  rage: <Rage />,
  protection: <Protection />,
});

export const OrderIcon = (props: Props) => {
  return (
    <div className="my-4 w-12">
      {/* @ts-ignore: name not exist on D */}
      {Components[props.order]}
    </div>
  );
};
