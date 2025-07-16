import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import FunctionsIcon from '@mui/icons-material/Functions';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { message } from "mui-message";
import {
    Card as MuiCard,
    CardContent,
    CardHeader,
    IconButton,
    Grid,
    Menu,
    MenuItem,
    Popover
} from "@mui/material";
import { spacing } from "@mui/system";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Colors,
    RadialLinearScale,
} from 'chart.js';
import dayjs from "../../../utils/myDayjs";
import { PolarArea, Line } from 'react-chartjs-2';

import { transRiskTrendsToPolarArea, transRiskTrendsToLine } from "./constructor";
import { reqGetRiskTrend } from "../../../api/dashboard";
import DateInterval from "./dateInterval";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
    Colors
);
const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 412px;
`;

function RiskTrend() {
    const [rlData, setRlData] = useState([]);
    const [groupBy, setGroupBy] = useState("occday");
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [popOpen, setPopOpen] = useState(false);
    const [interval, setInterval] = useState({ startdate: dayjs(new Date()).subtract(7, "day").format("YYYYMMDD"), enddate: dayjs(new Date()).format("YYYYMMDD") });

    useEffect(() => {
        async function initData() {
            const res = await reqGetRiskTrend({ startdate: interval.startdate, enddate: interval.enddate });
            let newData = { startdate: "", enddate: "", risktrends: [] };
            if (res.data.status === 0) {
                newData = res.data.data;
            } else {
                message.error("请求数据错误:" + res.data.statusMsg);
            }
            setRlData(newData.risktrends);
        }
        initData();
    }, [interval]);

    //转换数据
    const polarData = transRiskTrendsToPolarArea(rlData);
    const lineData = transRiskTrendsToLine(rlData, groupBy);
    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };
    const handleClickCalendar = (event) => {
        setAnchorEl(event.currentTarget);
        setPopOpen(true)
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    };
    const handleClickMenuItem = (item) => {
        setGroupBy(item);
        handleCloseMenu();
    };
    const handleClosePop = () => {
        setPopOpen(false);
        setAnchorEl(null);
    };
    const handleIntervalOk = (dataInterval) => {
        setInterval(dataInterval);
        handleClosePop();
    };
    return (
        <Card mb={6}>
            <CardHeader
                title={`风险分布(${dayjs(interval.startdate).format("YY-MM-DD")}至${dayjs(interval.enddate).format("YY-MM-DD")})`}
                action={
                    <>
                        <IconButton aria-label="filter" size="large" onClick={handleClickCalendar}>
                            <CalendarMonthIcon color="secondary" />
                        </IconButton>
                        <IconButton aria-label="settings" size="large" onClick={handleClickMenu}>
                            <FunctionsIcon color="secondary" />
                        </IconButton>
                    </>
                }
            />
            <Menu
                id="risklevel-groupby"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => handleClickMenuItem("occday")}>按天</MenuItem>
                <MenuItem onClick={() => handleClickMenuItem("occweek")}>按周</MenuItem>
                <MenuItem onClick={() => handleClickMenuItem("occmonth")}>按月</MenuItem>
                <MenuItem onClick={() => handleClickMenuItem("occyear")}>按年</MenuItem>
            </Menu>
            <Popover
                id="intervalPoper"
                open={popOpen}
                anchorEl={anchorEl}
                onClose={handleClosePop}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <DateInterval
                    initValue={interval}
                    onOk={handleIntervalOk}
                    onCancel={handleClosePop}
                />
            </Popover>
            <CardContent>
                <Grid container>
                    <Grid item xs={9}>
                        <ChartWrapper>
                            <Line options={lineData.options} data={lineData.data} />
                        </ChartWrapper>
                    </Grid>
                    <Grid item xs={3}>
                        <ChartWrapper>
                            <PolarArea data={polarData} />
                        </ChartWrapper>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
export default RiskTrend;
