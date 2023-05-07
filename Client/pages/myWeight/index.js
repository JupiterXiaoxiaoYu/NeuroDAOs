import React, { Component } from 'react';
import { RadialChart } from 'react-vis';
import { Box, Button, Checkbox, Flex, Heading, Icon, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { useContract, useContractRead } from "@thirdweb-dev/react";

class RadialChartComponent extends Component {
    render() {
        const data = [
            { angle: 2, label: 'Mantle DAO' },
            { angle: 5, label: 'SISI DAO' },
            { angle: 3, label: 'HI DAO' },
        ];

        const totalScore = data.reduce((acc, { angle }) => acc + angle, 0);

        const percentageData = data.map(({ angle, label }) => ({
            angle,
            label,
            percentage: ((angle / totalScore) * 100).toFixed(2),
        }));

        return (



            <Box alignItems={'center'}>
                <Header balance={0} address={'a'} />
                <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                    <Sidebar />

                    <div>
                        <RadialChart
                            data={data}
                            width={300}
                            height={300}
                            innerRadius={100}
                            radius={140}
                            labelsRadiusMultiplier={1.15}
                            showLabels
                        />
                        <div>Overall Reputation: {totalScore}</div>
                        <div>
                            {percentageData.map(({ label, percentage }) => (
                                <div key={label}>
                                    {label}: {percentage}%
                                </div>
                            ))}
                        </div>
                    </div>
                </Flex>
            </Box>

        );
    }
}

export default RadialChartComponent;
