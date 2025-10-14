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
    newED.createDate = dayjs(newED.createDate).format("YYYYMMDDHHmm");
    newED.modifyDate = dayjs(newED.modifyDate).format("YYYYMMDDHHmm");
    newED.confirmDate = dayjs(newED.confirmDate).format("YYYYMMDDHHmm");
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
            if (commentsRes.status ) {
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
            if (reviewRes.status) {
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
            currentRow: { hid: voucherData.id, bid: row.id, billNumber: voucherData.billNumber, rowNumber: row.rowNumber },
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
        if (commentsRes.status) {
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
            billNumber: voucherData.billNumber,
            startTime: dayjs(startTime).format("YYYYMMDDHHmmss"),
            endTime: dayjs(new Date()).format("YYYYMMDDHHmmss"),
            consumeseconds: dayjs(new Date()).diff(dayjs(startTime), "seconds")
        };
        const addRes = await reqAddEDReview(reviewRecord);
        if (addRes.status) {
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
                                        itemKey="billNumber"
                                        initValue={voucherData.billNumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="billNumber"
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
                                        itemKey="billDate"
                                        initValue={voucherData.billDate}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="billDate"
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
                                        itemKey="csa"
                                        initValue={voucherData.csa}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="csa"
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
                                        itemKey="executor"
                                        initValue={voucherData.executor}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="executor"
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
                                        itemKey="ept"
                                        initValue={voucherData.ept}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="ept"
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
                                        itemKey="startTime"
                                        initValue={voucherData.startTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="startTime"
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
                                        itemKey="endTime"
                                        initValue={voucherData.endTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="endTime"
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
                                        itemKey="sourceType"
                                        initValue={voucherData.sourceType}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="sourceType"
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
                                        itemKey="sourceBillNumber"
                                        initValue={voucherData.sourceBillNumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="sourceBillNumber"
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
                                        itemKey="sourceRowNumber"
                                        initValue={voucherData.sourceRowNumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="sourceRowNumber"
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
                                        itemKey="allowAddRow"
                                        initValue={voucherData.allowAddRow}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="allowAddRow"
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
                                        itemKey="allowDelRow"
                                        initValue={voucherData.allowDelRow}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="allowDelRow"
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
                                        ? (<tr key={"bodyrow" + row.rowNumber}>
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
                                                    itemKey="rowNumber"
                                                    initValue={row.rowNumber}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="rowNumber"
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
                                                    itemKey="epa"
                                                    initValue={row.epa}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="epa"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={row.epa.resultType.id}
                                                    allowNull={false}
                                                    isEdit={false}
                                                    itemShowName="执行项目值"
                                                    itemKey="executionValue"
                                                    initValue={row.executionValue}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="executionValue"
                                                    positionID={1}
                                                    rowIndex={index}
                                                    udc={row.epa.udc}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={902}
                                                    allowNull={row.isRequireFile === 0}
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
                                                    itemKey="riskLevel"
                                                    initValue={row.riskLevel}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="riskLevel"
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
                                                    itemKey="epaDescription"
                                                    initValue={row.epaDescription}
                                                    pickDone={handleGetValue}
                                                    placeholder=""
                                                    isBackendTest={false}
                                                    key="epaDescription"
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
                                                    itemKey="isIssue"
                                                    initValue={row.isIssue}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="isIssue"
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
                                                    itemKey="isRectify"
                                                    initValue={row.isRectify}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="isRectify"
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
                                                    itemKey="isHandle"
                                                    initValue={row.isHandle}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="isHandle"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={510}
                                                    allowNull={row.isHandle === 0}
                                                    isEdit={false}
                                                    itemShowName="问题处理人"
                                                    itemKey="issueOwner"
                                                    initValue={row.issueOwner}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="issueOwner"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={307}
                                                    allowNull={row.isHandle === 0}
                                                    isEdit={false}
                                                    itemShowName="处理开始时间"
                                                    itemKey="handleStartTime"
                                                    initValue={row.handleStartTime}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="handleStartTime"
                                                    positionID={1}
                                                    rowIndex={index}
                                                />
                                            </td>
                                            <td>
                                                <ScInput
                                                    dataType={307}
                                                    allowNull={row.isHandle === 0}
                                                    isEdit={false}
                                                    itemShowName="处理完成时间"
                                                    itemKey="handleEndTime"
                                                    initValue={row.handleEndTime}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="handleEndTime"
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
                                                    itemKey="isRequireFile"
                                                    initValue={row.isRequireFile}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="isRequireFile"
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
                                                    itemKey="isOnSitePhoto"
                                                    initValue={row.isOnSitePhoto}
                                                    pickDone={handleGetValue}
                                                    isBackendTest={false}
                                                    key="isOnSitePhoto"
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
                                        itemKey="creator"
                                        initValue={voucherData.creator}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="creator"
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
                                        itemKey="createDate"
                                        initValue={voucherData.createDate}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="createDate"
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
                                        itemKey="modifier"
                                        initValue={voucherData.modifier}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="modifier"
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
                                        itemKey="modifyDate"
                                        initValue={voucherData.modifyDate}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="modifyDate"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={510}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="confirm人"
                                        itemKey="confirmer"
                                        initValue={voucherData.confirmer}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="confirmer"
                                        positionID={2}
                                        rowIndex={-1}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={307}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="confirm日期"
                                        itemKey="confirmDate"
                                        initValue={voucherData.confirmDate}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="confirmDate"
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
                                    toPerson={voucherData.creator}
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