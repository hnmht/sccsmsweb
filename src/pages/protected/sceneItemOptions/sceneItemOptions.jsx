import { useEffect, useState } from "react";
import {
    Paper,
    Grid
} from "@mui/material";
import { isEqual, cloneDeep } from "lodash";
import { message } from "mui-message";

import { Divider, Button } from "../../../component/ScMui/ScMui";
import Loader from "../../../component/Loader/Loader";
import ScInput from '../../../component/ScInput';
import PageTitle from "../../../component/PageTitle/PageTitle";
import { reqSIOs, reqEditSIO } from "../../../api/cs";
import { InitDocCache } from "../../../storage/db/db";
import { MultiSortByArr } from "../../../utils/tools";
import useContentHeight from "../../../hooks/useContentHeight";

const generateErrors = (rowNumber) => {
    let errors = [];
    //生成表体错误信息
    for (let i = 0; i < rowNumber; i++) {
        errors.push({});
    }
    return errors;
};

//检查错误
const checkError = (errors) => {
    // console.log("EditExecItem errors:",errors);
    let number = 0;
    for (let key in errors) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};

function SceneItemOptions() {
    const [sios, setSios] = useState([]);
    const [oriSios, setOriSios] = useState([]);
    const [errors, setErrors] = useState([]);

    const contentHeight = useContentHeight();

    //点击保存按钮
    const handleSave = async (item, index) => {
        const res = await reqEditSIO(item, true);
        if (res.data.status === 0) {
            message.success("修改现场档案" + item.name + "成功");
            handleRefresh(index);
        } else {
            message.error("修改现场档案" + item.name + "失败:", res.data.statusMsg);
        }
        await InitDocCache("sceneitemoption");
    };
    //点击取消按钮
    const handleCancel = (index) => {
        const newSio = cloneDeep(oriSios[index]);
        const newSios = cloneDeep(sios);
        newSios[index] = newSio;
        setSios(newSios);
    };
    //刷新选项列表
    const handleRefresh = async (index) => {
        const res = await reqSIOs(true);
        let newOriSios = [];
        let newSios = cloneDeep(sios);
        if (res.data.status === 0) {
            newOriSios = res.data.data;
            newOriSios.sort(MultiSortByArr([{ field: "id", order: "asc" }]));
            let newSio = cloneDeep(newOriSios[index]);    
            newSios[index] = newSio;
        }
        setSios(newSios);
        setOriSios(newOriSios);
    };
    //系统获取值之后
    const handleGetValue = (value, itemkey, positionID, rowIndex, errMsg) => {
        setSios((prevState) => {
            let newSios = cloneDeep(prevState);
            newSios[rowIndex][itemkey] = value;
            return newSios;
        });

        setErrors((prevState) => {
            let newErrors = cloneDeep(prevState);
            newErrors[rowIndex][itemkey] = errMsg;
            return newErrors;
        });
    };

    useEffect(() => {
        async function getData() {
            const res = await reqSIOs(true);
            let newSios = [];
            if (res.data.status === 0) {
                newSios = res.data.data;
                newSios.sort(MultiSortByArr([{ field: "id", order: "asc" }]));
            }
            setSios(newSios);
            setOriSios(newSios);
            setErrors(generateErrors(newSios.length))
        }
        getData();
    }, []);

    return (sios.length > 0
        ? <>
            <PageTitle pageName="现场档案自定义项" />
            <Divider my={2} />
            <Paper sx={{ width: "100%", height: contentHeight, overflow: "auto", pt: 4 }}>
                {sios.map((item, index) => {
                    //取消按钮是否可用
                    const cancelDisabled = isEqual(item, oriSios[index]);
                    //按钮是否能否使用                   
                    const saveDisabled = cancelDisabled || checkError(errors[index]);
                    //启用是否可编辑
                    const enableEnabled = item.ismodify === 0;
                    //显示名称是否可编辑 
                    const displayNameEnable = item.enable === 1;
                    //档案类别是否可编辑(启用 且 可修改 )
                    const udcEnable = item.enable === 1 && item.ismodify === 0;
                    //默认值是否可编辑
                    const defaultValueEnable = item.enable === 1 && item.udc.id > 0;
                    return (
                        <Grid key={index} container spacing={2} sx={{ width: "100%" }}>
                            <Grid item xs={1} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ScInput
                                    dataType={403}
                                    allowNull={false}
                                    isEdit={enableEnabled}
                                    itemShowName="启用"
                                    itemKey="enable"
                                    initValue={item.enable}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    isBackendTest={false}
                                    key="enable"
                                    rowIndex={index}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <ScInput
                                    dataType={301}
                                    allowNull={false}
                                    isEdit={false}
                                    itemShowName="编码"
                                    itemKey="code"
                                    initValue={item.code}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    isBackendTest={false}
                                    key="code"
                                    rowIndex={index}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <ScInput
                                    dataType={301}
                                    allowNull={false}
                                    isEdit={false}
                                    itemShowName="名称"
                                    itemKey="name"
                                    initValue={item.name}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    isBackendTest={false}
                                    key="name"
                                    rowIndex={index}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <ScInput
                                    dataType={301}
                                    allowNull={false}
                                    isEdit={displayNameEnable}
                                    itemShowName="显示名称"
                                    itemKey="displayname"
                                    initValue={item.displayname}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    isBackendTest={false}
                                    key="displayname"
                                    rowIndex={index}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <ScInput
                                    dataType={530}
                                    allowNull={item.enable === 0}
                                    isEdit={udcEnable}
                                    itemShowName="档案类别"
                                    itemKey="udc"
                                    initValue={item.udc}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    isBackendTest={false}
                                    key="udc"
                                    rowIndex={index}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <ScInput
                                    dataType={550}
                                    allowNull={true}
                                    isEdit={defaultValueEnable}
                                    itemShowName="默认值"
                                    itemKey="defaultvalue"
                                    initValue={item.defaultvalue}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    isBackendTest={false}
                                    key="defaultvalue"
                                    rowIndex={index}
                                    udc={item.udc}
                                />
                            </Grid>
                            <Grid item xs={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Button
                                    variant="contained"
                                    disabled={saveDisabled}
                                    m={1}
                                    onClick={() => handleSave(item, index)}
                                >
                                    保存
                                </Button>
                                <Button
                                    variant="contained"
                                    m={1}
                                    disabled={cancelDisabled}
                                    onClick={() => handleCancel(index)}
                                >
                                    取消
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider my={2} />
                            </Grid>
                        </Grid>
                    );
                })}
            </Paper>
        </>
        : <Loader />
    );
}

export default SceneItemOptions;