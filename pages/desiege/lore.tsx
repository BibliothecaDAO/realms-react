import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ShieldGame from "~/components/minigame/ShieldGame";
import {
  EFFECT_BASE_FACTOR,
  getGameContextVariables,
} from "~/util/minigameApi";
import Game from "./index";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let gameCtx;
  try {
    gameCtx = await getGameContextVariables();
  } catch (e) {
    return { props: {} };
  }

  return {
    props: {
      boost: gameCtx.currentBoost,
    }, // will be passed to the page component as props
  };
};

const Lore = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => (
  <Game
    title={`Desiege Boost at ${props.boost / EFFECT_BASE_FACTOR}%`}
    openGraphUrl="http://lootverse.bibliothecadao.xyz/desiege/boost"
    openGraphDescription={`Desiege actions currently amplified by ${
      props.boost / EFFECT_BASE_FACTOR
    }%! Join the siege now.`}
  >
    <ShieldGame initialTab="lore" />
  </Game>
);

export default Lore;
