// Raffle
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Raffle__NotEnoughETHEntered();
error Raffle_TransferedFailed();

contract Raffle is VRFConsumerBaseV2 {
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

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_entranceFee = entranceFee;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
    }

    event RaffleEnter(address indexed player);
    event requestedRaffleWinner(uint256 indexed reqquestId);
    event WinnerPicked(address indexed winner);

    // Enter the lottery (paying some amount)
    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }

        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    // Pick a random winner (verifiably random)
    function requestRandomWinenr() external {
        //  Request The random Number
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
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        emit WinnerPicked(recentWinner);
        if (!success) {
            revert Raffle_TransferedFailed();
        }
    }

    // Winner to be selected every X minutes - Event Driven Execution

    // Chainlink Oracle -> Randomness , Automated Event Execution (Chainlink keepers)
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
