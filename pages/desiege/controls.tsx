import ShieldGame from "~/components/minigame/ShieldGame";
import Game from "./index";

// TODO: Get real game stats to display in OG preview

export default () => (
  <Game title="Desiege - Play Now">
    <ShieldGame initialTab="game-controls" />
  </Game>
);
