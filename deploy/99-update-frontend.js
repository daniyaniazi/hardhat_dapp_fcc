const { ethers, network } = require("hardhat")
const FRONT_END_ADDRESSES_FILE = "./constants/contractAddresses.json"
const fs = require("fs")
const ABI_JSON = "./constants/abi.json"
module.exports = async function () {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating Frontend...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}
async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE), "utf8")
    const chainId = network.config.chainId.toString()
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(raffle.address)) {
            currentAddresses[chainId].push(raffle.address)
        }
    } else {
        currentAddresses[chainId] = [raffle.address]
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(ABI_JSON, raffle.interface.format(ethers.utils.FormatTypes.json))
}

module.exports.tags = ["all", "frontend"]
