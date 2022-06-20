const main = async () => {
  const contractFactory = await hre.ethers.getContractFactory("Hidratese");
  const contract = await contractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await contract.deployed();
  console.log("Endereço do contrato:", contract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    contract.address
  );
  console.log(
    "Saldo do contrato:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  const drinkTxn = await contract.pegaCopo("tchauzinho #1");
  await drinkTxn.wait();

  const drinkTxn2 = await contract.pegaCopo("tchauzinho #2");
  await drinkTxn2.wait();

  contractBalance = await hre.ethers.provider.getBalance(contract.address);
  console.log(
    "Saldo do contrato:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allDrinks = await contract.getAllDrinks();
  console.log(allDrinks);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();