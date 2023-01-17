const hre = require("hardhat");
const fs = require("fs/promises");

async function main() {
  const Token = await hre.ethers.getContractFactory("JToken");
  const token = await Token.deploy(100000);

  const Exchange = await hre.ethers.getContractFactory("Exchange");
  const exchange = await Exchange.deploy(token.address, 100000000000000);

  await token.deployed();
  await exchange.deployed();

  await writeContractDeploymentInfo(token, "tokenDeploymentInfo.json");
  await writeContractDeploymentInfo(exchange, "exchangeDeploymentInfo.json");
}

async function writeContractDeploymentInfo(contract, filename = "") {
  const data = {
    network: hre.network.name,
    contract: {
      address: contract.address,
      signerAddress: contract.signer.address,
      abi: contract.interface.format(),
    },
  };

  const info = JSON.stringify(data, null, 2);
  await fs.writeFile(filename, info, { encoding: "utf-8" });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
