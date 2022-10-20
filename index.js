import { abi, contractAddress } from "./constants.js"
import { ethers } from "./ethers-5.6.esm.min.js"
console.log("Script Working")

const connectButton = document.getElementById("connect")
connectButton.onclick = connect
const fundButton = document.getElementById("fund")
fundButton.onclick = fund

console.log(ethers)

async function connect() {
    if (typeof window.ethereum != null) {
        console.log("I see MetaMask")
        await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log("Opened Metamask")
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "Please Install a MetaMask"
        console.log("No MetaMask")
    }
}

async function fund(ethAmount) {
    console.log(`Funding with ${ethAmount}`)
    if (typeof window.ethereum != null) {
        // Provider / connection to blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // signer / wallet / someone woth gas
        const signer = provider.getSigner()
        // contract that we are interacting with
        // ABI / Address
        const contract = new ethers.Contract(contractAddress, abi, signer)

        // Transactions
    }
}
