//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "./NodeMember.sol";

contract ProposalVote is NodeMember {
    struct Proposal {
        // TokenAddress - the tokenID to purchase if the proposal passes
        address TokenAddress;
        // deadline - the UNIX timestamp until which this proposal is active. Proposal can be executed after the deadline has been exceeded.
        uint256 buyTime;
        uint256 sellTime;
        uint256 buyBalance;
        uint256 sellBalance;
        uint256 inputVotersDDL;
        uint256 hiddenVotersDDL;
        uint256 outputVotersDDL;
        uint256 totalDeposit;
        uint256 totalFunds;
        uint256 decisionTimeInMins;
        // executed - whether or not this proposal has been executed yet. Cannot be executed before the deadline has been exceeded.
        bool executed;
        mapping(address => VoteOnInfo) inputVoters;
        mapping(address => VoteOnInfo) hiddenVoters;
        mapping(address => VoteOnDecision) outputVoters;
        mapping(address => uint256) LPfunds;
    }

    struct VoteOnInfo {
        uint256 deposit;
        VoteOption vote;
        string info;
    }

    struct VoteOnDecision {
        uint256 deposit;
        VoteOption vote;
        // uint256 proposedBuyTime;
        // uint256 proposedSellTime;
        // uint8 investmentPercent;
    }

    mapping(uint256 => Proposal) public proposals;

    uint256 public numProposals;

    enum VoteOption {
        Agree, // YES = 0
        Aginst, // NO = 1
        Abstain
    }

    enum ProposalStage {
        Input,
        Hidden,
        Output,
        WaitForBuyStart,
        ExecuteBuy,
        WaitForSellStart,
        ExecuteSell,
        Executed
    }

    error NotActiveProposal();
    modifier activeProposalOnly(uint256 proposalIndex) {
        if (proposals[proposalIndex].executed != false) {
            revert NotActiveProposal();
        }
        _;
    }

    receive() external payable {
        // emit event
    }


    function calculateInputVoters(uint256 proposalIndex)
        public
        view
        memberOnly(msg.sender)
        returns (int256)
    {
        int256 totalScore = 0;
        for (uint256 i = 0; i < inputNodes.length; i++) {
            address inputNode = inputNodes[i];
            Proposal storage proposal = proposals[proposalIndex];
            proposal.inputVoters[inputNode].deposit;
            if (proposal.inputVoters[inputNode].vote == VoteOption.Agree) {
                totalScore += int256(
                    proposal.inputVoters[inputNode].deposit *
                        inputNodesWeight[inputNode].initialWeight
                );
            } else {
                if (proposal.inputVoters[inputNode].vote == VoteOption.Aginst) {
                    totalScore -= int256(
                        proposal.inputVoters[inputNode].deposit *
                            inputNodesWeight[inputNode].initialWeight
                    );
                }
            }
        }
        return totalScore;
    }

    function calculateHiddenVoters(uint256 proposalIndex)
        public
        view
        memberOnly(msg.sender)
        returns (int256)
    {
        int256 totalScore = 0;
        for (uint256 i = 0; i < hiddenNodes.length; i++) {
            address hiddenNode = hiddenNodes[i];
            Proposal storage proposal = proposals[proposalIndex];
            proposal.hiddenVoters[hiddenNode].deposit;
            if (proposal.hiddenVoters[hiddenNode].vote == VoteOption.Agree) {
                totalScore += int256(
                    proposal.hiddenVoters[hiddenNode].deposit *
                        hiddenNodesWeight[hiddenNode].initialWeight
                );
            } else {
                if (
                    proposal.hiddenVoters[hiddenNode].vote == VoteOption.Aginst
                ) {
                    totalScore -= int256(
                        proposal.hiddenVoters[hiddenNode].deposit *
                            hiddenNodesWeight[hiddenNode].initialWeight
                    );
                }
            }
        }
        return totalScore;
    }

    function calculateOutputVoters(uint256 proposalIndex)
        public
        view
        memberOnly(msg.sender)
        returns (int256)
    {
        int256 totalScore = 0;
        for (uint256 i = 0; i < outputNodes.length; i++) {
            address outputNode = outputNodes[i];
            Proposal storage proposal = proposals[proposalIndex];
            proposal.outputVoters[outputNode].deposit;
            if (proposal.outputVoters[outputNode].vote == VoteOption.Agree) {
                totalScore += int256(
                    proposal.outputVoters[outputNode].deposit *
                        outputNodesWeight[outputNode].initialWeight
                );
            } else {
                if (
                    proposal.outputVoters[outputNode].vote == VoteOption.Aginst
                ) {
                    totalScore -= int256(
                        proposal.outputVoters[outputNode].deposit *
                            outputNodesWeight[outputNode].initialWeight
                    );
                }
            }
        }
        return totalScore;
    }

    function getCurrentStage(uint256 proposalIndex)
        public
        view
        returns (ProposalStage stage)
    {
        if (proposals[proposalIndex].inputVotersDDL > block.timestamp) {
            return ProposalStage.Input;
        }
        if (proposals[proposalIndex].hiddenVotersDDL > block.timestamp) {
            return ProposalStage.Hidden;
        }
        if (proposals[proposalIndex].outputVotersDDL > block.timestamp) {
            return ProposalStage.Output;
        }
        if (proposals[proposalIndex].buyTime > block.timestamp) {
            return ProposalStage.WaitForBuyStart;
        }
        if (proposals[proposalIndex].buyTime < block.timestamp && proposals[proposalIndex].buyBalance == 0) {
            return ProposalStage.ExecuteBuy;
        }
        if (proposals[proposalIndex].buyBalance != 0 && proposals[proposalIndex].sellTime > block.timestamp) {
            return ProposalStage.WaitForSellStart;
        }
        if (proposals[proposalIndex].sellTime < block.timestamp) {
            return ProposalStage.ExecuteSell;
        }
        if (proposals[proposalIndex].executed){
            return ProposalStage.Executed;
        }

    }
}
