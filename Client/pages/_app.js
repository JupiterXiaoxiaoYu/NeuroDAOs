import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react"
import { theme } from "../styles/theme"
import { SidebarDrawerProvider } from "../contexts/SidebarDrawerContext"
import { SSRProvider } from "react-bootstrap";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { MantleTestnet } from "@thirdweb-dev/chains";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain={MantleTestnet}>
      <SSRProvider>
        <ChakraProvider theme={theme}>
          <SidebarDrawerProvider>
            <Component {...pageProps} />
          </SidebarDrawerProvider>
        </ChakraProvider>
      </SSRProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
