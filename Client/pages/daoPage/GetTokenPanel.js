import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { ethers } from "ethers";

function SwapUI({appState}) {
    const [inputToken, setInputToken] = useState("$BIT");
    const [outputToken, setOutputToken] = useState("DAO");
    const [inputTokenAmount, setInputTokenAmount] = useState(0);
    const [outputTokenAmount, setOutputTokenAmount] = useState(0);
    const [DAOtokenBalance, setDAOtokenBalance] = useState(0);
    // console.log(appState)
    async function handleSwapTokens() {
        // TODO: Swap tokens
        try{
        const data = await appState.contract.call("stakeToGetDAOToken", [inputTokenAmount.toString()],  {
            value: ethers.utils.parseEther(inputTokenAmount) // send 0.1 ether with the contract call
          },)
        console.log(data)
        appState.doPrompt({ description: `You have successfully gain ${outputTokenAmount} ${outputToken}`, status: 'success' });
        }catch{
            appState.doPrompt({ description: 'Stake Failed', status: 'error' });
        }
    }

    function handleTokenSwap() {
        const temp = inputToken;
        setInputToken(outputToken);
        setOutputToken(temp);
    }

    return (
        <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6}>
            <FormControl>
                <FormLabel>Input {inputToken} Token Amount</FormLabel>
                <InputGroup>
                    <Input placeholder={`Enter ${inputToken} amount`} onChange={(event)=>{setInputTokenAmount(event.target.value); if(inputToken==='$BIT'){
                    setOutputTokenAmount(event.target.value * 100000);
                    }else{
                        setOutputTokenAmount(event.target.value / 100000);
                    }
                }}/>
                    <InputRightElement children={<Box as="span" px="2" onClick={handleTokenSwap} cursor="pointer">&#8646;</Box>} />
                </InputGroup>
            </FormControl>
            <FormControl mt={4}>
                <FormLabel>Output {outputToken} Token Amount</FormLabel>
                <InputGroup>
                    <Input placeholder={outputTokenAmount} disabled={true} _highlighted={true}/>
                </InputGroup>
            </FormControl>
            <Button colorScheme="blue" mt={8} onClick={handleSwapTokens}>
                {inputToken === "$BIT" ? "Stake BIT to Obtain DAO Token" : "Burn DAO Token to Redeem $BIT"}
            </Button>
        </Box>
    );
}

export default SwapUI;
