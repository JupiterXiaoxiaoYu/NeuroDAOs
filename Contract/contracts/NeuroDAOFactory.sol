// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;
import "./NeuroDAO.sol";

contract NeuroDAOFactory {
    // Mapping from contract addresses to their associated data
    // mapping(address => DAOData) public NeuroDAOsData;
    address[] public contracts;
    // address ReputationContract;
    address WeightReputationContract;
    address InvestmentAgentContract;
    // Struct to store the data for a deployed contract
    struct DAOData {
        address TokenAddress;
        string name;
        string description_cid;
    }

    uint256 public numberOfDAOs = 0;

    constructor(){
        WeightReputationContract = address(new WeightReputation(address(this)));
        // ReputationContract = address(WeightReputation);
    }

    // Function to deploy a new contract instance
    error NotValidNetworkParameter();
    function createNeuroDAOContract(
        string memory _name,
        string memory _description_cid,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _layersNum,
        uint8 _inputNodesNum,
        uint8 _hiddenNodesNum,
        uint8 _outputNodesNum,
        bool _responsibilityOverlap
    ) public returns (address) {
        if(_layersNum<3 || _layersNum>5 || _inputNodesNum>10 || _hiddenNodesNum>10 || _outputNodesNum>10){
            revert NotValidNetworkParameter();
        }
        // uint256 _id = numberOfDAOs;
        NeuroDAO newDAO = new NeuroDAO(
            msg.sender,
            _name,
            _description_cid,
            _tokenName,
            _tokenSymbol,
            address(this),
            _layersNum,
            _inputNodesNum,
            _hiddenNodesNum,
            _outputNodesNum,
            _responsibilityOverlap
        );
        address _address = address(newDAO);
        contracts.push(_address);
        numberOfDAOs++;
        return _address;
    }

    // function get_DAOs() public view returns (DAOData[] memory) {
    //     DAOData[] memory allDAOs = new DAOData[](numberOfDAOs);
    //     for (uint256 i = 0; i < numberOfDAOs; i++) {
    //         NeuroDAO dao= NeuroDAO(payable(address(uint160(contracts[i]))));
    //         allDAOs[i].name = dao.name();
    //         allDAOs[i].description_cid = dao.description_cid();
    //         allDAOs[i].TokenAddress = dao.DAOtokenAddress();
    //     }
    //     return allDAOs;
    // }

    function joinDAOAsInput(address payable DAOAddress) public {
        NeuroDAO(DAOAddress).joinAsInput(msg.sender);
    }

    function joinDAOAsHidden(address payable DAOAddress) public {
        NeuroDAO(DAOAddress).joinAsHidden(msg.sender);
    }

    function joinDAOAsOutput(address payable DAOAddress) public {
        NeuroDAO(DAOAddress).joinAsOutput(msg.sender);
    }

    function joinDAOAsLp(address payable DAOAddress) public {
        NeuroDAO(DAOAddress).joinAsLP(msg.sender);
    }
}
