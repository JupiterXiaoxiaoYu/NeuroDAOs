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
                    <Flex w="100%" my="6" mx="auto" px="6" align="center">
                        <RadialChart
                            data={data}
                            width={300}
                            height={300}
                            innerRadius={100}
                            radius={140}
                            labelsRadiusMultiplier={1.15}
                            showLabels
                            labelsStyle={{ fill: "white", fontSize: "16px" }}
                        />
                        <Box ml="4" p="4" bg="white" borderRadius="lg" boxShadow="md">
                            <Text fontSize="2xl" mb="4" color={'black'}>Overall Reputation: {totalScore}</Text>
                            {percentageData.map(({ label, percentage }) => (
                                <Flex key={label} justify="space-between">
                                    <Text color={'black'}>{label}</Text>
                                    <Text color={'black'}>{percentage}%</Text>
                                </Flex>
                            ))}
                        </Box>
                    </Flex>
                </Flex>
            </Box>

        );
    }
}

export default RadialChartComponent;
