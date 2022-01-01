import { addDecorator } from "@storybook/react";
import { Web3ReactProvider } from "@web3-react/core";
import "../styles/globals.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

function getLibrary(provider, _connector) {
  return new Web3Provider(provider); // this will vary according to whether you use e.g. ethers or web3.js
}

addDecorator((Story) => (
  <Web3ReactProvider getLibrary={getLibrary}>{Story()}</Web3ReactProvider>
));
