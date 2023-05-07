//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

contract WeightReputation {
    struct Performance {
        uint256 investmentWeight;
        uint256 earnedToken;
        uint256 lostToken;
    }
    mapping(address => mapping(address => Performance))
        public AllNodesPerformance;
    address public factoryAddress;

    constructor(address _factory) {
        factoryAddress = _factory;
    }

    // modifier onlyInvestAgentContract() {
    //     require(
    //         msg.sender == getInvestmentAgentContract(),
    //         "Only the Contract can call this function."
    //     );
    //     _;
    // }
    error NotFactoryAddress();
    modifier factoryAddressOnly() {
        if(
            msg.sender != factoryAddress
        ){
            revert NotFactoryAddress();
        }
        _;
    }

    // function getInvestmentAgentContract() public view returns(address investmentAgentAddress){

    // }

    function addReputation(
        address DAO,
        address member,
        uint256 _earnedTokens
    ) external factoryAddressOnly{
        AllNodesPerformance[DAO][member].earnedToken += _earnedTokens;
        AllNodesPerformance[DAO][member].investmentWeight += _earnedTokens;
    }

    function subtractReputation(
        address DAO,
        address member,
        uint256 _lostTokens
    ) external factoryAddressOnly{
        AllNodesPerformance[DAO][member].lostToken += _lostTokens;
        AllNodesPerformance[DAO][member].investmentWeight = AllNodesPerformance[
            DAO
        ][member].investmentWeight > _lostTokens
            ? AllNodesPerformance[DAO][member].investmentWeight - _lostTokens
            : 0;
    }
}
