// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Hidratese {
    uint256 coposAgua;
    uint256 private seed;

    event NewDrink(address indexed from, uint256 timestamp, string message);

    struct Drink {
        address drinker; // Endereço do usuário
        string message; // Mensagem que o usuário envio
        uint256 timestamp; // Data/hora de quando o usuário bebeu
    }

    Drink[] drinkes;
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("Diga nao as pedras nos rins");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function pegaCopo(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Espere 15m"
        );
        lastWavedAt[msg.sender] = block.timestamp;
        coposAgua += 1;
        console.log("%s bebeu e falou %s", msg.sender, _message);
        drinkes.push(Drink(msg.sender, _message, block.timestamp));

        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("# randomico gerado: %d", seed);

        if (seed <= 50) {
            console.log("%s ganhou!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Tentando sacar mais dinheiro que o contrato possui."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Falhou em sacar dinheiro do contrato.");
        }

        emit NewDrink(msg.sender, block.timestamp, _message);
    }

    function getAllDrinks() public view returns (Drink[] memory) {
        return drinkes;
    }

    function getCoposAgua() public view returns (uint256) {
        console.log("Pegaram %d copos dagua aqui!", coposAgua);
        return coposAgua;
    }
}
//0xA1398D523ECbf85E51A3C62444097cbD6A5676f4 - Basic
//0xFcECE2d27F9e7dA29e27aBa50e1C7eAD88B4d913 - Message
//0x14886C0a48f9a2BAE3d177892014d97CfC492B03 - Payable
//0xE7ABa389cF2FeFCF1A2a85e511Bd16E716A567e2 - TimeOut
