import { Button, Card, CardBody, CardFooter, Flex, Heading, Text } from "@chakra-ui/react";

function ProposalCard({ tokenAddress, totalDeposit, plannedBuyTime, plannedSellTime, decisionStagePeriod, onFund, onVote, totalFunds, currentStage }) {
  return (
    <Card borderWidth="1px" borderRadius="md" boxShadow="md" maxW="sm">
      <CardBody>
        <Heading size="sm" mb={2}>
          Vote for investing {tokenAddress}
        </Heading>
        <Flex justifyContent="space-between" alignItems="center">
        <Text mb={1}>
          Total Deposit: {totalDeposit}
        </Text>
        <Text mb={1}>
          Total Funds: {totalFunds}
        </Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>
            Planned Buy Time: {plannedBuyTime}
          </Text>
          <Text>
            Planned Sell Time: {plannedSellTime}
          </Text>
        </Flex>
        <Text mt={2}>
          Decision Stage Period: {decisionStagePeriod}
        </Text>
        <Text mt={1}>
          Current Stage {currentStage}
        </Text>
      </CardBody>
      <CardFooter>
        <Flex justifyContent="space-around" flex={1}>
          <Button onClick={onFund} colorScheme="green">
            Fund
          </Button>
          <Button onClick={onVote} colorScheme="teal">
            Vote
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
}
export default ProposalCard