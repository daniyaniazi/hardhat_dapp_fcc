import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div classNameName="bg-gray-50">
            <div className="mx-auto max-w-7xl py-8 px-8 sm:px-4 lg:flex lg:items-center lg:justify-between lg:py-8 lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    <span className="block">Ready to dive in?</span>
                    <span className="block text-indigo-600"> Decentralized Lottery</span>
                </h2>
                <div className="flex lg:mt-0 lg:flex-shrink-0">
                    <div className="ml-3 inline-flex rounded-md shadow">
                        <div classNameName="ml-auto py-1 px-2">
                            <ConnectButton moralisAuth={false} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
