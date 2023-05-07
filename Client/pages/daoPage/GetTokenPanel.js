import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement } from "@chakra-ui/react";

function SwapUI() {
  const [inputToken, setInputToken] = useState("ETH");
  const [outputToken, setOutputToken] = useState("DAO");

  function handleSwapTokens() {
    // TODO: Swap tokens
  }

  function handleTokenSwap() {
    const temp = inputToken;
    setInputToken(outputToken);
    setOutputToken(temp);
  }

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6}>
      <FormControl>
        <FormLabel>Input Amount</FormLabel>
        <InputGroup>
          <Input placeholder={`Enter ${inputToken} amount`} />
          <InputRightElement children={<Box as="span" px="2" onClick={handleTokenSwap} cursor="pointer">&#8646;</Box>} />
        </InputGroup>
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Output Amount</FormLabel>
        <InputGroup>
          <Input placeholder={`Enter ${outputToken} amount`} />
          <InputRightElement children={<Box as="span" px="2" onClick={handleTokenSwap} cursor="pointer">&#8646;</Box>} />
        </InputGroup>
      </FormControl>
      <Button colorScheme="blue" mt={8} onClick={handleSwapTokens}>
        {inputToken==="ETH" ? "Stake ETH to Obtain DAO Token" : "Burn DAO Token to Redeem ETH"}
      </Button>
    </Box>
  );
}

export default SwapUI;
