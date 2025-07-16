import { Fragment, useState, useEffect } from "react";
import {
    Grid,
    Dialog
} from "@mui/material";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import Loader from "../../../component/Loader/Loader";
import SicTree from "./sicTree";
import EditSI from "./editSceneItem";
import { columns, rowActionsDefine, delMultipleDisabled, GetDynamicColumns } from "./constructor";
import { GetSICacheByClassId, InitDocCache } from "../../../storage/db/db";
import { reqDeleteSI, reqDeleteSIs, reqSIOs } from "../../../api/sceneItem";
import { message } from "mui-message";
import { MultiSortByArr } from "../../../utils/tools";


const SceneItem = () => {
    const [dynamicColumns, setDynamicColumns] = useState(undefined);
    const [options, setOptions] = useState([]);
    const [rows, setRows] = useState([]);
    const [currentSIC, setCurrentSIC] = useState(undefined);
    const [diagStatus, setDiagStatus] = useState({
        currentSI: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });

    useEffect(() => {
        //获取动态列
        async function getSioption() {
            let newColumns = columns;
            let newOptions = [];
            const res = await reqSIOs();
            if (res.data.status === 0) {
                newOptions = res.data.data;
                newOptions.sort(MultiSortByArr([{ field: "id", order: "asc" }]));
                newColumns = GetDynamicColumns(newColumns, newOptions);
            }
            setDynamicColumns(newColumns);
            setOptions(newOptions);
        }
        getSioption();
    }, []);

    //对话框关闭
    const handleDiagClose = () => {
        setDiagStatus({
            currentSI: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
    };
    //对话框编辑执行项目档案类别页面点击确定按钮
    const handelDiagOk = () => {
        setDiagStatus({
            currentSI: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        //重新向服务器请求用户自定义档案类别列表数据
        handleRefreshSI();
    };
    //表头点击增加按钮
    const handleAddSI = () => {
        setDiagStatus({
            currentSI: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    //表体点击复制新增按钮
    const handleRowCopyAdd = (doc) => {
        setDiagStatus({
            currentSI: doc,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };

    //表体点击详情按钮
    const handleRowDetail = (doc) => {
        setDiagStatus({
            currentSI: doc,
            diagOpen: true,
            isNew: false,
            isModify: false
        });
    };
    //表体点击编辑按钮
    const handleRowEdit = async (doc) => {
        setDiagStatus({
            currentSI: doc,
            diagOpen: true,
            isNew: false,
            isModify: true
        });
    };
    //表体行点击删除按钮
    const handleRowDelete = async (doc) => {
        //向服务器请求删除
        const delRes = await reqDeleteSI(doc);
        if (delRes.data.status === 0) {
            message.success("删除档案" + doc.name + "成功");
        } else {
            message.error("删除档案" + doc.name + "失败:" + delRes.data.statusMsg);
        }
        //更新本地缓存，刷新现场档案列表
        handleRefreshSI();
    };

    //表头点击批量删除按钮
    const handleDelMultipleAction = async (docs) => {
        const res = await reqDeleteSIs(docs);
        if (res.data.status === 0) {
            message.success("批量删除档案成功");
        } else {
            message.error("批量删除档案失败:" + res.data.statusMsg);
        }
        //更新本地缓存，刷新现场档案列表
        handleRefreshSI();
    };
    //获取当前Sic
    const handleGetCurrentSic = async (item) => {
        //设置当前现场档案类别
        setCurrentSIC(item);
        //从本地缓存获取当前类别下的所有现场档案
        const newSis = await GetSICacheByClassId(item.id);
        //更新现场档案列表
        setRows(newSis);
    };

    //刷新现场档案
    const handleRefreshSI = async (sic = currentSIC) => {
        //向服务器请求更新本地缓存
        await InitDocCache("sceneitem");
        //从本地缓存获取当前类别下的所有现场档案
        const newSis = await GetSICacheByClassId(sic.id);
        //更新现场档案列表
        setRows(newSis);
    };

    return (
        <Fragment>
            <PageTitle pageName="现场档案" displayHelp={true} helpUrl="/helps/sceneItem" />
            <Divider my={2} />
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <SicTree selectOk={handleGetCurrentSic} />
                </Grid>
                <Grid item xs={10}>
                    {dynamicColumns !== undefined
                        ? <DocList
                            headAddDisabled={!currentSIC || currentSIC.status !== 0}
                            headRefreshDisabled={!currentSIC}
                            delMultipleDisabled={delMultipleDisabled}
                            delMultipleAction={handleDelMultipleAction}
                            columns={dynamicColumns}
                            rows={rows}
                            rowActionsDefine={rowActionsDefine}
                            refreshAction={() => handleRefreshSI(currentSIC)}
                            addAction={handleAddSI}
                            rowCopyAdd={handleRowCopyAdd}
                            rowViewDetail={handleRowDetail}
                            rowEdit={handleRowEdit}
                            rowDelete={handleRowDelete}
                        />
                        : <Loader />
                    }
                </Grid>
            </Grid>
            <Dialog
                maxWidth="sm"
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 1024, minHeight: 512 } }}
                closeAfterTransition={false}
            >
                <EditSI
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriSI={diagStatus.currentSI}
                    options={options}
                    SIC={currentSIC}
                    onCancel={handleDiagClose}
                    onOk={handelDiagOk}
                />
            </Dialog>
        </Fragment>
    );
}

export default SceneItem;