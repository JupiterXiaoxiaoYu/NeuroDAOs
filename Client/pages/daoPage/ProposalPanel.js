import React, { Component, useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown'
// import Button from 'react-bootstrap/Button'
import { Form } from "react-bootstrap";
import { Box, Divider, Flex, Heading, SimpleGrid, VStack, Button, Text } from "@chakra-ui/react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Input,
    InputGroup,
    InputLeftAddon
} from '@chakra-ui/react'
import ProposalTable from "./ProposalTable";

const ProposalPanel = ({ appState }) => {

    const [state, setState] = useState({
        ...appState,
        test: 13,
        input: 12,
        value: 0,
        setValue: 0,
        currentActivation: "<select a layer>",
        currentInit: "<select a layer>",
        activations: [
            "linear", "relu"
        ],
        inits: [
            "uniform"
        ],
        currentOpti: "SGD",
        optimizers: [
            "SGD"
        ],
        losses: [
            "Mean Squared Error"
        ],
    });

    const handleChange = (event) => {
        // state.selectedLayer
        state.doSetNumNodes(state.selectedLayer, event.target.value);
        state.hideModelPanel();
    }

    const handleLearningRateChange = (event) => {
        // setState({ unitSliderValue: event.target.value });
        // state.selectedLayer
        state.doSetLearnRate(event.target.value)

    }

    const handleClick = (event) => {
        state.doSetResponsibilityOverlap();
        // alert(state.network.learningRateDecay);
    }

    const getActivation = (selectedLayer) => {
        if (selectedLayer) return selectedLayer.activation;
        else return "";
    }

    const getInit = (selectedLayer) => {
        if (selectedLayer) return selectedLayer.weightInit;
        else return "";
    }

    const handleChangeDAOName = (event) => {
        state.doSetDAOName(event.target.value)
    }
    const handleChangeTokenName = (event) => {
        state.doSetTokenName(event.target.value)
    }
    const handleChangeTokenSymbol = (event) => {
        state.doSetTokenSymbol(event.target.value)
    }
    const handleChangeDAODescription = (event) => {
        state.doSetDAODescription(event.target.value)
    }


    const selectedLayer = state.network.arrLayers[state.selectedLayer];
    // console.log(appState)
    return (
        <Box>
            <ProposalTable appState={appState}/>
        </Box>
    );

}

export default ProposalPanel;
