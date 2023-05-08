import React, { useEffect, useState } from "react";
import {
    Table,
    Tbody,
    Tr,
    Td,
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    Textarea,
    Select,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSDK } from "@thirdweb-dev/react";
import { abi } from "./NeuroDAO.json";
import { Web3Button, useContract, useContractWrite, useContractRead } from "@thirdweb-dev/react";
import ProposalCard from "./ProposalCard";

const ProposalTable = ({appState}) => {
    // console.log(appState)
    const [buyTime, setBuyTime] = useState(new Date());
    const [sellTime, setSellTime] = useState(new Date());
    const [proposals, setProposals] = useState([]);
    const [tokenAddress, setTokenAddress] = useState("");
    const [deposit, setDeposit] = useState("");
    const [decisionTime, setDecisionTime] = useState("");
    // const [description, setDescription] = useState("");
    const [proposalId, setProposalId] = useState("");
    const [contractAddress, setContractAddress] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure();

    // console.log(props.contractAddressData)
    const sdk = useSDK();

    useEffect(() => {
        setContractAddress(appState.contractAddressData)
        console.log(appState.contractAddressData)
    }, [appState.contractAddressData])


    const handleSubmit = async () => {
        // 获取表单输入的值
        // console.log(e.target)
        // console.log(contractAddress)
        console.log(tokenAddress, deposit, (buyTime.getTime() / 1000).toFixed(0), (sellTime.getTime() / 1000).toFixed(0), (decisionTime * 60).toString())
        const data = await appState.contract.call(
            "createProposal", // Name of your function as it is on the smart contract
            // Arguments to your function, in the same order they are on your smart contract
            [
                tokenAddress, deposit.toString(), (buyTime.getTime() / 1000).toFixed(0), (sellTime.getTime() / 1000).toFixed(0), (decisionTime * 60).toString()
            ],
        );
        console.log(data)
        // const tokenAddress = e.target.elements.tokenAddress.value;
        // const deposit = e.target.elements.deposit.value;
        // const decisionTime = e.target.elements.decisionTime.value;
        // const description = e.target.elements.description.value;

        // // 调用合约函数
        // const createProposal = useContractWrite({
        //   contractAddress: contractAddressdata,
        //   contractFunction: "createProposal",
        //   inputs: [tokenAddress, buyTime.getTime() / 1000, sellTime.getTime() / 1000, deposit, decisionTime * 60, description],
        // });

        // console.log(tokenAddress, buyTime.getTime() / 1000, sellTime.getTime() / 1000, deposit, decisionTime * 60, description)

        // createProposal().then(() => {
        //   onClose();
        //   // 刷新数据
        //   getProposals();
        // });
    };

    // const getProposals = async () => {

    //     console.log(props.contractAddressdata)
    //     const DAOContract = await sdk.getContract(
    //         contractAddress, // The address of your smart contract
    //         abi, // The ABI of your smart contract
    //     );
    //     const data = await DAOContract.call(
    //         "numProposals", // Name of your function as it is on the smart contract
    //         // Arguments to your function, in the same order they are on your smart contract
    //         // [
    //         //   "arg1", // e.g. Argument 1
    //         // ],
    //     );
    //     console.log(data)
    // }

    // useEffect(() => {
    //         getProposals().then(() => {
    //             console.log('data')
    //         })

    // }, [props.contractAddressdata])

    // useEffect(() => {
    //     console.log(buyTime)
    // }, [buyTime])

    // useEffect(() => {
    //     console.log(sellTime)
    // }, [sellTime])

    const handleFund = () => {
        // handle fund action
    };

    const handleVote = () => {
        // handle vote action
    };

    return (
        <Box overflowX="auto">
            <Box mb="1rem" />
            <Button backgroundColor={'green.400'} onClick={onOpen} isLoading={!!appState.contractAddressdata}>
                {`Create a Proposal`}
            </Button>
            <Box mb="1rem" />
            <Modal isOpen={isOpen} onClose={onClose} colorScheme={'black'} >
                <ModalOverlay />
                <ModalContent color={'black'}>
                    <ModalHeader color={'black'}>Create Proposal</ModalHeader>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Token Address for Investment</FormLabel>
                            <Input name="tokenAddress" onChange={(event) => setTokenAddress(event.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Buy Time</FormLabel>
                            <DatePicker
                                selected={buyTime}
                                minDate={new Date()}
                                onChange={(date) => {
                                    setBuyTime(date);
                                    if (date > sellTime) {
                                        setSellTime(date);
                                    }
                                }}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Sell Time</FormLabel>
                            <DatePicker
                                selected={sellTime}
                                minDate={buyTime}
                                onChange={(date) => setSellTime(date)}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Deposit</FormLabel>
                            <Input type="number" name="deposit" onChange={(event) => setDeposit(event.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Decision Time In Mins</FormLabel>
                            <Select name="decisionTime" onChange={(event) => setDecisionTime(event.target.value)}>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </Select>
                        </FormControl>
                        {/* <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea name="description" onChange={(event) => setDescription(event.target.value)
                            }/>
                        </FormControl> */}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Create
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <ProposalCard
                tokenAddress="0xC44096976C7aD81ECc5F8943B27E380d8b378C6f"
                totalDeposit={10023}
                totalFunds={12}
                plannedBuyTime="2023/5/9"
                plannedSellTime="2023/5/15"
                decisionStagePeriod="15 mins"
                currentStage="waitForBuy"
                onFund={handleFund}
                onVote={handleVote}
            />

        </Box>
    );
};

export default ProposalTable;