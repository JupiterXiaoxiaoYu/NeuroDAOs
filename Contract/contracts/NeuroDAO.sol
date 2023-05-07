//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

// import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
// import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "./ProposalVote.sol";
import "./InvestmentAgent.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NeuroDAO is ProposalVote, InvestmentAgent {
    // using EnumerableSet for EnumerableSet.Bytes32Set;
    // using EnumerableSet for EnumerableSet.UintSet;
    // string public realm;
    address public owner;
    string public name;
    string public description_cid;
    address public DAOtokenAddress;
    address public factoryAddress;
    uint8 public layersNum;
    uint8 public inputNodesNum;
    uint8 public hiddenNodesNum;
    uint8 public outputNodesNum;
    bool public responsibilityOverlap;
    //Specifies How many layers of this DAO
    uint8 public constant maxNodesPerLayer = 10;
    mapping(address => uint256) public stakers;

    //Specifies Activation Function
    // bytes32 public constant RELU_ACTIVA

    constructor(
        address _owner,
        string memory _name,
        string memory _description_cid,
        string memory _tokenName,
        string memory _tokenSymbol,
        address _factoryAddress,
        uint8 _layersNum,
        uint8 _inputNodesNum,
        uint8 _hiddenNodesNum,
        uint8 _outputNodesNum,
        bool _responsibilityOverlap
    ) {
        // realm = "dao";
        DAOToken newToken = new DAOToken(_tokenName, _tokenSymbol);
        owner = _owner;
        name = _name;
        description_cid = _description_cid;
        DAOtokenAddress = address(newToken);
        factoryAddress = _factoryAddress;
        layersNum = _layersNum;
        inputNodesNum = _inputNodesNum;
        hiddenNodesNum = _hiddenNodesNum;
        outputNodesNum = _outputNodesNum;
        responsibilityOverlap = _responsibilityOverlap;
    }

    error NotFactoryAddress();
    modifier factoryAddressOnly() {
        if (msg.sender != factoryAddress) {
            revert NotFactoryAddress();
        }
        _;
    }

    error NotSufficientFund();
    modifier SufficientFundOnly(uint256 _fund) {
        if (msg.sender.balance < _fund) {
            revert NotSufficientFund();
        }
        _;
    }

    error NotSufficientStake();
    modifier SufficientStakeOnly(uint256 _stake) {
        if (stakers[msg.sender] < _stake) {
            revert NotSufficientStake();
        }
        _;
    }

    error InputDecisionStage();
    modifier InputDecisionStageOnly(uint256 proposalIndex) {
        if (getCurrentStage(proposalIndex) != ProposalStage.Input) {
            revert InputDecisionStage();
        }
        _;
    }
    error HiddenDecisionStage();
    modifier HiddenDecisionStageOnly(uint256 proposalIndex) {
        if (getCurrentStage(proposalIndex) != ProposalStage.Hidden) {
            revert HiddenDecisionStage();
        }
        _;
    }

    error OutputDecisionStage();
    modifier OutputDecisionStageOnly(uint256 proposalIndex) {
        if (getCurrentStage(proposalIndex) != ProposalStage.Output) {
            revert OutputDecisionStage();
        }
        _;
    }

    error CannotDepositAfterBuyExcuted();
    modifier BeforeBuyExcutedOnly(uint256 proposalIndex) {
        if (proposals[proposalIndex].buyBalance != 0) {
            revert CannotDepositAfterBuyExcuted();
        }
        _;
    }

    function stakeToGetDAOToken(uint256 _amount)
        public
        payable
        memberOnly(msg.sender)
        SufficientFundOnly(_amount)
    {
        payable(address(this)).transfer(_amount.mul(10**18));
        stakers[msg.sender] += _amount;
        DAOToken(DAOtokenAddress).mintTo(msg.sender, _amount.mul(100000));
    }

    using SafeMath for uint256;

    function burnToGetBackFund(uint256 _amount)
        public
        memberOnly(msg.sender)
        SufficientStakeOnly(_amount)
    {
        DAOToken(DAOtokenAddress).burnFrom(msg.sender, _amount.mul(100000));
        stakers[msg.sender] -= _amount;
        _transferFund(payable(msg.sender), _amount.mul(10**18));
    }

    function _transferFund(address payable _address, uint256 _amount)
        internal
        SufficientFundOnly(_amount)
    {
        _address.transfer(_amount);
    }

    function getFundBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function joinAsInput(address node) external factoryAddressOnly {
        inputNodes.push(node);
        inputNodesWeight[node].initialWeight = 1;
    }

    function joinAsHidden(address node) external factoryAddressOnly {
        hiddenNodes.push(node);
        hiddenNodesWeight[node].initialWeight = 1;
    }

    function joinAsOutput(address node) external factoryAddressOnly {
        outputNodes.push(node);
        outputNodesWeight[node].initialWeight = 1;
    }

    function joinAsLP(address node) external factoryAddressOnly {
        lpNodes.push(node);
        lpNodesWeight[node].initialWeight = 1;
    }

    error NotEnoughDeposit();

    function createProposal(
        address _TokenAddress,
        uint256 _deposit,
        uint256 _buyTime,
        uint256 _sellTime,
        uint256 _decisionTimeInMins
    ) public inputNodesOnly(msg.sender) returns (uint256) {
        // require(exchange.available(_TokenAddress), "Token_NOT_FOR_SALE");
        DAOToken DAOTokenContract = DAOToken(DAOtokenAddress);
        if (
            DAOTokenContract.balanceOf(msg.sender) < _deposit || _deposit < 10
        ) {
            revert NotEnoughDeposit();
        }
        DAOTokenContract.transferFrom(msg.sender, address(this), _deposit);
        Proposal storage proposal = proposals[numProposals];
        proposal.TokenAddress = _TokenAddress;
        proposal.totalDeposit += _deposit;
        proposal.decisionTimeInMins = _decisionTimeInMins;
        // Set the proposal's voting deadline to be (current time + 5 minutes)
        proposal.inputVotersDDL = block.timestamp + _decisionTimeInMins;
        proposal.hiddenVotersDDL =
            proposal.inputVotersDDL +
            _decisionTimeInMins;
        proposal.outputVotersDDL =
            proposal.hiddenVotersDDL +
            _decisionTimeInMins;
        proposal.buyTime = _buyTime;
        proposal.executed = false;
        proposal.sellTime = _sellTime;
        proposal.inputVoters[msg.sender].deposit = _deposit;
        proposal.inputVoters[msg.sender].vote = VoteOption.Agree;
        proposal.inputVoters[msg.sender].info = "Create";
        numProposals++;
        return numProposals - 1;
    }

    error NoInfo();
    error Voted();
    error AbstainCannotDeposit();

    function voteOnCreatingProposal(
        uint256 proposalIndex,
        VoteOption _vote,
        uint256 _deposit,
        string memory _info
    )
        public
        activeProposalOnly(proposalIndex)
        inputNodesOnly(msg.sender)
        InputDecisionStageOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];
        // uint256 voterBalance = DAOtoken.balanceOf(msg.sender);
        // require(voterBalance>10, "HOLD_TOKEN_ONLY");
        DAOToken DAOTokenContract = DAOToken(DAOtokenAddress);
        if (DAOTokenContract.balanceOf(msg.sender) < _deposit) {
            revert NotEnoughDeposit();
        }
        if (bytes(proposal.inputVoters[msg.sender].info).length != 0) {
            revert Voted();
        }
        if (bytes(_info).length <= 0) {
            revert NoInfo();
        }
        if (_vote != VoteOption.Abstain) {
            if (_deposit <= 0) {
                revert NotEnoughDeposit();
            }
        } else {
            if (_deposit != 0) {
                revert AbstainCannotDeposit();
            }
        }
        DAOTokenContract.transferFrom(msg.sender, address(this), _deposit);
        proposal.totalDeposit += _deposit;
        proposal.inputVoters[msg.sender].deposit = _deposit;
        proposal.inputVoters[msg.sender].vote = _vote;
        proposal.inputVoters[msg.sender].info = _info;
    }

    function voteOnAnalyzeProposal(
        uint256 proposalIndex,
        VoteOption _vote,
        uint256 _deposit,
        string memory _info
    )
        public
        activeProposalOnly(proposalIndex)
        hiddenNodesOnly(msg.sender)
        HiddenDecisionStageOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];
        // uint256 voterBalance = DAOtoken.balanceOf(msg.sender);
        // require(voterBalance>10, "HOLD_TOKEN_ONLY");
        DAOToken DAOTokenContract = DAOToken(DAOtokenAddress);
        if (DAOTokenContract.balanceOf(msg.sender) < _deposit) {
            revert NotEnoughDeposit();
        }
        if (bytes(proposal.inputVoters[msg.sender].info).length != 0) {
            revert Voted();
        }
        if (bytes(_info).length <= 0) {
            revert NoInfo();
        }
        if (_vote != VoteOption.Abstain) {
            if (_deposit <= 0) {
                revert NotEnoughDeposit();
            }
        } else {
            if (_deposit != 0) {
                revert AbstainCannotDeposit();
            }
        }
        DAOTokenContract.transferFrom(msg.sender, address(this), _deposit);
        proposal.totalDeposit += _deposit;
        proposal.hiddenVoters[msg.sender].deposit = _deposit;
        proposal.hiddenVoters[msg.sender].vote = _vote;
        proposal.hiddenVoters[msg.sender].info = _info;
    }

    function decideOnAnalyzeProposal(
        uint256 proposalIndex,
        VoteOption _vote,
        uint256 _deposit
    )
        public
        // uint8 _investmentPercent,
        // uint256 _buyTime,
        // uint256 _sellTime
        activeProposalOnly(proposalIndex)
        outputNodesOnly(msg.sender)
        OutputDecisionStageOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];
        DAOToken DAOTokenContract = DAOToken(DAOtokenAddress);
        if (DAOTokenContract.balanceOf(msg.sender) < _deposit) {
            revert NotEnoughDeposit();
        }
        if (bytes(proposal.inputVoters[msg.sender].info).length != 0) {
            revert Voted();
        }
        if (_vote != VoteOption.Abstain) {
            if (_deposit <= 0) {
                revert NotEnoughDeposit();
            }
        } else {
            if (_deposit != 0) {
                revert AbstainCannotDeposit();
            }
        }
        DAOTokenContract.transferFrom(msg.sender, address(this), _deposit);
        proposal.totalDeposit += _deposit;
        proposal.outputVoters[msg.sender].deposit = _deposit;
        proposal.outputVoters[msg.sender].vote = _vote;
        // proposal.outputVoters[msg.sender].proposedBuyTime = _buyTime;
        // proposal.outputVoters[msg.sender].proposedSellTime = _sellTime;
        // proposal
        //     .outputVoters[msg.sender]
        //     .investmentPercent = _investmentPercent;
        // uint256 voterBalance = DAOtoken.balanceOf(msg.sender);
        // require(voterBalance>10, "HOLD_TOKEN_ONLY");
    }

    function addFundsToProposal(uint256 proposalIndex, uint256 _deposit)
        public
        payable
        activeProposalOnly(proposalIndex)
        SufficientFundOnly(_deposit)
        lpNodesOnly(msg.sender)
        BeforeBuyExcutedOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];
        payable(address(this)).transfer(_deposit);
        proposal.LPfunds[msg.sender] = _deposit;
        proposal.totalFunds += _deposit;
    }

    error NotReachTheTime();

    function excuteProposalBuy(uint256 proposalIndex)
        public
        activeProposalOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];
        if (block.timestamp < proposal.buyTime) {
            revert NotReachTheTime();
        }
        investInSwapToken(proposal.TokenAddress);
        proposal.buyBalance = address(this).balance;
    }

    function excuteProposalSell(uint256 proposalIndex)
        public
        activeProposalOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];
        if (block.timestamp < proposal.sellTime) {
            revert NotReachTheTime();
        }
        sellSwapToken(proposal.TokenAddress);
        proposal.executed = true;
        proposal.sellBalance = address(this).balance;
        if (proposal.sellBalance < proposal.buyBalance) {
            uint256 lostToken = proposal.buyBalance - proposal.sellBalance;
            subtractReputationToNodes(
                inputNodes,
                hiddenNodes,
                outputNodes,
                lpNodes,
                lostToken,
                proposalIndex
            );
        } else {
            uint256 earnedToken = proposal.sellBalance - proposal.buyBalance;
            addReputationToNodes(
                inputNodes,
                hiddenNodes,
                outputNodes,
                lpNodes,
                earnedToken,
                proposalIndex
            );
        }
    }

    function addReputationToNodes(
        address[] memory _inputNodes,
        address[] memory _hiddenNodes,
        address[] memory _outputNodes,
        address[] memory _lpNodes,
        uint256 _earnedToken,
        uint256 proposalIndex
    ) internal {
        Proposal storage proposal = proposals[proposalIndex];

        for (uint256 i; i < _inputNodes.length; i++) {
            VoteOnInfo memory voteOnInfo = proposal.inputVoters[_inputNodes[i]];
            if (
                voteOnInfo.deposit != 0 &&
                voteOnInfo.vote == VoteOption.Agree
            ) {
                WeightReputation(factoryAddress).addReputation(
                    address(this),
                    _inputNodes[i],
                    _earnedToken
                        .mul(voteOnInfo.deposit)
                        .div(proposal.totalDeposit)
                );
            }
        }
        for (uint256 i; i < _hiddenNodes.length; i++) {
            if (
                proposal.hiddenVoters[_hiddenNodes[i]].deposit != 0 &&
                proposal.hiddenVoters[_hiddenNodes[i]].vote == VoteOption.Agree
            ) {
                WeightReputation(factoryAddress).addReputation(
                    address(this),
                    _hiddenNodes[i],
                    _earnedToken
                        .mul(proposal.hiddenVoters[_hiddenNodes[i]].deposit)
                        .div(proposal.totalDeposit)
                );
            }
        }
        for (uint256 i; i < _outputNodes.length; i++) {
            if (
                proposal.outputVoters[_outputNodes[i]].deposit != 0 &&
                proposal.outputVoters[_outputNodes[i]].vote == VoteOption.Agree
            ) {
                WeightReputation(factoryAddress).addReputation(
                    address(this),
                    _outputNodes[i],
                    _earnedToken
                        .mul(proposal.outputVoters[_outputNodes[i]].deposit)
                        .div(proposal.totalDeposit)
                );
            }
        }
        for (uint256 i; i < _lpNodes.length; i++) {
            if (proposal.LPfunds[_lpNodes[i]] != 0) {
                WeightReputation(factoryAddress).addReputation(
                    address(this),
                    _lpNodes[i],
                    _earnedToken
                        .mul(proposal.LPfunds[_lpNodes[i]])
                        .div(proposal.totalFunds)
                        .mul(1000)
                );
            }
        }
    }

    function subtractReputationToNodes(
        address[] memory _inputNodes,
        address[] memory _hiddenNodes,
        address[] memory _outputNodes,
        address[] memory _lpNodes,
        uint256 _lostToken,
        uint256 proposalIndex
    ) internal {
        Proposal storage proposal = proposals[proposalIndex];
        for (uint256 i; i < _inputNodes.length; i++) {
            VoteOnInfo memory voteOnInfo = proposal.inputVoters[_inputNodes[i]];
            if (
                voteOnInfo.deposit != 0 &&
                voteOnInfo.vote == VoteOption.Aginst
            ) {
                WeightReputation(factoryAddress).subtractReputation(
                    address(this),
                    _inputNodes[i],
                    _lostToken
                        .mul(voteOnInfo.deposit)
                        .div(proposal.totalDeposit)
                );
            }
        }
        for (uint256 i; i < _hiddenNodes.length; i++) {
            if (
                proposal.hiddenVoters[_hiddenNodes[i]].deposit != 0 &&
                proposal.hiddenVoters[_hiddenNodes[i]].vote == VoteOption.Aginst
            ) {
                WeightReputation(factoryAddress).subtractReputation(
                    address(this),
                    _hiddenNodes[i],
                    _lostToken
                        .mul(proposal.hiddenVoters[_hiddenNodes[i]].deposit)
                        .div(proposal.totalDeposit)
                );
            }
        }
        for (uint256 i; i < _outputNodes.length; i++) {
            if (
                proposal.outputVoters[_outputNodes[i]].deposit != 0 &&
                proposal.outputVoters[_outputNodes[i]].vote == VoteOption.Aginst
            ) {
                WeightReputation(factoryAddress).subtractReputation(
                    address(this),
                    _outputNodes[i],
                    _lostToken
                        .mul(proposal.outputVoters[_outputNodes[i]].deposit)
                        .div(proposal.totalDeposit)
                );
            }
        }
        for (uint256 i; i < _lpNodes.length; i++) {
            if (proposal.LPfunds[_lpNodes[i]] != 0) {
                WeightReputation(factoryAddress).subtractReputation(
                    address(this),
                    _lpNodes[i],
                    _lostToken
                        .mul(proposal.LPfunds[_lpNodes[i]])
                        .div(proposal.totalFunds)
                        .mul(100)
                );
            }
        }
    }

    function modifySwapAddress(address _swapAddress)
        public
        memberOnly(msg.sender)
    {
        swapAddress = _swapAddress;
    }
}
