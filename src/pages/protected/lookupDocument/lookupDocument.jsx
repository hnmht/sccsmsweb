import { useMemo, useState } from "react";
import { Dialog } from "@mui/material";
import { Divider } from "../../../component/ScMui/ScMui";
import { message } from "mui-message";
import PageTitle from "../../../component/PageTitle/PageTitle";
import ScReport from "../../../component/ScReport/ScReport";
import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";

import { reqGetDocReport } from "../../../api/document";
import { generateDocReportDefaultCons, generateDocReportFields, defaultHideCol, columnDef } from "./constructor";

const LookupDocument = () => {
    const [conditions, setConditions] = useState(generateDocReportDefaultCons());
    const [rows, setRows] = useState([]);
    const [diagOpen, setDiagOpen] = useState(false);
    const queryFields = useMemo(generateDocReportFields, []);
    const columns = useMemo(columnDef, []);
    const columnVisibility = useMemo(defaultHideCol, [])

    const handleRequestData = async (cons = conditions) => {
        let queryString = transConditionsToString(cons);
        let res = await reqGetDocReport({ queryString: queryString });
        let newRows = [];
        if (res.data.status === 0) {
            newRows = res.data.data;
        } else {
            message.warning(res.data.statusMsg);
        }
        setRows(newRows);
    }
    //QueryPanel点击确认
    const handleQueryOk = async (cons) => {
        setConditions(cons);
        setDiagOpen(false);
        //向服务器请求数据
        handleRequestData(cons);
    };

    //报表表头点击请求数据
    const handleFilterAction = async () => {
        setDiagOpen(true);
    };

    return (<>
        <PageTitle pageName="查阅文档" displayHelp={true} helpUrl="/helps/lookupDocument" />
        <Divider my={2} />
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
                queryFields={queryFields}
                initalConditions={conditions}
                onOk={handleQueryOk}
                onCancel={() => setDiagOpen(false)}
            />
        </Dialog>
    </>);
};

export default LookupDocument;