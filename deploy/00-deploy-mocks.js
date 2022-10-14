const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments // pull variable 'deploy' & 'log' from deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        // if chainId is dev chain, then deploy mocking // can do : if (chainId =='31337') as well
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mock deployed!")
        log("-----------------------------------------------")
    }
}

// to run only deploy mock script
module.exports.tags = ["all", "mocks"] // use command 'yarn hardhat deploy --tags mocks'
