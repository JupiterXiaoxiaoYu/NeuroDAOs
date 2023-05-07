import React, { Component } from "react";
import { Box, Divider, Flex, Heading, SimpleGrid, VStack, HStack, Button, Text } from "@chakra-ui/react";
// @ts-ignore 
// import { Sigma, LoadJSON } from 'react-sigma';
import dynamic from "next/dynamic"
const Sigma = dynamic(() => import("react-sigma").then((mod)=>mod.Sigma), {
    ssr: false
  })


const ModelPanel = ({ appState }) => {
    // console.log(appState)
    const connect = (prevLayerNodes, thisLayerNodes, edges) => {

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

    const getMaxNodeCount = (arrLayers) => {
        let max = 0;
        for (let layer of arrLayers) {
            let nodeCount = layer.numNodes;
            if (nodeCount > max) max = nodeCount;
        }
        return max;
    }

    const layersToGraph = (arrLayers, coloredLayer, coloredNode) => {

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
                
                // color = j === coloredNode ? "red":color
                let node = { x: x, y: y, size: size, id: id, color:coloredLayer===i && coloredNode===j? '#38A169':color};
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
    


    const onClickNodeFunc = (e) => {
        const node = e.data.node;
        const id = node.id;

        const SELECTED_LAYER = parseInt(id.substring(0,id.indexOf(",")));
        const SELECTED_NODE = parseInt(id.split(",")[1]);
        // console.log(SELECTED_NODE)
        appState.doSelectLayer(SELECTED_LAYER);
        appState.doSelectNode(SELECTED_NODE)
    }

    const getSigma = (data) => {
        let s = <Sigma 
            graph={data} 
            style={{ height: "100%" }}
            onClickNode={onClickNodeFunc}
            settings={{
                maxNodeSize: 15, maxEdgeSize: 0.3,
                clone: false, 
                enableHovering: true,
                rescaleIgnoreSize: false,
            }}>
        </Sigma>
    
        return s;
    }

    let layers = appState.network.arrLayers;
    let g = layersToGraph(layers, appState.coloredLayer, appState.coloredNode);
    // console.log('g',appState.coloredLayer)

    if (!appState.hiddenModelPanel) {
        return (
            <Box id="content">
                <Text class="center">DAO Architecture</Text>
                <Box style={{ height: "90%" }}>                   
                    {getSigma(g)}
                </Box>
            </Box>
        );
    }  else {
        appState.unhideModelPanel(); // re-render!
        return false;
    }
}

export default ModelPanel;
