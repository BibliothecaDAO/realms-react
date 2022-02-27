import { addDecorator } from "@storybook/react";
import { RouterContext } from "next/dist/shared/lib/router-context"; // next 12
import { initialize, mswDecorator } from "msw-storybook-addon";
import "../styles/index.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};

initialize({
  onUnhandledRequest: "bypass",
});
addDecorator(mswDecorator);
