import React, { Component } from "react";
import { Box, Divider, Flex, Heading, SimpleGrid, VStack, HStack, Button, Text } from "@chakra-ui/react";
// @ts-ignore 
// import { Sigma, LoadJSON } from 'react-sigma';
import dynamic from "next/dynamic"
const Sigma = dynamic(() => import("react-sigma").then((mod)=>mod.Sigma), {
  ssr: false
})


function getMaxNodeCount(arrLayers) {
    let max = 0;
    for (let layer of arrLayers) {
        let nodeCount = layer.numNodes;
        if (nodeCount > max) max = nodeCount;
    }
    return max;
}

function layersToGraph(arrLayers, coloredLayer) {

    let maxNodeCount = getMaxNodeCount(arrLayers);

    let graph = {};
    let nodes = [];
    let edges = [];
    let prevLayerNodes = []; // cache

    for (let i = 0; i < arrLayers.length; i++) {

        let layer = arrLayers[i];
        let nodeCount = layer.numNodes;

        let x = i * 0.2;
        let color = i === coloredLayer ? "#add8e6" : "#fff";

        let vgap = 0.15 - nodeCount / 200;
        let renderHeight = (nodeCount - 1) * vgap;
        let initY = (2.0 - renderHeight) / 2;

        let thisLayerNodes = [];

        for (let j = 0; j < nodeCount; j++) {

            let y = initY + j * vgap;
            let id = i + "," + j;
            let size = 1;
            

            let node = { x: x, y: y, size: size, id: id, color: color};
            nodes.push(node);
            thisLayerNodes.push(node);
        }

        if (prevLayerNodes.length > 0) { // TODO check this??
            connect(prevLayerNodes, thisLayerNodes, edges);
        }

        prevLayerNodes = thisLayerNodes;

    }

    graph.nodes = nodes;
    graph.edges = edges;
    return graph;

}

function connect(prevLayerNodes, thisLayerNodes, edges) {

    for (let i = 0; i < prevLayerNodes.length; i++) {

        let prevNode = prevLayerNodes[i];
        let source = prevNode.id;

        for (let j = 0; j < thisLayerNodes.length; j++) {

            let thisNode = thisLayerNodes[j];

            let id = "e_" + prevNode.id + "," + thisNode.id;
            let target = thisNode.id;
            let size = 1 - (prevLayerNodes.length * thisLayerNodes.length) / 100;

            let edge = { id: id, source: source, target: target, size: size };
            edges.push(edge);

        }
    }

}

function writer(g) { // TODO
    let content = JSON.stringify(g);
    // fs.writeFile('graph.json', content, err => {
    //     if (err) {
    //       console.error(err)
    //       return
    //     }
    //     //file written successfully
    //   })
}

// function genLayers() {
//     let arrLayers = [];
//     let temp3 = new layer(2, 'softmax', false, true);
//     let temp4 = new layer(6, 'softmax', false, true);
//     let temp5 = new layer(8, 'softmax', false, true);
//     let temp56 = new layer(4, 'softmax', false, true);
//     let temp6 = new layer(1, 'softmax', false, true);
//     arrLayers.push(temp3, temp5, temp4, temp56, temp6);
//     return arrLayers;
// }

export class ModelPanel extends Component {
    constructor(props) {
        super(props);
    }

    onClickNodeFunc = (e) => {
        const node = e.data.node;
        const id = node.id;
        const SELECTED_LAYER = parseInt(id.substring(0,id.indexOf(",")));
        this.props.appState.doSelectLayer(SELECTED_LAYER);
    }

    // onOverNodeFunc = (e) => {
    //     const node = e.data.node;
    //     const id = node.id;
    //     const HOVERED_LAYER = parseInt(id.substring(0,id.indexOf(",")));
    //     this.props.appState.doColorLayer(HOVERED_LAYER);
    // }

    // onOutNodeFunc = (e) => {
    //     this.props.appState.doColorLayer(-1);
    // }
    
    getSigma(data) {
        // console.log("rendering using data: ");
        // console.log(data);
        let s = <Sigma 
            graph={data} 
            style={{ height: "100%" }}
            onClickNode={this.onClickNodeFunc}
            //onOverNode={this.onOverNodeFunc}
            //onOutNode={this.onOutNodeFunc}
            settings={{
                maxNodeSize: 15, maxEdgeSize: 0.3,
                clone: false, 
                enableHovering: true,
                rescaleIgnoreSize: false, // TODO change?
            }}>
        </Sigma>
    
        //writer(data);
    
        // let s2 = 
        // <Sigma>
        //     <LoadJSON url="/graph.json">
    
        //     </LoadJSON>
        // </Sigma>
        return s;
    }

    render() {

        
        // let r = parseInt(Math.random() * 5);
        // let preloaded = layersToGraph(genLayers().slice(0, 5));

        let layers = this.props.appState.network.arrLayers;

        let g = layersToGraph(layers, this.props.appState.coloredLayer);

        if (!this.props.appState.hiddenModelPanel) {
                
            return (
                <Box id="content">
                    <Text class="center">Model Architecture</Text>
                    <Box style={{ height: "90%" }}>                   
                        {this.getSigma(g)}
                    </Box>
                </Box>

            );

        }  else {
            this.props.appState.unhideModelPanel(); // re-render!
            return false;
        }

    }

    
}

