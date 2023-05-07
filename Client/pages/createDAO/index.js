import React, { Component, useState } from 'react';
import JSide from "./JSide.js";
import { network, layer } from "../panels/kerasCode.js";
import ModelPanel from "./ModelPanel.js"
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
//import {NetworkGraph} from "./ModelPanel.js"
import { Box, Divider, Flex, Alert, AlertIcon, AlertDescription, CloseButton, AlertTitle, useDisclosure } from "@chakra-ui/react";

const CreateDAO = ({ appState }) => {
    const [state, setState] = useState({
        ...appState,
        hiddenModelPanel: false,
        hideModelPanel: () => setState(prevState => ({ ...prevState, hiddenModelPanel: true })),
        unhideModelPanel: () => setState(prevState => ({ ...prevState, hiddenModelPanel: false })),
        network: new network(),
        selectedLayer: 0,
        selectedNode: 0,
        responsibilityOverlap: false,
        DAOName: '',
        TokenName: '',
        TokenSymbol: '',
        DAODescription: '',
        coloredLayer: undefined,
        coloredNode: undefined,
        promptStatus: 'success',
        propmtDescription: 'Your DAO has been created!',
        doSetDAOName: new_name => setState(prevState => ({ ...prevState, DAOName: new_name })),
        doSetTokenName: new_name => setState(prevState => ({ ...prevState, TokenName: new_name })),
        doSetTokenSymbol: new_symbol => setState(prevState => ({ ...prevState, TokenSymbol: new_symbol })),
        doSetDAODescription: new_description => setState(prevState => ({ ...prevState, DAODescription: new_description })),
        doSetResponsibilityOverlap: () => setState(prevState => ({ ...prevState, responsibilityOverlap: !prevState.responsibilityOverlap })),
        doSelectLayer: selected_layer => doSelectLayer(selected_layer),
        doSelectNode: selected_node => doSelectNode(selected_node),
        doColorNode: hoverednode => doColorNode(hoverednode),
        doColorLayer: hoveredlayer => doColorLayer(hoveredlayer),
        doAddLayer: () => doAddLayer(),
        doRemoveLayer: removeLayer => doRemoveLayer(removeLayer),
        doSetOptimizer: new_opt => doSetOptimizer(new_opt),
        doSetActivation: (layer, new_act) => doSetActivation(layer, new_act),
        doSetWeightInit: (layer, new_weight) => doSetWeightInit(layer, new_weight),
        doSetNumNodes: (layer, new_nodes) => doSetNumNodes(layer, new_nodes),
        doSetLearnRate: (new_learn) => doSetLearnRate(new_learn),
        // doSetEpochs: (new_epochs) => doSetEpochs(new_epochs),
        // doSetBatchSize: (new_batch) => doSetBatchSize(new_batch),
        doSetLoss: (new_loss) => doSetLoss(new_loss),
        // doSetLearningDecay: (new_decay) => doSetLearningDecay(new_decay),
        doPrompt: (state) => {setState(prevState => ({ ...prevState, promptStatus: state.status, propmtDescription:state.description })); onOpen()},
    });


    const {
        isOpen: isVisible,
        onClose,
        onOpen,
    } = useDisclosure({ defaultIsOpen: false })

    const doSetLearningDecay = new_decay => {
        let new_network = new network();
        new_network.copy(state.network);
        new_network.setlearningRateDecay(new_decay);
        setState(prevState => {
            return {
                ...prevState,
                network: new_network
            }
        })
    }
    const doSetLoss = new_loss => {
        let new_network = new network();
        new_network.copy(state.network);
        new_network.setLoss(new_loss);
        setState(prevState => {
            return {
                ...prevState,
                network: new_network
            }
        })
    }

    const doSelectLayer = selected_layer => {
        // console.log('seletcing');
        doColorLayer(selected_layer);

        setState(prevState => {
            // console.log(prevState.selectedLayer)
            return {
                ...prevState,
                selectedLayer: selected_layer
            }
        })
    }

    const doSelectNode = selected_node => {

        doColorNode(selected_node);

        setState(prevState => {
            return {
                ...prevState,
                selectedNode: selected_node
            }
        })
    }

    const doColorNode = colored_node => {
        setState(prevState => {
            return {
                ...prevState,
                coloredNode: colored_node
            }
        })
        hideModelPanel();
    }

    const doColorLayer = colored_layer => {
        setState(prevState => {
            return {
                ...prevState,
                coloredLayer: colored_layer
            }
        })
        hideModelPanel();
    }


    const doSetLearnRate = new_learn => {
        let new_network = new network();

        new_network.copy(state.network);
        new_network.setLearnRate(new_learn);
        setState(prevState => {
            return {
                ...prevState,
                network: new_network
            }
        })

    }

    const hideModelPanel = () => {
        setState(prevState => {
            return {
                ...prevState,
                hiddenModelPanel: true,
            }
        })
    }

    const doSetResponsibilityOverlap = () => {
        setState(prevState => {
            return {
                ...prevState,
                responsibilityOverlap: !prevState.responsibilityOverlap
            }
        })
    }

    const unhideModelPanel = () => {
        setState(prevState => {
            return {
                ...prevState,
                hiddenModelPanel: false,
            }
        })
    }

    const doSetOptimizer = new_opt => {
        console.log("starting");
        // const network = state.network;
        // network.theoptimizer = "test";
        // state.network.reportContent();
        let new_network = new network();

        new_network.copy(state.network);
        new_network.setOptimizer(new_opt);
        // new_network.reportContent();
        setState(prevState => {
            return {
                ...prevState,
                network: new_network
            }
        })
        // console.log("after setting state");
        // state.network.reportContent();
        // console.log("finished");
    }

    const doRemoveLayer = (removeLayer) => {
        const newNetwork = new network();
        newNetwork.copy(state.network);
        if (newNetwork.arrLayers.length === 3) {
            return
        }
        console.log('before move', removeLayer)
        newNetwork.removeLayer(removeLayer);
        
        setState(prevState => {
            console.log("removing layer",prevState.selectedLayer);
            return {
                ...prevState,
                network: newNetwork,
                selectedLayer: removeLayer-1,
            }
        })
        hideModelPanel();
    }

    const doAddLayer = () => {
        let new_layer = new layer(5, 'relu', false, false, "glorot uniform");
        const newNetwork = new network();
        newNetwork.copy(state.network);

        if (newNetwork.arrLayers.length === 0) {
            new_layer.isFirstLayer = true;
        }
        if (newNetwork.arrLayers.length === 5) {
            return
        }
        newNetwork.addLayer(new_layer);

        setState(prevState => {
            return {
                ...prevState,
                network: newNetwork,
                selectedLayer: state.network.arrLayers.length - 1,
                selectedNode: 0
            }
        })

        hideModelPanel();
    }

    /**
     * 
     * @param {*} layer numeric id of the layer
     * @param {*} new_act new activation function to be set
     */
    const doSetActivation = (layer, new_act) => {
        let new_network = new network();
        new_network.copy(state.network);

        new_network.arrLayers[layer].setActivation(new_act);
        setState(prevState => {
            return {
                ...prevState,
                network: new_network
            }
        })
    }

    const doSetWeightInit = (layer, new_weight) => {
        let new_network = new network();
        new_network.copy(state.network);

        new_network.arrLayers[layer].setWeightInit(new_weight);
        setState(prevState => {
            return {
                ...prevState,
                network: new_network
            }
        })
    }

    const doSetNumNodes = (layer, new_num) => {
        let new_network = new network();
        new_network.copy(state.network);

        new_network.arrLayers[layer].setNumNodes(new_num);
        setState(prevState => {
            return {
                ...prevState,
                network: new_network
            }
        })
    }




    return (
        <Flex direction="column" h="100vh">
            <Header />
            {isVisible && (
            <Alert status={state.promptStatus}>
                <AlertIcon />
                <Flex flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                    <AlertDescription color={'black'}>
                        {state.propmtDescription}
                    </AlertDescription>
                    <CloseButton
                    color={'black'}
                    onClick={onClose}
                />
                </Flex>
            </Alert>
            )}
            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <Sidebar />
                <Flex class="wrapper" flex={1} h={'100%'}>
                    <ModelPanel appState={state} />
                    <JSide appState={state}></JSide>
                </Flex>
            </Flex>
        </Flex>
    );
}


export default CreateDAO;


