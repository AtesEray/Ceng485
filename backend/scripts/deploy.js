async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const Report = await ethers.getContractFactory("Report");
    console.log("Deploying Report contract...");
    const report = await Report.deploy();
    console.log("Report contract deployed to:", report.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  