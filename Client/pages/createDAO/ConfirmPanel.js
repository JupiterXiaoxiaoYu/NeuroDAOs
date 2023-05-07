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
    const { contract } = useContract("0x201e479D966a08f2B0E9c886c9cb9E3e5c1d0A65");
    const { mutateAsync: createFansDAOContract, isLoading } = useContractWrite(contract, "createFansDAOContract")
    // const [alertState, setAlertState] = useState('success');

    const callCreateDAO = async () => {
        try {
            const data = await createFansDAOContract({ args: [props.appState.DAOName, props.appState.DAODescription, props.appState.TokenName, props.appState.TokenSymbol] });
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
            <Text>{`Nodes of Input Layer: ${props.appState.network.arrLayers[0].numNodes} (Who responsible for Information Collection and Verification)`}</Text>
            <Text>{`Nodes of Hidden Layer: ${props.appState.network.arrLayers.slice(1, -1).reduce((acc, layer) => {
                return parseInt(parseInt(acc) + parseInt(layer.numNodes));
            }, 0)} (Who responsible for Information Processing and Analyzing)`}</Text>
            <Text>{`Nodes of Output Layer: ${props.appState.network.arrLayers[props.appState.network.arrLayers.length - 1].numNodes} (Who responsible for Final Investment Decision Making)`}</Text>
            <Text>{`Total Nodes Positions: ${props.appState.network.arrLayers.reduce((acc, layer) => {
                return parseInt(parseInt(acc) + parseInt(layer.numNodes));
            }, 0)}`}</Text>
            <Button backgroundColor={'green.400'} onClick={callCreateDAO} disabled={isLoading}>
                Create DAO
            </Button>
        </Box>
    );
}

export default ConfirmPanel;