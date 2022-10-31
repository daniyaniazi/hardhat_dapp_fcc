const { network, ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("2")
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let VRFCoordinatorV2Address, subscriptionId
    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        VRFCoordinatorV2Address = VRFCoordinatorV2Mock
        const subscriptionTransactionResponse = await VRFCoordinatorV2Mock.createSubscription()
        const subscriptionTransactionRecipt = await subscriptionTransactionResponse.wait(1)
        subscriptionId = subscriptionTransactionRecipt.events[0].args.subId
        await VRFCoordinatorV2Address.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        VRFCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["        subscriptionId"]
    }
    const entranceFee = networkConfig[chainId]["entranceFee"]
    const callBackGasLimit = networkConfig[chainId]["callBackGasLimit"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const interval = networkConfig[chainId]["interval"]
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: [
            VRFCoordinatorV2Address,
            entranceFee,
            gasLane,
            subscriptionId,
            callBackGasLimit,
            interval,
        ],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
}
