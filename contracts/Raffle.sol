// Raffle
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

error Raffle__NotEnoughETHEntered();

contract Raffle {
    // State Variables
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    // Enter the lottery (paying some amount)
    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }

        s_players.push(payable(msg.sender));
    }

    // Pick a random winner (verifiably random)
    // function pickRandomWinner() {

    // }

    // Winner to be selected every X minutes - Event Driven Execution

    // Chainlink Oracle -> Randomness , Automated Event Execution (Chainlink keepers)
    function getEntraceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
