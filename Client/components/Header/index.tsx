import { Flex, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react"
import { RiMenuLine } from "react-icons/ri"
import { useSidebarDrawer } from "../../contexts/SidebarDrawerContext"
import { Logo } from "./Logo"
import { NotificationNav } from "./NotificationsNav"
import { Profile } from "./Profile"
import { SearchBox } from "./SearchBox"
import { ConnectWallet } from "@thirdweb-dev/react";

export function Header({address, balance}) {
  const { onOpen } = useSidebarDrawer()

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  return (
    <Flex
      as="header"
      w="100%"
      maxW={1480}
      h="20"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      {!isWideVersion && (
        <IconButton
        aria-label="Open navigation"
        icon={<Icon as={RiMenuLine}/>}
        fontSize="24"
        variant="unstyled"
        onClick={onOpen}
        mr="2"
        >

        </IconButton>
      )}

      <Logo />
      {isWideVersion && <SearchBox />}
      <Flex align="center" ml="auto" >
        <NotificationNav />
        {/* <Profile address={address} balance={balance}/> */}
        <ConnectWallet/>
      </Flex>
    </Flex>
  )
}
