import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { AvatarGenerator } from 'random-avatar-generator';
const generator = new AvatarGenerator();

export const Profile = ( {address, balance} ) => {
  const imgurl = generator.generateRandomAvatar(address); 
  return (
    <Flex align="center">
        <Box mr="4" textAlign="right">
          <Text>{address}</Text>
          <Text color="gray.300" fontSize="small">
            Balance: {balance}
          </Text>
        </Box>
      <Avatar size="md" name="Eduardo Ferronato" src={imgurl} />
    </Flex>
  )
}
