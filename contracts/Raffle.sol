// Raffle
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Raffle__NotEnoughETHEntered();
error Raffle_TransferedFailed();
error Raffle__NotOpened();
error Raffle__UpKeepNotNeeded(uint256 currentBalance, uint256 numOfPlayers, uint256 raffleState);

contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    // Types
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    // State Variables

    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    uint16 private constant REQUEST_CONFIRMATION = 3;
    uint16 private constant NUM_WORDS = 1;
    VRFCoordinatorV2Interface private immutable i_COORDINATOR;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint64 private immutable i_subscriptionId;
    address private s_recentWinner;
    RaffleState private s_state;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_entranceFee = entranceFee;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
        s_state = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    event RaffleEnter(address indexed player);
    event requestedRaffleWinner(uint256 indexed reqquestId);
    event WinnerPicked(address indexed winner);

    // Enter the lottery (paying some amount)
    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        if (s_state != RaffleState.OPEN) {
            revert Raffle__NotOpened();
        }

        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    // Pick a random winner (verifiably random) - Keeper Function
    function performUpkeep(
        bytes calldata /*perform datab*/
    ) external {
        (bool upKeepNedded, ) = checkUpkeep("");
        if (!upKeepNedded) {
            revert Raffle__UpKeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_state)
            );
        }
        //  Request The random Number
        s_state = RaffleState.CALCULATING;
        uint256 requestId = i_COORDINATOR.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATION,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit requestedRaffleWinner(requestId);
        //  Do something
        //  2 Transaction process
    }

    function fulfillRandomWords(
        uint256, /* requestId*/
        uint256[] memory randowmWords
    ) internal override {
        uint256 indexOfWinner = randowmWords[0] % s_players.length;

        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_state = RaffleState.OPEN;
        //   reset players
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        emit WinnerPicked(recentWinner);
        if (!success) {
            revert Raffle_TransferedFailed();
        }
    }

    // Winner to be selected every X minutes - Event Driven Execution

    // Chainlink Oracle -> Randomness , Automated Event Execution (Chainlink keepers)

    /**
     * @dev function that chainlink keeper nodes call when they
     * look for the upKeepNeeded to return true
     * Conditions to met :
     * 1. At least 1 player with some ETH
     * 2. Time interval should have passed
     * 3. Subscription is funded with LINK
     * 4. lottery should be in open state
     */
    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (
            bool upKeepNeeded,
            bytes memory /*perfom data */
        )
    {
        bool isOpen = (RaffleState.OPEN == s_state);
        bool timePassed = (block.timestamp - s_lastTimeStamp) > i_interval;
        bool hasPlayers = s_players.length > 0;
        bool hasBalance = address(this).balance > 0;
        upKeepNeeded = isOpen && timePassed && hasBalance && hasPlayers;
    }

    function getEntraceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }
}
