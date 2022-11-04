import { useWeb3Contract } from "react-moralis"
import { abi, contractAddreses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
export default function LotteryEntrance() {
    const [entranceFee, setEntranceFee] = useState("0")
    const [noOfPlayers, setNoOfPlayers] = useState("0")
    const [recentWiner, setRecentWiner] = useState("0")

    const { chainId: chainHex, isWeb3Enabled } = useMoralis()
    const dispatch = useNotification()
    const chainId = parseInt(chainHex)
    const raffleAddress = chainId in contractAddreses ? contractAddreses[chainId][0] : null

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    const enterRaffleLottery = async () => {
        await enterRaffle({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error),
        })
    }
    const handleSuccess = async (transaction) => {
        await transaction.wait(1)
        handleNotification(transaction)
    }
    const handleNotification = async (transaction) => {
        dispatch({
            type: "success",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "check",
        })
    }
    const { runContractFunction: getNumOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUIValues() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const noOfPlayersFromCall = (await getNumOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNoOfPlayers(noOfPlayersFromCall)
        setRecentWiner(recentWinnerFromCall)
    }
    useEffect(() => {
        console.log("isWeb3Enabled", isWeb3Enabled)
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])
    return (
        <>
            {raffleAddress ? (
                <div>
                    <button onClick={enterRaffleLottery}>Enter Raffle</button>
                    <p>
                        Entrance Fee{" "}
                        {entranceFee ? ethers.utils.formatUnits(entranceFee, "ether") : ""} ETH
                    </p>
                    <p>No of Players : {noOfPlayers}</p>
                    <p>Reccent Winner : {recentWiner}</p>
                </div>
            ) : (
                <div>No Raffle Address</div>
            )}
        </>
    )
}
