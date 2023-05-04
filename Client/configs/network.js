/**
 * Testnet & Mainnet config
 * 
 * @returns {Object} network config
 */
const networks = {
	testnet: {
		id: "ae_uat",
		url: "https://testnet.aeternity.io",
		mdwUrl: "https://testnet.aeternity.io/mdw",

	},
	mainnet: {
		id: "ae_mainnet",
		url: "https://mainnet.aeternity.io",
		mdwUrl: "https://mainnet.aeternity.io/mdw",
	},
};
export default networks[process.env.REACT_APP_NODE_ENV || 'testnet'];
