// Deploys a StarkNet account, saving the keypair to local storage
const { Provider, ec, encode, number } = require("starknet");
const fs = require("fs");

// Pre-compiled Account.cairo contract
const ACCOUNT_CONTRACT = require("./artifacts/Account.json");

const keyPair = ec.genKeyPair();

const ts = new Date().toISOString();

console.log(`private key saved to .keystore-${ts}`);

// A StarkKey is simply the x coordinate of the public key
const starkKey = ec.getStarkKey(keyPair);
console.log("starkKey", starkKey);
const starkKeyInt = number.toBN(encode.removeHexPrefix(starkKey), 16); // hex is base 16

// TODO: Dynamic based on env
const provider = new Provider({
  network: "georli-alpha",
});

function deploy(provider, starkKey) {
  // Provide starkey as an argument in the constructor
  return provider.deployContract(ACCOUNT_CONTRACT, [starkKey.toString()]);
}

fs.writeFileSync(
  `.keystore-${ts}`,
  JSON.stringify({
    starkKeyHex: starkKeyInt,
    privateKey: keyPair.getPrivate("hex"),
  })
);

deploy(provider, starkKeyInt)
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.error(e);
  });
