import React, { Component, useState } from "react";
import { Box, Divider, Flex, Heading, SimpleGrid, VStack, Text, Button } from "@chakra-ui/react";
import { Web3Button, useContract, useContractWrite } from "@thirdweb-dev/react";

const ConfirmPanel = (props) => {
    // handleEpochChange(event) {
    //     props.appState.doSetEpochs(event.target.value)
    // }

    // handleBatchChange(event) {
    //     props.appState.doSetBatchSize(event.target.value)
    // }
    // console.log('=====', props.appState)
    const { contract } = useContract("0x01b64C824C34Acb75d62CAceeb186220685c2e24");
    const { mutateAsync: createNeuroDAOContract, isLoading } = useContractWrite(contract, "createNeuroDAOContract")
    // const [alertState, setAlertState] = useState('success');

    const callCreateDAO = async () => {
        try {

            const hiddenNodesNum = props.appState.network.arrLayers.slice(1, -1).reduce((acc, layer) => {
                return parseInt(parseInt(acc) + parseInt(layer.numNodes))
            }, 0);
            // console.log({
            //     args: [props.appState.DAOName, props.appState.DAODescription, props.appState.TokenName, props.appState.TokenSymbol, props.appState.network.arrLayers.length, props.appState.network.arrLayers[0].numNodes, hiddenNodesNum, props.appState.network.arrLayers[props.appState.network.arrLayers.length - 1].numNodes, props.appState.responsibilityOverlap]
            // })
            console.log(hiddenNodesNum);
            const data = await createNeuroDAOContract({
                args: [props.appState.DAOName, props.appState.DAODescription, props.appState.TokenName, props.appState.TokenSymbol, props.appState.network.arrLayers.length, props.appState.network.arrLayers[0].numNodes, hiddenNodesNum, props.appState.network.arrLayers[props.appState.network.arrLayers.length - 1].numNodes, props.appState.responsibilityOverlap]
            });
            console.info("contract call successs", data);
            props.appState.doPrompt({ description: 'Your DAO has been created!', status: 'success' });
        } catch (err) {
            console.error("contract call failure", err);
            props.appState.doPrompt({ description: 'DAO Creation failed', status: 'error' });
        }
    }



    return (
        <Box>
            <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Nodes of Input Layer: ${props.appState.network.arrLayers[0].numNodes} (Who responsible for Information Collection and Verification)`}</Text>
            <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Nodes of Hidden Layer: ${props.appState.network.arrLayers.slice(1, -1).reduce((acc, layer) => {
                return parseInt(parseInt(acc) + parseInt(layer.numNodes));
            }, 0)} (Who responsible for Information Processing and Analyzing)`}</Text>
                        <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Nodes of Output Layer: ${props.appState.network.arrLayers[props.appState.network.arrLayers.length - 1].numNodes} (Who responsible for Final Investment Decision Making)`}</Text>
            <Box mb="1rem" />
            <Text fontWeight={'semibold'}>{`Total Nodes Positions: ${props.appState.network.arrLayers.reduce((acc, layer) => {
                return parseInt(parseInt(acc) + parseInt(layer.numNodes));
            }, 0)}`}</Text>
            <Box mb="1rem" />
            <Button backgroundColor={'green.400'} onClick={callCreateDAO} disabled={isLoading}>
                Create DAO
            </Button>
        </Box>
    );
}

export default ConfirmPanel;