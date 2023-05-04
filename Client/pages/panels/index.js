import React, { Component } from 'react';
import JSide from "./JSide.js";
import { network, layer } from "./kerasCode.js";
import { ModelPanel } from "./DAOPanel.js"
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
//import {NetworkGraph} from "./ModelPanel.js"
import { Box, Divider, Flex, Heading, SimpleGrid, VStack, HStack, Button } from "@chakra-ui/react";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hiddenModelPanel: false,
            hideModelPanel: () => this.hideModelPanel(),
            unhideModelPanel: () => this.unhideModelPanel(),
            network: new network(),
            selectedLayer: 0,
            loadable: false,
            doSelectLayer: selected_layer => this.doSelectLayer(selected_layer), // pass to modelPanel
            doColorLayer: hoveredlayer => this.doColorLayer(hoveredlayer), // pass to modelPanel
            doAddLayer: () => this.doAddLayer(), // pass to buildPanel, to call as needed
            doRemoveLayer: () => this.doRemoveLayer(),
            doSetOptimizer: new_opt => this.doSetOptimizer(new_opt),
            doSetActivation: (layer, new_act) => this.doSetActivation(layer, new_act),
            doSetWeightInit: (layer, new_weight) => this.doSetWeightInit(layer, new_weight),
            doSetNumNodes: (layer, new_nodes) => this.doSetNumNodes(layer, new_nodes),
            doSetLearnRate: (new_learn) => this.doSetLearnRate(new_learn),
            doSetEpochs: (new_epochs) => this.doSetEpochs(new_epochs),
            doSetBatchSize: (new_batch) => this.doSetBatchSize(new_batch),
            doSetLoss: (new_loss) => this.doSetLoss(new_loss),
            doSetLearningDecay: (new_decay) => this.doSetLearningDecay(new_decay),
        }
    }
    doSetLearningDecay = new_decay => {
        let new_network = new network();
        new_network.copy(this.state.network);
        new_network.setlearningRateDecay(new_decay);
        this.setState(prevState => {
            return {
                network: new_network
            }
        })
    }
    doSetLoss = new_loss => {
        let new_network = new network();
        new_network.copy(this.state.network);
        new_network.setLoss(new_loss);
        this.setState(prevState => {
            return {
                network: new_network
            }
        })
    }

    doSetEpochs = new_epochs => {
        let new_network = new network();
        new_network.copy(this.state.network);
        new_network.setEpochs(new_epochs);
        this.setState(prevState => {
            return {
                network: new_network
            }
        })
    }

    doSetBatchSize = new_batch => {
        let new_network = new network();
        new_network.copy(this.state.network);
        new_network.setBatchSize(new_batch);
        this.setState(prevState => {
            return {
                network: new_network
            }
        })
    }
    doSelectLayer = selected_layer => {

        this.doColorLayer(selected_layer);

        this.setState(prevState => {
            return {
                selectedLayer: selected_layer
            }
        })
    }

    doColorLayer = colored_layer => {
        this.setState(prevState => {
            return {
                coloredLayer: colored_layer
            }
        })
        this.hideModelPanel();
    }


    doSetLearnRate = new_learn => {
        let new_network = new network();

        new_network.copy(this.state.network);
        new_network.setLearnRate(new_learn);
        this.setState(prevState => {
            return {
                network: new_network
            }
        })

    }

    hideModelPanel = () => {
        this.setState(prevState => {
            return {
                hiddenModelPanel: true,
            }
        })
    }

    unhideModelPanel = () => {
        this.setState(prevState => {
            return {
                hiddenModelPanel: false,
            }
        })
    }

    doSetOptimizer = new_opt => {
        console.log("starting");
        // const network = this.state.network;
        // network.theoptimizer = "test";
        // this.state.network.reportContent();
        let new_network = new network();

        new_network.copy(this.state.network);
        new_network.setOptimizer(new_opt);
        // new_network.reportContent();
        this.setState(prevState => {
            return {
                network: new_network
            }
        })
        // console.log("after setting state");
        // this.state.network.reportContent();
        // console.log("finished");
    }

    doRemoveLayer = () => {
        const selectedLayer = this.state.selectedLayer;
        const newNetwork = new network();
        newNetwork.copy(this.state.network);

        newNetwork.removeLayer(selectedLayer);
        this.setState(prevState => {
            return {
                network: newNetwork,
                selectedLayer: selectedLayer - 1,
                loadable: (newNetwork.arrLayers.length > 0),
            }
        })
        this.hideModelPanel();
    }

    doAddLayer = () => {
        let new_layer = new layer(5, 'relu', false, false, "glorot uniform");
        const newNetwork = new network();
        newNetwork.copy(this.state.network);

        if (newNetwork.arrLayers.length === 0) {
            new_layer.isFirstLayer = true;
        }
        newNetwork.addLayer(new_layer);

        this.setState(prevState => {
            return {
                network: newNetwork,
                loadable: true,
                selectedLayer: this.state.network.arrLayers.length - 1
            }
        })

        this.hideModelPanel();
    }

    /**
     * 
     * @param {*} layer numeric id of the layer
     * @param {*} new_act new activation function to be set
     */
    doSetActivation(layer, new_act) {
        let new_network = new network();
        new_network.copy(this.state.network);

        new_network.arrLayers[layer].setActivation(new_act);
        this.setState(prevState => {
            return {
                network: new_network
            }
        })
    }

    doSetWeightInit(layer, new_weight) {
        let new_network = new network();
        new_network.copy(this.state.network);

        new_network.arrLayers[layer].setWeightInit(new_weight);
        this.setState(prevState => {
            return {
                network: new_network
            }
        })
    }

    doSetNumNodes = (layer, new_num) => {
        let new_network = new network();
        new_network.copy(this.state.network);

        new_network.arrLayers[layer].setNumNodes(new_num);
        this.setState(prevState => {
            return {
                network: new_network
            }
        })
    }
    render() {
        return (
            <Flex direction="column" h="100vh">
                <Header />
                <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                    <Sidebar />
                    <Flex class="wrapper" flex={1}>
                        <ModelPanel appState={this.state} />
                        <JSide appState={this.state} />
                    </Flex>
                </Flex>

            </Flex>
        );
    }

}


export default App;


