import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div class="bg-gray-50">
            <div class="mx-auto max-w-7xl py-8 px-8 sm:px-4 lg:flex lg:items-center lg:justify-between lg:py-8 lg:px-8">
                <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    <span class="block">Ready to dive in?</span>
                    <span class="block text-indigo-600"> Decentralized Lottery</span>
                </h2>
                <div class="flex lg:mt-0 lg:flex-shrink-0">
                    <div class="ml-3 inline-flex rounded-md shadow">
                        <div className="ml-auto py-1 px-2">
                            <ConnectButton moralisAuth={false} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
