import React, { Component, useEffect, useState } from "react";
import { Box, Divider, Flex, Heading, SimpleGrid, VStack, Text, Button } from "@chakra-ui/react";
import { Web3Button, useContract, useContractWrite, useContractRead } from "@thirdweb-dev/react";
import { useSDK } from "@thirdweb-dev/react";
import { abi } from "./NeuroDAO.json";
import { set } from "react-hook-form";

const RolesMembersPanel = ({ appState }) => {
    // handleEpochChange(event) {
    //     appState.doSetEpochs(event.target.value)
    // }

    // handleBatchChange(event) {
    //     appState.doSetBatchSize(event.target.value)
    // }
    // console.log('=====', appState)
    const sdk = useSDK();

    const { contract } = useContract("0x3BC8C4BAE74D5A0fc4a8E4494b73f46c2103cd12");
    const { mutateAsync: joinDAOAsInput, isLoading } = useContractWrite(contract, "joinDAOAsInput")
    // const [alertState, setAlertState] = useState('success');
    console.log(appState)

    const [inputNodes, setInputNodes] = useState([]);
    const [hiddenNodes, setHiddenNodes] = useState([]);
    const [outputNodes, setOutputNodes] = useState([]);
    const [lpNodes, setLPNodes] = useState([]);

    useEffect(() => {
        if(!appState.contract) return
        async function getNodes() {
            const input = await appState.contract.call("getInputNodes")
            const hidden = await appState.contract.call("getHiddenNodes")
            const output = await appState.contract.call("getOutputNodes")
            const lp = await appState.contract.call("getLPNodes")
            setInputNodes(input)
            setHiddenNodes(hidden)
            setOutputNodes(output)
            setLPNodes(lp)
        }
        getNodes()
    }, [appState.contract])

    // const DAOContract = sdk.getContract(
    //     contractAddressdata, // The address of your smart contract
    //     abi, // The ABI of your smart contract
    // );

    const callJoinDAO = async () => {
            try {
                const hiddenNodesNum = appState.network.arrLayers.slice(1, -1).reduce((acc, layer) => {
                    return parseInt(parseInt(acc) + parseInt(layer.numNodes))
                }, 0);
                // console.log({
                //     args: [appState.DAOName, appState.DAODescription, appState.TokenName, appState.TokenSymbol, appState.network.arrLayers.length, appState.network.arrLayers[0].numNodes, hiddenNodesNum, appState.network.arrLayers[appState.network.arrLayers.length - 1].numNodes, appState.responsibilityOverlap]
                // })
                // console.log(hiddenNodesNum);
                const data = await joinDAOAsInput({
                    args: [appState.contractAddress]
                });
                console.info("contract call successs", data);
                appState.doPrompt({ description: 'Your has sucessfully joined the DAO!', status: 'success' });
            } catch (err) {
                console.error("contract call failure", err);
                appState.doPrompt({ description: 'Join DAO failed', status: 'error' });
            }
    }



    return (
        <Box>
            <Box mb="1rem" />
            <Button backgroundColor={'green.400'} onClick={callJoinDAO} disabled={isLoading}>
                {`Join DAO As ${appState.selectedLayer == 0 ? 'Input' : appState.selectedLayer == appState.network.arrLayers.length - 1 ? 'Output' : 'Hidden'} Nodes`}
            </Button>
            <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Nodes of Input Layer: ${inputNodes.length} /${appState.network.arrLayers[0].numNodes} (Who responsible for Information Collection and Verification)`}</Text>
            <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Nodes of Hidden Layer: ${hiddenNodes.length} /${appState.network.arrLayers.slice(1, -1).reduce((acc, layer) => {
                return parseInt(parseInt(acc) + parseInt(layer.numNodes));
            }, 0)} (Who responsible for Information Processing and Analyzing)`}</Text>
            <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Nodes of Output Layer: ${outputNodes.length} /${appState.network.arrLayers[appState.network.arrLayers.length - 1].numNodes} (Who responsible for Final Investment Decision Making)`}</Text>
            <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Nodes of Output Layer: ${lpNodes.length} (Who only invest funds into the proposal)`}</Text>
            <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Total Decisional Nodes Positions: ${appState.network.arrLayers.reduce((acc, layer) => {
                return parseInt(parseInt(acc) + parseInt(layer.numNodes));
            }, 0)}`}</Text>
            <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Total Nodes: ${inputNodes.length + hiddenNodes.length + outputNodes.length + lpNodes.length}`}</Text>
            <Box mb="1rem" />

        </Box>
    );
}

export default RolesMembersPanel;