import React, { Component } from "react";
import { Box, Divider, Flex, Heading, SimpleGrid, VStack, Text, Button } from "@chakra-ui/react";
import { Web3Button } from "@thirdweb-dev/react";

class ConfirmPanel extends Component {
    constructor(props) {
        super(props);
    }

    // handleEpochChange(event) {
    //     this.props.appState.doSetEpochs(event.target.value)
    // }

    // handleBatchChange(event) {
    //     this.props.appState.doSetBatchSize(event.target.value)
    // }

    render() {
        return (
            <Box>
                <Box mb="1rem" />
                <Text>{`Nodes of Input Layer: ${this.props.appState.network.arrLayers[0].numNodes} (Who responsible for Information Collection and Verification)`}</Text>
                <Text>{`Nodes of Hidden Layer: ${this.props.appState.network.arrLayers.slice(1, -1).reduce((acc, layer) => {
                    return parseInt(parseInt(acc) + parseInt(layer.numNodes));
                }, 0)} (Who responsible for Information Processing and Analyzing)`}</Text>
                <Text>{`Nodes of Output Layer: ${this.props.appState.network.arrLayers[this.props.appState.network.arrLayers.length - 1].numNodes} (Who responsible for Final Investment Decision Making)`}</Text>
                <Text>{`Total Nodes Positions: ${this.props.appState.network.arrLayers.reduce((acc, layer) => {
                    return parseInt(parseInt(acc) + parseInt(layer.numNodes));
                }, 0)}`}</Text>
                <Web3Button
                    contractAddress="0x..." // Your smart contract address
                    contractAbi={[{ }]}
                    action={async (contract) => {
                        await someAction(contract);
                    }}
                    className="btn"
                >
                    Confirm Creating DAO
                </Web3Button>
            </Box>
        );
    }
}

export default ConfirmPanel;