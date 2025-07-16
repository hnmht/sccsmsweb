import { useState, useEffect } from "react";
import {
    Stack,
    Typography,
    Grid,
    DialogActions,
    Button,
    Tooltip,
    IconButton,
    Box,
    Tabs,
    Tab
} from "@mui/material";
import { AddCommentIcon } from "../../../../component/PubIcon/PubIcon";
import { message } from "mui-message"
import dayjs from "../../../../utils/myDayjs";
import { cloneDeep } from "lodash";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../../component/ScVoucher";
import Loader from "../../../../component/Loader/Loader";
import ScInput from "../../../../component/ScInput";
import CommentInput from "./commentInput";
import CommentsList from "./commentsList";
import ReviewsList from "./reviewsList";
import { bodyColumns } from "./constructor";
import { reqAddEDReview, reqGetEDComments, reqGetEDReviews } from "../../../../api/executeDoc";

//生成初始数据
const getInitialValue = (oriEd) => {
    let newED = cloneDeep(oriEd);
    newED.createdate = dayjs(newED.createdate).format("YYYYMMDDHHmm");
    newED.modifydate = dayjs(newED.modifydate).format("YYYYMMDDHHmm");
    newED.confirmdate = dayjs(newED.confirmdate).format("YYYYMMDDHHmm");
    return newED;
};

const ReviewED = ({ isOpen, oriED, startTime, onBack }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [comments, setComments] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [commitStatus, setCommitStatus] = useState({
        isOpen: false,
        currentRow: undefined,
    });

    useEffect(() => {
        async function initVoucher() {
            const newED = await getInitialValue(oriED);
            setVoucherData(newED);
            //获取批注记录
            let newComments = [];
            const commentsRes = await reqGetEDComments({ hid: newED.id })
            if (commentsRes.data.status === 0 ) {
                if (commentsRes.data.data.comments !== null) {
                    newComments = commentsRes.data.data.comments;
                }                
            } else {
                message.error("获取批注记录失败:" + commentsRes.data.statusMsg);
            }
            setComments(newComments);
            //获取审阅记录
            let newReviews = [];
            const reviewRes = await reqGetEDReviews({ hid: newED.id });
            if (reviewRes.data.status === 0) {
                if (reviewRes.data.data.reviews !== null) {
                    newReviews = reviewRes.data.data.reviews;
                }                
            } else {
                message.error("获取审阅记录失败:", reviewRes.data.statusMsg);
            }
            setReviews(newReviews);
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, oriED]);

    //获取值后的操作
    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        return
    };

    //Tab变更
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    //点击行批注按钮
    const handleAddCommentClick = (row, index) => {
        setCommitStatus({
            isOpen: true,
            currentRow: { hid: voucherData.id, bid: row.id, billNumber: voucherData.billnumber, rowNumber: row.rownumber },
        });
    };

    //批注组件关闭
    const handleCommitClose = () => {
        setCommitStatus({
            isOpen: false,
            currentRow: undefined
        });
    };
    //批注组件点击提交
    const handleCommitOk = () => {
        setCommitStatus({
            isOpen: false,
            currentRow: undefined
        });
        //刷新批注列表
        handleRefreshComments();
    };
    //刷新批注列表
    const handleRefreshComments = async () => {
        //获取批注记录
        let newComments = [];
        const commentsRes = await reqGetEDComments({ hid: voucherData.id })
        if (commentsRes.data.status === 0) {
            newComments = commentsRes.data.data.comments;
        } else {
            message.error("刷新批注列表失败:" + commentsRes.data.statusMsg);
        }
        setComments(newComments);
    }

    //点击返回按钮
    const handleBackClick = () => {
        handleAddReview();
        onBack();
    }

    //提交审阅记录
    const handleAddReview = async () => {
        let reviewRecord = {
            id: 0,
            hid: voucherData.id,
            billnumber: voucherData.billnumber,
            starttime: dayjs(startTime).format("YYYYMMDDHHmmss"),
            endtime: dayjs(new Date()).format("YYYYMMDDHHmmss"),
            consumeseconds: dayjs(new Date()).diff(dayjs(startTime), "seconds")
        };
        const addRes = await reqAddEDReview(reviewRecord);
        if (addRes.data.status === 0) {
            message.success("本次审阅" + reviewRecord.consumeseconds + "秒.");
        } else {
            message.error("审阅记录提交服务器失败:" + addRes.data.statusMsg);
        }
    };

    return (voucherData !== undefined
        ? <>
            <Grid container spacing={1}>
                <Grid item xs={9}>
                    <Stack component="div" id="reviewED" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
                        <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                            <Typography variant="h3" component={"h3"}>执行单</Typography>
                        </Stack>
                        <Stack component="div" id="voucherHead" sx={{ p: 2 }}>
                            <Grid container id="VoucherHeader" spacing={2}>
                                <Grid item xs={1.5}>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="单据编码"
                                        itemKey="billnumber"
                                        initValue={voucherData.billnumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="billnumber"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <ScInput
                                        dataType={306}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="单据日期"
                                        itemKey="billdate"
                                        initValue={voucherData.billdate}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="billdate"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={520}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="部门"
                                        itemKey="department"
                                        initValue={voucherData.department}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="department"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={570}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="现场"
                                        itemKey="sceneitem"
                                        initValue={voucherData.sceneitem}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="sceneitem"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={510}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="执行人"
                                        itemKey="execperson"
                                        initValue={voucherData.execperson}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="execperson"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={580}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="执行模板"
                                        itemKey="eit"
                                        initValue={voucherData.eit}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="eit"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    <ScInput
                                        dataType={307}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="开始时间"
                                        itemKey="starttime"
                                        initValue={voucherData.starttime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="starttime"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    <ScInput
                                        dataType={307}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="结束时间"
                                        itemKey="endtime"
                                        initValue={voucherData.endtime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="endtime"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <ScInput
                                        dataType={405}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="状态"
                                        itemKey="status"
                                        initValue={voucherData.status}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="status"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="来源单据类型"
                                        itemKey="sourcetype"
                                        initValue={voucherData.sourcetype}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="sourcetype"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="来源单据号"
                                        itemKey="sourcebillnumber"
                                        initValue={voucherData.sourcebillnumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="sourcebillnumber"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="来源单据行号"
                                        itemKey="sourcerownumber"
                                        initValue={voucherData.sourcerownumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="sourcerownumber"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="说明"
                                        itemKey="description"
                                        placeholder={"请输入说明"}
                                        initValue={voucherData.description}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="description"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <ScInput
                                        dataType={403}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="允许增行"
                                        itemKey="allowaddrow"
                                        initValue={voucherData.allowaddrow}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="allowaddrow"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <ScInput
                                        dataType={403}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="允许删行"
                                        itemKey="allowdelrow"
                                        initValue={voucherData.allowdelrow}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="allowdelrow"
                                        positionID={0}
                                        rowIndex={-1}
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                        <ScVoucherBody bodyColumns={bodyColumns} addRowAction={() => { }} addRowVisible={false}>
                            <ScVoucherBodyRow >
                                {voucherData.body.map((row, index) => {
                                    return row.dr === 0
                                        ? (<tr key={"bodyrow" + row.rownumber}>
                                            <td>
                                                <Tooltip title="增加批注" key={`rowDelete${index}`}>
                                                    <span>
                                                        <IconButton size="small" sx={{ width: 40, height: 40 }} disabled={commitStatus.isOpen} onClick={() => handleAddCommentClick(row, index)}>
                                                            <AddCommentIcon color={commitStatus.isOpen ? "transparent" : "primary"} fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={302}
                                                    allowNull={false}
                                                    isEdit={false}
                                                    itemShowName="行号"
                                                    itemKey="rownumber"
                                                    initValue={row.rownumber}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="rownumber"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={560}
                                                    allowNull={false}
                                                    isEdit={false}
                                                    itemShowName="执行项目"
                                                    itemKey="eid"
                                                    initValue={row.eid}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="eid"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={row.eid.resulttype.id}
                                                    allowNull={false}
                                                    isEdit={false}
                                                    itemShowName="执行项目值"
                                                    itemKey="exectivevalue"
                                                    initValue={row.exectivevalue}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="exectivevalue"
                                                    positionID={1}
                                                    rowIndex={index}
                                                    udc={row.eid.udc}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={902}
                                                    allowNull={row.isrequirefile === 0}
                                                    isEdit={false}
                                                    itemShowName="附件"
                                                    itemKey="files"
                                                    initValue={row.files}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="files"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={590}
                                                    allowNull={false}
                                                    isEdit={false}
                                                    itemShowName="风险等级"
                                                    itemKey="risklevel"
                                                    initValue={row.risklevel}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="risklevel"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={301}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="填写说明"
                                                    itemKey="eiddescription"
                                                    initValue={row.eiddescription}
                                                    pickDone={handleGetValue}
                                                    placeholder=""
                                                    isBackendTest={false}
                                                    key="eiddescription"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={301}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="说明"
                                                    itemKey="description"
                                                    initValue={row.description}
                                                    pickDone={handleGetValue}
                                                    placeholder="请输入说明"
                                                    isBackendTest={false}
                                                    key="description"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={403}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="是否存在问题"
                                                    itemKey="iserr"
                                                    initValue={row.iserr}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="iserr"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={403}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="是否现场整改"
                                                    itemKey="isrectify"
                                                    initValue={row.isrectify}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="isrectify"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={403}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="是否问题处理"
                                                    itemKey="ishandle"
                                                    initValue={row.ishandle}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="ishandle"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={510}
                                                    allowNull={row.ishandle === 0}
                                                    isEdit={false}
                                                    itemShowName="问题处理人"
                                                    itemKey="handleperson"
                                                    initValue={row.handleperson}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="handleperson"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={307}
                                                    allowNull={row.ishandle === 0}
                                                    isEdit={false}
                                                    itemShowName="处理开始时间"
                                                    itemKey="handlestarttime"
                                                    initValue={row.handlestarttime}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="handlestarttime"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={307}
                                                    allowNull={row.ishandle === 0}
                                                    isEdit={false}
                                                    itemShowName="处理完成时间"
                                                    itemKey="handleendtime"
                                                    initValue={row.handleendtime}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="handleendtime"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={403}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="必传附件"
                                                    itemKey="isrequirefile"
                                                    initValue={row.isrequirefile}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="isrequirefile"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={403}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="必须现场拍照"
                                                    itemKey="isonsitephoto"
                                                    initValue={row.isonsitephoto}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="isonsitephoto"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={405}
                                                    allowNull={true}
                                                    isEdit={false}
                                                    itemShowName="状态"
                                                    itemKey="status"
                                                    initValue={row.status}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="status"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                        </tr>
                                        )
                                        : null
                                })}
                            </ScVoucherBodyRow>
                        </ScVoucherBody>
                        <Stack component="div" id="voucherRoot">
                            <Grid container id="voucherRoot" spacing={2}>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={510}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="创建人"
                                        itemKey="createuser"
                                        initValue={voucherData.createuser}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="createuser"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={307}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="创建日期"
                                        itemKey="createdate"
                                        initValue={voucherData.createdate}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="createdate"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={510}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="修改人"
                                        itemKey="modifyuser"
                                        initValue={voucherData.modifyuser}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="modifyuser"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={307}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="更新日期"
                                        itemKey="modifydate"
                                        initValue={voucherData.modifydate}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="modifydate"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={510}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="确认人"
                                        itemKey="confirmuser"
                                        initValue={voucherData.confirmuser}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="confirmuser"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={307}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="确认日期"
                                        itemKey="confirmdate"
                                        initValue={voucherData.confirmdate}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="confirmdate"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                        <DialogActions sx={{ m: 1 }}>
                            <Button variant="contained" onClick={handleBackClick} >返回</Button>
                        </DialogActions>
                    </Stack>
                </Grid>
                <Grid item xs={3}>
                    <Box sx={{ width: "100%", height: "100%" }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="reviewED tab">
                                <Tab label="批注列表" id="commitList" />
                                <Tab label="审阅列表" id="reviewList" />
                            </Tabs>
                        </Box>
                        <Box sx={{ width: "100%", height: commitStatus.isOpen ? 512 : 742, borderWidth: 1, borderColor: "divider", borderStyle: "solid", overflow: "auto" }}>
                            {tabValue === 0
                                ? <CommentsList comments={comments} />
                                : <ReviewsList reviews={reviews} />
                            }

                        </Box>
                        {commitStatus.isOpen
                            ? <Box mt={2}>
                                <CommentInput
                                    isOpen={commitStatus.isOpen}
                                    hid={commitStatus.currentRow.hid}
                                    bid={commitStatus.currentRow.bid}
                                    rowNumber={commitStatus.currentRow.rowNumber}
                                    billNumber={commitStatus.currentRow.billNumber}
                                    toPerson={voucherData.createuser}
                                    onOk={handleCommitOk}
                                    onCancel={handleCommitClose}
                                />
                            </Box>
                            : null
                        }
                    </Box>

                </Grid>
            </Grid>
        </>
        : <Loader />
    );
};

export default ReviewED;