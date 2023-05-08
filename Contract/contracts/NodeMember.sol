//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

contract NodeMember {
    mapping(address => Weight) public inputNodesWeight;
    mapping(address => Weight) public hiddenNodesWeight;
    mapping(address => Weight) public outputNodesWeight;
    mapping(address => Weight) public lpNodesWeight;
    address[] public inputNodes;
    address[] public hiddenNodes;
    address[] public outputNodes;
    address[] public lpNodes;

    // bytes32 public constant UNIFORM_WI = keccak256("UNIFORM");
    // bytes32 public constant INHERIT_WI = keccak256("INHERIT");
    // bytes32 public constant RANDOM_WI = keccak256("RANDOM");

    struct Weight {
        uint256 initialWeight;
        uint256 investmentWeight;
    }

    error NotMember();
    error NotInputNode();
    error NotHiddenNode();
    error NotOutputNode();
    error NotLpNode();

    modifier memberOnly(address node) {
        if (
            !(inputNodesWeight[node].initialWeight != 0 ||
                hiddenNodesWeight[node].initialWeight != 0 ||
                outputNodesWeight[node].initialWeight != 0 ||
                lpNodesWeight[node].initialWeight != 0)
        ) {
            revert NotMember();
        }
        _;
    }

    modifier inputNodesOnly(address node) {
        if (inputNodesWeight[node].initialWeight == 0) {
            revert NotInputNode();
        }
        _;
    }

    modifier hiddenNodesOnly(address node) {
        if (hiddenNodesWeight[node].initialWeight == 0) {
            revert NotHiddenNode();
        }
        _;
    }

    modifier outputNodesOnly(address node) {
        if (outputNodesWeight[node].initialWeight == 0) {
            revert NotOutputNode();
        }
        _;
    }

    modifier lpNodesOnly(address node) {
        if (lpNodesWeight[node].initialWeight == 0) {
            revert NotLpNode();
        }
        _;
    }

    function isMember(address node) public view returns (bool result) {
        return
            inputNodesWeight[node].initialWeight != 0 ||
            hiddenNodesWeight[node].initialWeight != 0 ||
            outputNodesWeight[node].initialWeight != 0 ||
            lpNodesWeight[node].initialWeight != 0;
    }

    // function joinAsInput(bytes32 initializer) external virtual{
    //     if (initializer == UNIFORM_WI) {
    //         inputNodes.push(msg.sender);
    //         inputNodesWeight[msg.sender].initialWeight = 1;
    //         inputNodesWeight[msg.sender].investmentWeight = 0;
    //     }
    // }

    // function joinAsHidden(bytes32 initializer) external virtual{
    //     if (initializer == UNIFORM_WI) {
    //         hiddenNodes.push(msg.sender);
    //         hiddenNodesWeight[msg.sender].initialWeight = 1;
    //         hiddenNodesWeight[msg.sender].investmentWeight = 0;
    //     }
    // }

    // function joinAsOutput(bytes32 initializer) external virtual{
    //     if (initializer == UNIFORM_WI) {
    //         outputNodes.push(msg.sender);
    //         outputNodesWeight[msg.sender].initialWeight = 1;
    //         outputNodesWeight[msg.sender].investmentWeight = 0;
    //     }
    // }

    // function joinAsLP(bytes32 initializer) external virtual{
    //     if (initializer == UNIFORM_WI) {
    //         lpNodes.push(msg.sender);
    //         lpNodesWeight[msg.sender].initialWeight = 1;
    //         lpNodesWeight[msg.sender].investmentWeight = 0;
    //     }
    // }

    // function joinAsInput() external virtual {
    //     inputNodes.push(msg.sender);
    //     inputNodesWeight[msg.sender].initialWeight = 1;
    // }

    // function joinAsHidden() external virtual {
    //     hiddenNodes.push(msg.sender);
    //     hiddenNodesWeight[msg.sender].initialWeight = 1;
    // }

    // function joinAsOutput() external virtual {
    //     outputNodes.push(msg.sender);
    //     outputNodesWeight[msg.sender].initialWeight = 1;
    // }

    // function joinAsLP() external virtual {
    //     lpNodes.push(msg.sender);
    //     lpNodesWeight[msg.sender].initialWeight = 1;
    // }

    function getInputNodes() public view returns (address[] memory) {
        return inputNodes;
    }

    function getHiddenNodes() public view returns (address[] memory) {
        return hiddenNodes;
    }

    function getOutputNodes() public view returns (address[] memory) {
        return outputNodes;
    }

    function getLPNodes() public view returns (address[] memory) {
        return lpNodes;
    }
}
