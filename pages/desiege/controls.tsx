import ShieldGame from "~/components/minigame/ShieldGame";
import Game from "./index";

// TODO: Get real game stats to display in OG preview

const Controls = () => (
  <Game title="Desiege - Play Now">
    <ShieldGame initialTab="game-controls" />
  </Game>
);

export default Controls;
