export const MAX_HEALTH = 10000;

type Prop = {
  health: number;
};

const Castle: React.FC<Prop> = (props) => {
  let variantImg = '/assets/castle/variant1';
  if (props.health > MAX_HEALTH / 2) {
    variantImg = '/assets/castle/variant1';
  } else if (props.health <= MAX_HEALTH / 2) {
    if (props.health >= 0 && props.health < MAX_HEALTH / 4) {
      variantImg = '/assets/castle/variant1_destroyed';
    } else {
      variantImg = '/assets/castle/variant1_damaged';
    }
  }

  return (
    <img style={{ maxWidth: '600px' }} alt="castle" src={variantImg + '.png'} />
  );
};

export default Castle;
