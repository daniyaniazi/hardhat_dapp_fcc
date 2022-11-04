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

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
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
        updateUIValues()
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
        <div className="p-5">
            {raffleAddress ? (
                <div class="block">
                    <div className="m-4">
                        <button
                            disabled={isLoading || isFetching}
                            class=" bg-indigo-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={enterRaffleLottery}
                        >
                            {isLoading || isFetching ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            ) : (
                                "Enter Raffle"
                            )}
                        </button>
                    </div>

                    <div class="m-4 overflow-hidden bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:px-6">
                            <h3 class="text-lg font-medium leading-6 text-gray-900">
                                Raffle Lottery Updates
                            </h3>
                            <p class="mt-1 max-w-2xl text-sm text-gray-500">
                                Enter a raffle, get a chance to win!
                            </p>
                        </div>
                        <div class="border-t border-gray-200">
                            <dl>
                                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt class="text-sm font-medium text-gray-500">
                                        {" "}
                                        Entrance Fee
                                    </dt>
                                    <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        {" "}
                                        {entranceFee
                                            ? ethers.utils.formatUnits(entranceFee, "ether")
                                            : ""}{" "}
                                        ETH
                                    </dd>
                                </div>
                                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt class="text-sm font-medium text-gray-500">
                                        No of Players
                                    </dt>
                                    <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        {" "}
                                        {noOfPlayers}
                                    </dd>
                                </div>
                                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt class="text-sm font-medium text-gray-500">
                                        Reccent Winner
                                    </dt>
                                    <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        {recentWiner}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            ) : (
                <div>No Raffle Address</div>
            )}
        </div>
    )
}
