export class network {
    constructor() {
        this.arrLayers = [new layer(3, 'relu', false, true, 'uniform'), new layer(6, 'relu', false, true, 'uniform'), new layer(4, 'relu', false, true, 'uniform')];
        this.optimizer = "SGD";
        this.learnRate = 0.01;
        this.loss = "Mean Squared Error";
        // this.epochs = 100;
        // this.batchSize = 32;
        // this.learningRateDecay = false; 
    }


    copy(old_network){
        // console.log("keys of old:");
        // console.log(Object.keys(old_network));
        this.arrLayers = old_network.arrLayers;
        this.optimizer = old_network.optimizer;
        this.learnRate = old_network.learnRate;
        // this.learningRateDecay = old_network.learningRateDecay;
        this.loss = old_network.loss;
        // this.epochs = old_network.epochs;
        // this.batchSize = old_network.batchSize;
        this.reportContent();
    }

    setOptimizer(newOptimizer){
        this.optimizer = newOptimizer;
    }

    reportContent() {
        console.log("REPORTING NETWORK")
        console.log(this.arrLayers);
        console.log("optimizer: " + String(this.optimizer));
        console.log("learnRate: " + String(this.learnRate));
        console.log("learnRateDecay: " + String(this.learningRateDecay));
        console.log("loss: " + String(this.loss));
        console.log("epochs: " + String(this.epochs));
        console.log("Batch Size: " + String(this.batchSize));
        console.log("Learning Rate Decay: " + String(this.learningRateDecay));
        console.log(" ");
    }

    //  setBatchSize(newBatch) {
    //      this.batchSize = newBatch;
    //  }
     setLearnRate(newLearn) {
         this.learnRate = newLearn;
     } 

     setLoss(newLoss) {
         this.loss = newLoss; 
     }

    //  setEpochs(newEpochs) {
    //      this.epochs = newEpochs;
    //  }

    //  setlearningRateDecay(newDecay) {
    //      this.learningRateDecay = newDecay;
    //  }

    // setInit(newInit) {
    //     this.initializer = newInit;
    // }
    addLayer(newLayer) {
        this.arrLayers.push(newLayer);
    }

    removeLayer(index) {
        console.log('move index here',index)
        this.arrLayers.splice(index, 1);
    }

    // this.doSomething = function () {
    //     console.log(1);
    // }

}

export class layer {
    constructor(numNodes, activation, isFirstLayer, isLastLayer, weightInit) {
        this.numNodes = numNodes; //temporary
        this.activation = activation; //default
        this.isFirstLayer = isFirstLayer;
        this.weightInit = weightInit;
        //this.isLastLayer = isLastLayer;
    }
    setWeightInit(newWeight) {
        this.weightInit = newWeight;
    }
    setNumNodes(newNode) {
        this.numNodes = newNode;
    }
    setActivation(newActivation) {
        this.activation = newActivation;
    }
    setisFirstLayer(newBool) {
        this.isFirstLayer = newBool;
    }
}

function getActivationCode(layer) {
    return 'activation=' + "'" + layer.activation + "'";
}



// let new_layer = new layer(10, 'relu', true, false);
// let new_layer1 = new layer(10, 'relu', false, false);
// let networks = new network();
// networks.addLayer(new_layer);
// networks.addLayer(new_layer1);

// console.log(turntoString(networks));
