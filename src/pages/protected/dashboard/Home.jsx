import { useState, useEffect, useMemo } from "react";
import { Grid, Typography as MuiTypography } from "@mui/material";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { green, red } from "@mui/material/colors";
import dayjs from "../../../utils/myDayjs";
import { cloneDeep } from "lodash";

import { Divider } from "../../../component/ScMui/ScMui";
import Loader from "../../../component/Loader/Loader";
import Actions from "./actions";
import Stats from "./stats";
import SceneProblemRank from "./sceneProblemRank";
import Reviewed from "./reviewed";
import BeReviewed from "./beReviewed";
import RiskTrend from "./riskTrend";

import { reqGetDashboardData } from "../../../api/dashboard";
import { initDateIntervals } from "./constructor";

const Typography = styled(MuiTypography)(spacing);

function Home() {
    const [data, setData] = useState(undefined);
    const user = useSelector((state) => state.user);
    const dateIntervals = useMemo(initDateIntervals, []);
    const autoIndex = dayjs().hour() >= 12 ? 0 :1;    
    const [interval, setInterval] = useState(dateIntervals[autoIndex]);

    useEffect(() => {
        async function initData() {
            const res = await reqGetDashboardData({ startdate: interval.startDate, enddate: interval.endDate });
            let newData = undefined;
            if (!res.status) {
                return
            }
            newData = res.data.data;
            setData(newData);
        }
        initData();
    }, [interval]);

    const handleRefresh = () => {
        let newInterval = cloneDeep(interval);      
        setInterval(newInterval);
    };
    return (data !== undefined
        ? <>
            <Grid justifyContent="space-between" container spacing={6}>
                <Grid item>
                    <Typography variant="h3" gutterBottom>
                        指示板
                    </Typography>
                    <Typography variant="subtitle1">
                        {`${user.name},欢迎您!`}
                        <span role="img" aria-label="Waving Hand Sign">
                            👋
                        </span>
                    </Typography>
                </Grid>
                <Grid item>
                    <Actions interval={interval} dateIntervals={dateIntervals} setInterval={setInterval} refreshAction={handleRefresh} />
                </Grid>
            </Grid>
            <Divider my={6} />
            <Grid container spacing={6}>
                <Grid item xs={12} sm={12} md={6} lg={3} xl>
                    <Stats
                        title="下达指令"
                        amount={data.givewoitem.freecount + data.givewoitem.confirmcount + data.givewoitem.exectivecount + data.givewoitem.finishedcount}
                        chip={interval.label}
                        percentagetext={`${data.givewoitem.exectivecount + data.givewoitem.finishedcount}条已执行`}
                        percentagecolor={green[500]}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl>
                    <Stats
                        title="收到指令"
                        amount={data.recivewoitem.count}
                        chip={interval.label}
                        percentagetext={`${data.recivewoitem.unfinishcount}条尚未完成`}
                        percentagecolor={red[500]}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl>
                    <Stats
                        title="发现问题"
                        amount={data.discoverproblem.count}
                        chip={interval.label}
                        percentagetext={`${data.discoverproblem.finished}条已经解决`}
                        percentagecolor={green[500]}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl>
                    <Stats
                        title="处理问题"
                        amount={data.disposeproblemitem.finishedcount}
                        chip={interval.label}
                        percentagetext={`${data.disposeproblemitem.unfinishcount}条尚未处理`}
                        percentagecolor={red[500]}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    {/* 风险分布图 */}
                    <RiskTrend  />
                </Grid>
            </Grid>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    {/* 现场问题排名 */}
                    <SceneProblemRank problemdata={data.problemitems} chip={interval.label} />
                </Grid>
            </Grid>
            <Grid container spacing={6}>
                <Grid item xs={12} lg={6}>
                    {/* 审阅单据时间 */}
                    <Reviewed reviewData={data.revieweditems} chip={interval.label} />
                </Grid>
                <Grid item xs={12} lg={6}>
                    {/* 单据被审阅时间 */}
                    <BeReviewed reviewData={data.berevieweditems} chip={interval.label}/>
                </Grid>
            </Grid>
        </>
        : <Loader />
    );
}
export default Home;
