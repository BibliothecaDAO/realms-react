import { useState, useCallback } from "react";
import { FlyToInterpolator } from "@deck.gl/core";
import { realms_data } from "../continents";

export const useUiState = () => {
  const [ui, setUi] = useState({resources: false});



  return {
    ui,
    setUi
  };
};
