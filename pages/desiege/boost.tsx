import ShieldGame from "~/components/minigame/ShieldGame";
import Game from "./index";

// TODO: Use getServerProps to retrieve actual boost for game

export default () => (
  <Game title="Boost is 42%">
    <ShieldGame initialTab="boost" />
  </Game>
);
