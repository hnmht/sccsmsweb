import { useState, useEffect, useRef } from "react";
import {
    Stack,
    Typography,
    Grid,
    DialogActions,
    Button,
    Tooltip,
    IconButton,
    TableCell
} from "@mui/material";

import { cloneDeep } from "lodash";
import { message } from "mui-message";
import { DeleteRowIcon, PrintIcon } from "../../../component/PubIcon/PubIcon";
import dayjs from "../../../utils/myDayjs";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../component/ScVoucher";
import Loader from "../../../component/Loader/Loader";
import ScInput from "../../../component/ScInput";

import store from "../../../store";
import { MultiSortByArr } from "../../../utils/tools";
import { PeriodStartandEnd } from "../../../storage/dataTypes";
import { useReactToPrint } from "react-to-print";
import { LDPrintRegFormA4 ,LDPrintDeliveryA4} from "./printTemp/printA4";

import { reqAddLD, reqEditLD } from "../../../api/lpaIssueDoc";
import { voucherRow, bodyColumns, headFiles } from "./constructor";

//生成初始数据
const getInitialValue = async (isNew, isModify, oriLd) => {
    const { user } = store.getState();
    const { person, department } = user;
    let newLd = {};

    if (isNew) {//直接新增单据
        newLd = {
            id: 0,
            billnumber: "",
            billdate: dayjs(new Date()).format("YYYYMMDD"),
            department: department,
            description: "",
            period: "month",
            startdate: dayjs(new Date()).startOf("month").format("YYYYMMDD"),
            enddate: dayjs(new Date()).endOf("month").format("YYYYMMDD"),
            hfiles: [headFiles],
            body: [voucherRow],
            sourcetype: "UA",
            status: 0,
            createuser: person,
            createdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
            modifyuser: { id: 0, code: "", name: "" },
            modifydate: dayjs(new Date()).format("YYYYMMDDHHmm"),
            confirmuser: { id: 0, code: "", name: "" },
            confirmdate: dayjs(new Date()).format("YYYYMMDDHHmm"),
            dr: 0
        };
    } else {
        if (!oriLd) {
            return
        } else {
            if (isModify) { //编辑
                newLd = cloneDeep(oriLd);
                newLd.createdate = dayjs(newLd.createdate).format("YYYYMMDDHHmm");
                newLd.modifyuser = person;
                newLd.modifydate = dayjs(newLd.modifydate).format("YYYYMMDDHHmm");
                newLd.confirmuser = { id: 0, code: "", name: "" };
                newLd.confirmdate = dayjs(newLd.confirmdate).format("YYYYMMDDHHmm");
            } else {//查看
                newLd = cloneDeep(oriLd);
                newLd.createdate = dayjs(newLd.createdate).format("YYYYMMDDHHmm");
                newLd.modifydate = dayjs(newLd.modifydate).format("YYYYMMDDHHmm");
                newLd.confirmdate = dayjs(newLd.confirmdate).format("YYYYMMDDHHmm");
            }
        }
    }
    return newLd;
};
//生成错误信息
const generateErrors = (rowNumber) => {
    let voucherErrors = {
        body: [],
    }
    //生成表体错误信息
    for (let i = 0; i < rowNumber; i++) {
        voucherErrors.body.push({});
    }
    return voucherErrors;
};

//检查是否存在错误信息
const checkVoucherErrors = (voucherErrors) => {
    let number = 0;
    //表头错误信息
    for (let key in voucherErrors) {
        if (key !== "body" && voucherErrors[key].isErr) {
            number = number + 1;
        }
    }
    //表体错误信息
    voucherErrors.body.forEach((row) => {
        for (let key in row) {
            if (row[key].isErr) {
                number = number + 1;
            }
        }
    });
    return number > 0;
};

const EditLpaIssueDoc = ({ isOpen, isNew, isModify, oriLd, onCancel, onOk }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState(undefined);
    const isEdit = !(!isModify && !isNew);

    let printAreaRef = useRef();
    let printAreaRefb = useRef();
    useEffect(() => {
        async function initVoucher() {
            const newLd = await getInitialValue(isNew, isModify, oriLd);
            setVoucherData(newLd);
            setErrors(generateErrors(newLd.body.length));
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, isModify, oriLd, isNew]);

    //获取值后的操作
    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        if (voucherData === undefined || !isEdit || !isOpen) {
            return
        }

        //设置单据值
        setVoucherData((prevState) => {
            const newData = cloneDeep(prevState);
            switch (positionID) {
                case 0://修改表头字段 
                    //如果修改的是周期字段
                    if (itemkey === "period" && value !== prevState.period) {
                        const p = PeriodStartandEnd(value);
                        newData.startdate = p.startDate;
                        newData.enddate = p.endDate;
                    };
                    newData[itemkey] = value;
                    break;
                case 1:
                    //如果修改的是领用人字段
                    if (itemkey === "recipient" && value.id !== prevState.body[rowIndex].recipient.id) {
                        //获取岗位名称                     
                        newData.body[rowIndex].opname = value.opname;
                        //获取部门名称
                        newData.body[rowIndex].deptname = value.deptname;
                    }

                    //如果修改的是劳保用品字段
                    if (itemkey === "lp" && value.id !== prevState.body[rowIndex].lp.id) {
                        //获取劳保用品编码                    
                        newData.body[rowIndex].lpcode = value.code;
                        //获取劳保用品规格型号
                        newData.body[rowIndex].lpmodel = value.model;
                        //获取劳保用品计量单位
                        newData.body[rowIndex].lpunit = value.unit;
                    }
                    newData.body[rowIndex][itemkey] = value;
                    break;
                case 2:
                    newData[itemkey] = value;
                    break;
                default:
                    break;
            }

            return newData;
        });
        //设置错误信息
        setErrors((prevState) => {
            let newErrors = cloneDeep(prevState);
            switch (positionID) {
                case 0:
                    newErrors[itemkey] = errMsg;
                    break;
                case 1:
                    newErrors.body[rowIndex][itemkey] = errMsg;
                    break;
                case 2:
                    newErrors[itemkey] = errMsg;
                    break;
                default:
                    break;
            }
            return newErrors;
        });

    };
    //增加&修改单据
    const handleAddLD = async () => {
        const thisLD = cloneDeep(voucherData);
        delete thisLD.createdate;
        delete thisLD.modifydate;
        delete thisLD.confirmdate;

        if (isModify) {
            const editRes = await reqEditLD(thisLD);
            if (editRes.data.status === 0) {
                message.success("修改劳保用品发放单成功,单据编号:" + editRes.data.data.billnumber);
            } else {
                message.error("修改劳保用品发放单失败" + editRes.data.statusMsg);
            }
        } else {
            const addRes = await reqAddLD(thisLD);
            if (addRes.data.status === 0) {
                message.success("新增劳保用品发放单成功,单据编号:" + addRes.data.data.billnumber);
            } else {
                message.error("新增劳保用品发放单失败" + addRes.data.statusMsg);
            }
        }
        onOk();
    };
    //增行
    const handleAddRow = () => {
        //生成表体数据
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherRow);
        //自动生成行号
        if (newVoucherData.body.length === 1) { //如果表体只有一行
            newRow.rownumber = newVoucherData.body[0].rownumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rownumber", order: "asc" }]));
            newRow.rownumber = newVoucherData.body[newVoucherData.body.length - 1].rownumber + 10;
        }
        //填写处理人、处理开始时间、处理结束时间
        newRow.starttime = newVoucherData.starttime;
        newRow.endtime = newVoucherData.endtime;
        newRow.classhour = newVoucherData.classhour;
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
        //生成错误信息数据
        let newErrors = cloneDeep(errors);
        newErrors.body.push({});
        setErrors(newErrors);
    };
    //删行
    const handleDeleteRow = (index, row) => {
        if (voucherData.body.length === 1) {
            message.error("不能删除最后一行!");
            return
        }
        const newVoucherData = cloneDeep(voucherData);
        let newErrors = cloneDeep(errors);
        if (isModify) {
            //判断是否在编辑状态下新增的行
            if (row.id === 0) {
                newVoucherData.body.splice(index, 1);//新增的行直接删除掉
                newErrors.body.splice(index, 1);
            } else {
                newVoucherData.body[index].dr = 1;  //原有行修改删除标志
                newErrors.body[index] = {}; //将删除掉的行所有错误信息归零
            }
        } else {
            //新增状态下直接删除行
            newVoucherData.body.splice(index, 1);
            newErrors.body.splice(index, 1);
        }
        setErrors(newErrors);
        setVoucherData(newVoucherData);
    };
    //打印签字表
    const handlePrintClick = useReactToPrint({
        content: () => printAreaRef.current,
    });

    //打印出库单
    const handlePrintDeliveryClick = useReactToPrint({
        content: () => printAreaRefb.current,
    });

    return (voucherData !== undefined
        ? <>
            <Stack component="div" id="eidtED" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
                <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                    <Typography variant="h3" component={"h3"}>劳保用品发放单</Typography>
                </Stack>
                <Stack component="div" id="voucherHead" sx={{ p: 2 }}>
                    <Grid container id="VoucherHeader" spacing={2}>
                        <Grid item xs={1}>
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
                                isEdit={isEdit}
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
                        <Grid item xs={1}>
                            <ScInput
                                dataType={520}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="发放部门"
                                itemKey="department"
                                initValue={voucherData.department}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="department"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={407}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="周期"
                                itemKey="period"
                                initValue={voucherData.period}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="period"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={306}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="起始日期"
                                itemKey="startdate"
                                initValue={voucherData.startdate}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="startdate"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={306}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="截至日期"
                                itemKey="enddate"
                                initValue={voucherData.enddate}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="enddate"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={902}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="发放单附件"
                                itemKey="hfiles"
                                initValue={voucherData.hfiles}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="hfiles"
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
                        <Grid item xs={4}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={isEdit}
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
                    </Grid>
                </Stack>
                <ScVoucherBody
                    bodyColumns={bodyColumns}
                    addRowAction={handleAddRow}
                    addRowVisible={isEdit}
                    title="表体内容"
                >
                    <ScVoucherBodyRow >
                        {voucherData.body.map((row, index) => {
                            const delButtonEnabled = (!isEdit || (row.allowdelrow === 0));
                            return row.dr === 0
                                ? (<tr key={"bodyrow" + row.rownumber}>
                                    <TableCell variant="td">
                                        <Tooltip title="删行" key={`rowDelete${index}`}>
                                            <span>
                                                <IconButton size="small" sx={{ width: 40, height: 40 }} onClick={() => handleDeleteRow(index, row)} disabled={delButtonEnabled}>
                                                    <DeleteRowIcon color={!delButtonEnabled ? "error" : "transparent"} fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </TableCell>
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
                                            dataType={510}
                                            allowNull={false}
                                            isEdit={isEdit}
                                            itemShowName="领用人"
                                            itemKey="recipient"
                                            initValue={row.recipient}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="recipient"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="岗位"
                                            itemKey="opname"
                                            initValue={row.opname}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="opname"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="部门"
                                            itemKey="deptname"
                                            initValue={row.deptname}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="deptname"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="劳保用品编码"
                                            itemKey="lpcode"
                                            initValue={row.lpcode}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="lpcode"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={630}
                                            allowNull={false}
                                            isEdit={isEdit}
                                            itemShowName="劳保用品"
                                            itemKey="lp"
                                            initValue={row.lp}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="lp"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="规格型号"
                                            itemKey="lpmodel"
                                            initValue={row.lpmodel}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="lpmodel"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="计量单位"
                                            itemKey="lpunit"
                                            initValue={row.lpunit}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="lpunit"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={302}
                                            allowNull={false}
                                            isEdit={isEdit}
                                            itemShowName="数量"
                                            itemKey="quantity"
                                            initValue={row.quantity}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="quantity"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={902}
                                            allowNull={true}
                                            isOnsitePhoto={false}
                                            isEdit={isEdit}
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
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={isEdit}
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
                    {isEdit
                        ? <>
                            <Button color="error" onClick={onCancel} >取消</Button>
                            <Button variant="contained" disabled={checkVoucherErrors(errors)} onClick={handleAddLD}>{isModify ? "保存" : "增加"}</Button>
                        </>
                        :<>
                            <div style={{ display: "none" }}>
                                <LDPrintRegFormA4 voucherData={voucherData} ref={printAreaRef} />
                                <LDPrintDeliveryA4 voucherData={voucherData} ref={printAreaRefb}/>
                            </div>
                            <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrintDeliveryClick}>打印出库单</Button>
                            <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrintClick}>打印签字表</Button>
                            <Button variant="contained" onClick={onCancel} >返回</Button>
                        </>
                    }
                </DialogActions>
            </Stack>
        </>
        : <Loader />
    );
};

export default EditLpaIssueDoc;