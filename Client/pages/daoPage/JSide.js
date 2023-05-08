import React, { Component } from "react";
import ProposalPanel from "./ProposalPanel.js"
import GetTokenPanel from "./GetTokenPanel.js"
import RolesMembersPanel from "./RolesMembersPanel.js";
import { Box, Tab, Tabs, TabList, TabPanels, TabPanel, Text } from "@chakra-ui/react";

class JSide extends Component {
  constructor(props) {
    super(props);
    //set state goes here
  }

  render() {
    return (
      <Box minW={'400px'} maxW={'400px'} transition={'all 0.3s'}>
        <Box height={'80vh'} overflowY={'auto'}>
          <Tabs>
            <TabList>
              <Tab id="Proposals" title="Proposals">
                Roles and Members
              </Tab>
              <Tab id="Proposals" title="Proposals">
                Proposals
              </Tab>
              <Tab id="GetDAOToken" title="GetDAOToken">
                Get DAO Tokens
              </Tab>
            </TabList>
            <Box borderWidth="1px" borderRadius="md" p="3" >
              <Text fontWeight="bold" mb="2">
                DAO Token Balance:
              </Text>
              <Text fontSize="2xl">{this.props.appState.tokenBalance}</Text>
            </Box>
            <TabPanels>
              <TabPanel>
                <Box>
                  <RolesMembersPanel appState={this.props.appState} />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box>
                  <ProposalPanel appState={this.props.appState} />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box>
                  <GetTokenPanel appState={this.props.appState} />
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        {/* <Tab onClick={() => this.props.doSetOpt()}>Hi</Tab> */}

      </Box>
    );
  }
}

export default JSide;











