import { useState, useMemo } from "react";
import { Dialog,Divider } from "@mui/material";
import { message } from "mui-message";

import PageTitle from "../../../../component/PageTitle/PageTitle";
import ScReport from "../../../../component/ScReport/ScReport";
import { QueryPanel, transConditionsToString } from "../../../../component/QueryPanel";
import { reqWOReport } from "../../../../api/report";
import { generateWODefaultCons, columnDef, columnVisibility, generateWOQueryFields } from "./constructor";

const WorkOrderStat = () => {
    const [woConditions, setWoConditions] = useState(generateWODefaultCons());
    const [rows, setRows] = useState([]);
    const [diagOpen, setDiagOpen] = useState(false);
    const woQueryFields = useMemo(generateWOQueryFields,[]);
    const columns = useMemo(columnDef, []);
   
    const handleRequestData = async(cons = woConditions) => {
        let queryString = transConditionsToString(cons);
        let worsRes = await reqWOReport({ queryString: queryString });
        let newRows = [];
        if (worsRes.data.status === 0) {
            newRows = worsRes.data.data;
        } else {
            message.warning(worsRes.data.statusMsg);
        }
        setRows(newRows);
    }
    //QueryPanel点击确认
    const handleWoQueryOk = async (cons) => {
        setWoConditions(cons);
        setDiagOpen(false);
        //向服务器请求数据
        handleRequestData(cons);
    };

    //报表表头点击请求数据
    const handleFilterAction = async() => {
        setDiagOpen(true);
    };

    return (<>
        <PageTitle pageName="指令单统计" displayHelp={true} helpUrl="/helps/workOrderStatWeb" />
        <Divider my={2}/>
        <ScReport
            rows={rows}
            columns={columns}
            defaultHideColumn={columnVisibility}
            filterAction={handleFilterAction}
        />
        <Dialog
            open={diagOpen}
            fullWidth
            maxWidth={"lg"}
            onClose={() => setDiagOpen(false)}
            closeAfterTransition={false}
        >
            <QueryPanel
                title="过滤条件"
                queryFields={woQueryFields}
                initalConditions={woConditions}
                onOk={handleWoQueryOk}
                onCancel={() => setDiagOpen(false)}
            />
        </Dialog>
    </>);
};

export default WorkOrderStat;