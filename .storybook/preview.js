import { addDecorator } from "@storybook/react";
import { initialize, mswDecorator } from "msw-storybook-addon";
import { Web3ReactProvider } from "@web3-react/core";
import "../styles/globals.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
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
