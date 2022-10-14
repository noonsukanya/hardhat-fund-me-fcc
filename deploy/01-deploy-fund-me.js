// define to deploy fundme.sol contract

// step 1) import 2) main function 3) calling of main function

// function deployFunc(hre) { // hre = hardhat runtime environment
//     console.log("Hi!")
//     hre.getNamedAccounts()
//     hre.deployments
// }
// module.exports.default = deployFunc

// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre
//     // hre.getNamedAccounts()
//     // hre.deployments
// }

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
// same as
//   const helperConfig = require("../helper-hardhat-config")
//   const networkConfig = helperConfig.networkConfig
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments // pull variable 'deploy' & 'log' from deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if chainId is X use address Y
    // else if chainId is Z use address A
    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // if the contract doesn't exist, we deploy a minimal version for our local testing => mocking

    // well what happens when we want to change chain?
    // when going for localhost or hardhat network we want to use a mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // call verify
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log("---------------------------------------------")
}

module.exports.tags = ["all", "fundme"] // ทำไมใช้ fundme ตัวเล็ก
