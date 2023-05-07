import React, { Component, useState } from "react";
import { Box, Divider, Flex, Heading, SimpleGrid, VStack, Text, Button } from "@chakra-ui/react";
import { Web3Button, useContract, useContractWrite, useContractRead } from "@thirdweb-dev/react";
import { useSDK } from "@thirdweb-dev/react";
import { abi } from "./NeuroDAO.json";

const RolesMembersPanel = ({ appState }) => {
    // handleEpochChange(event) {
    //     appState.doSetEpochs(event.target.value)
    // }

    // handleBatchChange(event) {
    //     appState.doSetBatchSize(event.target.value)
    // }
    // console.log('=====', appState)
    const sdk = useSDK();

    const { contract } = useContract("0x01b64C824C34Acb75d62CAceeb186220685c2e24");
    const { mutateAsync: joinDAOAsInput, isLoading } = useContractWrite(contract, "joinDAOAsInput")
    // const [alertState, setAlertState] = useState('success');
    console.log(appState)

    // const DAOContract = sdk.getContract(
    //     contractAddressdata, // The address of your smart contract
    //     abi, // The ABI of your smart contract
    // );

    const callJoinDAO = async () => {
        if (!isContractAddressDataLoading) {
            try {
                const hiddenNodesNum = appState.network.arrLayers.slice(1, -1).reduce((acc, layer) => {
                    return parseInt(parseInt(acc) + parseInt(layer.numNodes))
                }, 0);
                // console.log({
                //     args: [appState.DAOName, appState.DAODescription, appState.TokenName, appState.TokenSymbol, appState.network.arrLayers.length, appState.network.arrLayers[0].numNodes, hiddenNodesNum, appState.network.arrLayers[appState.network.arrLayers.length - 1].numNodes, appState.responsibilityOverlap]
                // })
                console.log(hiddenNodesNum);
                const data = await joinDAOAsInput({
                    args: [contractAddressdata]
                });
                console.info("contract call successs", data);
                appState.doPrompt({ description: 'Your has sucessfully joined the DAO!', status: 'success' });
            } catch (err) {
                console.error("contract call failure", err);
                appState.doPrompt({ description: 'Join DAO failed', status: 'error' });
            }
        }
    }



    return (
        <Box>
            <Box mb="1rem" />
            <Button backgroundColor={'green.400'} onClick={callJoinDAO} disabled={isLoading}>
                {`Join DAO As ${appState.selectedLayer == 0 ? 'Input' : appState.selectedLayer == appState.network.arrLayers.length - 1 ? 'Output' : 'Hidden'} Nodes`}
            </Button>
            <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Nodes of Input Layer: ${appState.network.arrLayers[0].numNodes} (Who responsible for Information Collection and Verification)`}</Text>
            <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Nodes of Hidden Layer: ${appState.network.arrLayers.slice(1, -1).reduce((acc, layer) => {
                return parseInt(parseInt(acc) + parseInt(layer.numNodes));
            }, 0)} (Who responsible for Information Processing and Analyzing)`}</Text>
            <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Nodes of Output Layer: ${appState.network.arrLayers[appState.network.arrLayers.length - 1].numNodes} (Who responsible for Final Investment Decision Making)`}</Text>
            <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Total Nodes Positions: ${appState.network.arrLayers.reduce((acc, layer) => {
                return parseInt(parseInt(acc) + parseInt(layer.numNodes));
            }, 0)}`}</Text>
            <Box mb="1rem" />

        </Box>
    );
}

export default RolesMembersPanel;