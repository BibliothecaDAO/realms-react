import { addDecorator } from "@storybook/react";
import { RouterContext } from "next/dist/shared/lib/router-context"; // next 12
import { initialize, mswDecorator } from "msw-storybook-addon";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import "../styles/index.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};

function getLibrary(provider, _connector) {
  return new Web3Provider(provider); // this will vary according to whether you use e.g. ethers or web3.js
}
// Enables mock-service-worker (msw)
initialize({
  onUnhandledRequest: "bypass",
});
addDecorator(mswDecorator);

addDecorator((Story) => (
  <Web3ReactProvider getLibrary={getLibrary}>{Story()}</Web3ReactProvider>
));
