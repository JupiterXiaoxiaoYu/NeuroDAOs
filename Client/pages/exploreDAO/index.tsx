import { Box, Button, Checkbox, Flex, Heading, Icon, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { useContract, useContractRead } from "@thirdweb-dev/react";



export default function UserList() {

  const { contract } = useContract("0x01b64C824C34Acb75d62CAceeb186220685c2e24");
  const { data, isLoading } = useContractRead(contract, "get_DAOs")

  console.log(isLoading?'1':data[0])


  return (
    <Box>
      <Header balance={0} address={'a'}/>
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">Explore NeuroDAOs</Heading>
            <Link href="/createDAO" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="green"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Create a DAO
              </Button>
            </Link>
          </Flex>

          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                {/* <Th px={["4", "4", "6"]} color="gray.300" width="8">
                  <Checkbox colorScheme="green" />
                </Th> */}
                <Th>Name</Th>
                <Th>ID</Th>
                <Th>Description</Th>
                <Th>Token Address</Th>
                {/* <Th>Founder</Th> */}
                <Th width="8"></Th>
              </Tr>
            </Thead>


            <Tbody>
              { data?.map((dao, index) => (
              <Tr key={index}>
                <Td>
                  <Box>
                    <Text fontWeight="bold">{dao.name}</Text>
                  </Box>
                </Td>
                <Td>
                    <Text fontWeight="bold">{dao.id.toNumber()}</Text>
                </Td>
                <Td>
                    <Text fontWeight="bold">{dao.description_cid}</Text>
                </Td>
                <Td>
                    <Text fontWeight="bold">{dao.TokenAddress}</Text>
                </Td>
                {/* <Td>
                    <Text fontWeight="bold">{dao.owner.substring(0, 6)}...{dao.owner.substring(dao.owner.length - 4)}</Text>
                </Td> */}
                <Td>
                <Link href={"/daoPage/[id]"} as={`/daoPage/${dao.id.toNumber()}`}>
                <Button backgroundColor={'green.400'}>Join</Button>
                </Link>
                </Td>
              </Tr>))
              }
            </Tbody>
          </Table>
          <Pagination />
        </Box>
      </Flex>
    </Box>
  )
}
