# NeuroDAOs
<img width="50%" alt="neuro" src="https://user-images.githubusercontent.com/71649294/236729742-c2ed6e08-94c9-4d60-957c-6306f207db00.png">

**NeuroDAOs** is a Defi and DAO protocol that mimics the decision-making process of neural networks, utilizing the composability of Defi to facilitate collective decision-making for on-chain investments.

---

## Introduction

On NeuroDAOs Users can create DAOs and DAO tokens, and join the DAO in various roles such as Input Nodes (providing investment information), Hidden Nodes (analyzing investment information), Output Nodes (adjusting and making final decisions), and LP Nodes (providing investment funds).

- As Input Nodes, users can create investment proposals, provide or supplement investment information, and pledge DAO tokens as confidence.
- As Hidden Nodes, users can verify and analyze investment information, provide support or dissenting opinions, and pledge DAO tokens as confidence.
- As Output Nodes, users can collectively adjust the overall investment amount and time, provide support or dissenting opinions, and pledge DAO tokens as confidence in the final decision-making phase.
- As LP Nodes, users can pledge network tokens to the proposal as investment funds before execution.

To obtain DAO tokens, users must pledge Network Tokens (such as ETH/BIT) at a fixed exchange rate to the DAO treasury. Pledged DAO tokens can be used to increase the individual's earnings in DAO decision-making.

After proposals are approved and reach the executable stage of investment or exit, any DAO member can execute the proposal investment or exit, and the final profit and loss will be allocated to the various Nodes according to the algorithm. For example, Input Nodes, Hidden Nodes, and Output Nodes will lose a certain amount of DAO tokens due to their opposite investment attitudes towards the profit and loss.

Nodes' decision-making weight and overall reputation in the DAO will be adjusted based on their opinions and token pledges in the proposal. Once the overall reputation reaches a certain level, DAO tokens can be lent on the NeuroDAOs credit market, which can be used to increase the Nodes' return on investment in DAO investment decisions or sold to Ethereum nodes who are unable to withdraw their pledged Ether due to a lack of DAO tokens.

## The Design

In NeuroDAOs, a DAO could be visualized as a neural network and each person could become a node in that specific neural network. In order to make the investment decision more decentralized and more profit-oriented, each node has its own weights which decide how much it would affect the decision making of the whole neural network. And, to increase the weight, each node has to make the personal decision as right as possible. After a epoch of investment (meaning buy in and sell out), the weights of each nodes will be automatically adjusted to fits the investment result, this process is called optimizing neural network node weights, also, in NeuroDAOs' context, is called **optimizing DAO**.

The entire process of optimizing neural network node weights can be divided into several steps, as well as optimizing DAO:

1. **Forward propagation**: The neural network starts from the input layer and passes the input signal through a series of linear and nonlinear transformations, propagating it to the output layer to obtain the network's prediction.
   
   - In NeuroDAOs' design, there will be 3-5 layers of nodes, including input, hidden, and output layers.
   - First, the input layer collects and verifies information related to an investment. Nodes in the input layer must stake some DAO/network tokens to prevent malicious behaviors and contribute to the final investment returns and weight adjustment.
   - The hidden layers analyze the information collected by the input layer and provide feedback. If the information is enough to make an investment proposal, the hidden layer analyzes the feasibility of the investment and passes the analysis result to the output layer. The hidden layer also needs to stake tokens to prevent malicious behavior and gain revenue.
   - The output layer adjusts the investment money and timeframe by staking money. Once the decision process is finished, the money is automatically used to invest.

2. **Compute error**: The prediction of the neural network is compared with the actual labels/numbers to calculate the error.**

	- Once an investment exit for a proposal is confirmed, the investment result is confirmed and if there are any benefits, it would give to all people who stake token to invest accroding to their weights and decisions in the DAO.
	- There will be a simple calculation for the benefit of the investment and the error (meaning the gap between the optimized result and the real result) will be calculated.

3. **Backpropagation**: The error is propagated backward from the output layer to the input layer, and the gradient of each node is calculated using the chain rule. The purpose of this step is to calculate the contribution of each node to the error, so that adjustments can be made in subsequent optimization.

	- Accroding to decisions and staked token of each node, the gradient(the contribution to the error) of each node is calculated using the chain rule.

4. **Update weights**: The weights of each node are updated based on the calculated gradients and optimization algorithm), gradually reducing the error.

	- The weights and overall reputation of nodes members will be adjusted based on the calculated gradients/contributions.

## A Defi-enabled DAO Protocol

### Integrations with Defi Protocols

- [x] ✨ Support for Swap interface of Uniswap V2 and various fork versions on different chains；
- [ ] 🛠 Decentralized yield aggregator interface - in development
- [ ] 🛠 Decentralized derivatives interface - in development
- [ ] 🛠 Decentralized prediction market interface - in development
- [ ] 🛠 Decentralized fixed rate protocol interface - in development
- [ ] 🛠 Decentralized insurance interface - in development

---

### A Reputation-based Defi Architecture

- Staking network tokens by nodes to receive corresponding DAO tokens - These network tokens are used to invest in fixed income protocols to generate profits for members.
- DAO tokens are used to increase nodes' decision-making power in DAO proposals and to earn reputation and interest rewards after the decision-making process. However, this may also bring greater risks.
- When the reputation reaches a certain value, it can be used to borrow DAO tokens through reputation lending. DAO tokens can further increase the node's income or be sold to DAO members who cannot redeem their pledges due to decision-making losses.

## [Deck]()

## Built With/On

- React.js/Next.js/Chakra UI/Javascript/Typescript
- Solidity/Remix/ether.js/Thirdweb
- **Mantle Testnet**

## Instructions about Running the Project

## Thanks


