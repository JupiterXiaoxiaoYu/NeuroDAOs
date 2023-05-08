import { Stack } from "@chakra-ui/react";
import { BiNetworkChart, BiBarChartAlt } from "react-icons/bi";
import {GiMicroscope, GiSpawnNode, GiReceiveMoney} from "react-icons/gi";
import {VscGitPullRequestCreate} from "react-icons/vsc";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";
import {FaTasks} from "react-icons/fa";
import {MdOutlinePrecisionManufacturing} from "react-icons/md";
import {TbChartArrowsVertical} from "react-icons/tb";


export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start" >
      <NavSection title="DAO">
        <NavLink icon={BiNetworkChart} href="/dashboard">My DAOs</NavLink>
        <NavLink icon={GiMicroscope} href="/exploreDAO">Explore DAO</NavLink>
        <NavLink icon={VscGitPullRequestCreate} href="/createDAO">Create DAO</NavLink>
        <NavLink icon={FaTasks} href="/tasks">Notifications</NavLink>
      </NavSection>

      <NavSection title="Node">
        <NavLink icon={GiSpawnNode} href="/myWeight">My Weight</NavLink>
        <NavLink icon={BiBarChartAlt} href="/node-rankings">Node Ranking</NavLink>
        <NavLink icon={GiReceiveMoney} href="/lending">Credit Lending</NavLink>
      </NavSection>

      <NavSection title="FAQ">
        <NavLink icon={MdOutlinePrecisionManufacturing} href="/mechanism">Mechanism</NavLink>
        <NavLink icon={TbChartArrowsVertical} href="/increase-weight">Increase Your Weight</NavLink>
      </NavSection>

    </Stack>
  )
}
