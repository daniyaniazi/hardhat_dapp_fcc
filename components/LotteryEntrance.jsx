import { useWeb3Contract } from "react-moralis"
import { abi, contractAddreses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
export default function LotteryEntrance() {
    const [entranceFee, setEntranceFee] = useState("0")
    const { chainId: chainHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainHex)
    const raffleAddress = chainId in contractAddreses ? contractAddreses[chainId][0] : null

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    async function updateUIValues() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        setEntranceFee(ethers.utils.formatUnits(entranceFeeFromCall, "ether"))
    }
    useEffect(() => {
        console.log("isWeb3Enabled", isWeb3Enabled)
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    // const { runContractFunction: enterRaffle } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress:raffleAddress,
    //     functionName:"enterRaffle",
    //     params:{},
    //     msgValue:
    // })
    return <>HELLO {entranceFee ? entranceFee : ""} ETH</>
}
