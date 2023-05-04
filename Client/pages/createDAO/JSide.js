import React, { Component } from "react";
import BuildPanel from "./BuildPanel.js"
import ConfirmPanel from "./ConfirmPanel.js"
import { Box, Tab, Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";

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
              <Tab id="build" title="Build">
                Set
              </Tab>
              <Tab id="learn" title="Learn">
                Confirm
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box>
                  <BuildPanel appState={this.props.appState} />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box>
                  <ConfirmPanel appState={this.props.appState}/>
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











