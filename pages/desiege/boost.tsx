import ShieldGame from "~/components/minigame/ShieldGame";
import Game from "./index";

// TODO: Use getServerProps to retrieve actual boost for game

export default () => (
  <Game
    title="Boost is 42%"
    openGraphUrl="http://lootverse.bibliothecadao.xyz/boost"
    openGraphDescription="Battle actions currently amplified by 42%"
  >
    <ShieldGame initialTab="boost" />
  </Game>
);
