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

const ProposalTable = (contractAddressdata) => {
    const [buyTime, setBuyTime] = useState(new Date());
    const [sellTime, setSellTime] = useState(new Date());
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSubmit = (e) => {
        e.preventDefault();
        // 你可以在这里执行表单提交的操作，比如调用合约函数等
        onClose();
    };
    const sdk = useSDK();

    const getProposals = async () => {
        const DAOContract = await sdk.getContract(
            contractAddressdata, // The address of your smart contract
            abi, // The ABI of your smart contract
        );

        const data = await DAOContract.call(
            "numProposals", // Name of your function as it is on the smart contract
            // Arguments to your function, in the same order they are on your smart contract
            // [
            //   "arg1", // e.g. Argument 1
            // ],
        );
        console.log(data)
    }

    useEffect(() => {
        getProposals()
    }, [])

    return (
        <Box overflowX="auto">
            <Box mb="1rem" />
            <Button backgroundColor={'green.400'} onClick={onOpen}>
                {`Create a Proposal`}
            </Button>
            <Box mb="1rem" />
            <Modal isOpen={isOpen} onClose={onClose} colorScheme={'black'} >
                <ModalOverlay />
                <ModalContent color={'black'}>
                    <ModalHeader color={'black'}>Create Proposal</ModalHeader>
                    <ModalBody>
                        <FormControl >
                            <FormLabel>Token Address for Investment</FormLabel>
                            <Input />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Buy Time</FormLabel>
                            <DatePicker
                                selected={buyTime}
                                onChange={(date) => setBuyTime(date)}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Sell Time</FormLabel>
                            <DatePicker
                                selected={sellTime}
                                onChange={(date) => setSellTime(date)}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Deposit</FormLabel>
                            <Input type="number" />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Decision Time In Mins</FormLabel>
                            <Select>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </Select>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Create
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Table variant="simple">
                <thead>
                    <Tr>
                        <Td>Targeted TokenAddress</Td>
                        <Td>Total Deposit</Td>
                        <Td>Planned BuyTime</Td>
                        <Td>Planned SellTime</Td>
                        <Td>Decision Stage Period</Td>
                        <Td>Actions</Td>
                    </Tr>
                </thead>
                <Tbody>
          {/* {proposals.map((proposal, index) => ( */}
            <Tr >
              <Td>{0xC44096976C7aD81ECc5F8943B27E380d8b378C6f}</Td>
              <Td>{10023}</Td>
              <Td>{`2023/5/9`}</Td>
              <Td>{`2023/5/15`}</Td>
              <Td>{`15 mins`}</Td>
              <Td>
                <Button size="sm" onClick={onOpen}>
                  View
                </Button>
              </Td>
            </Tr>
          {/* ))} */}
        </Tbody>
            </Table>
        </Box>
    );
};

export default ProposalTable;