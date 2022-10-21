import { abi, contractAddress } from "./constants.js"
import { ethers } from "./ethers-5.6.esm.min.js"
console.log("Script Working")

const connectButton = document.getElementById("connect")
connectButton.onclick = connect
const fundButton = document.getElementById("fund")
fundButton.onclick = fund

const balanceButton = document.getElementById("balanceButton")
balanceButton.onclick = getBalance

const withdrawButton = document.getElementById("withdraw")
withdrawButton.onclick = withdraw

async function getBalance() {
    if (!typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

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

async function fund() {
    const ethAmount = document.getElementById("eth_amount").value
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
        try {
            const fundTransactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(fundTransactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Minning ... ${transactionResponse.hash}`)
    // listen for transaction recipet
    return new Promise((res, rej) => {
        provider.once(transactionResponse.hash, (transactionReciept) => {
            console.log(
                `Transaction compelted with ${transactionReciept.confirmations} confirmation`
            )
            res()
        })
    })
}

// withdraw
async function withdraw() {
    if (!typeof window.ethereum != "undefined") {
        console.log("Withdrawing..")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done")
        } catch (error) {
            console.log(error)
        }
    }
}
