import { useEffect, useState } from "react";
import { DialogActions, DialogContent, DialogTitle,Button } from "@mui/material";

import { Divider } from "../../../../component/ScMui/ScMui";
import DocTable from "../../../../component/DocTable/DocTable";
import { transConditionsToString } from "../../../../component/QueryPanel";
import { reqReferWO } from "../../../../api/workOrder";
import { columns } from "./woConstructor";

const WORefer = ({ title, conditions,cancelClickAction,okClickAction,filterAction }) => {
    const [rows, setRows] = useState([]);
    const [currentItem, setCurrentItem] = useState({id:0})
    useEffect(() => {
        async function reqData() {
            let querystring = transConditionsToString(conditions);
            const res = await reqReferWO({ querystring: querystring });
            let newRows = [];
            if (res.data.status === 0) {
                newRows = res.data.data;
            }
            setRows(newRows);
        }
        reqData();
    }, [conditions]);

    const handleClickItem = (item) => {
        setCurrentItem(item);
    };

    const handleDoubleClickItem = (item ) => {
        // console.log("doubleClick");
        setCurrentItem(item);
        okClickAction(item);
    };

    return (
        <>
            <DialogTitle>
                {title}
            </DialogTitle>
            <Divider />
            <DialogContent>
                <DocTable
                    columns={columns}
                    rows={rows}
                    headRefreshVisible={false}
                    headFilterVisible={true}
                    filterAction={filterAction}
                    clickItem={handleClickItem}
                    doubleClickItem={handleDoubleClickItem}
                />
            </DialogContent>
            <Divider />
            <DialogActions sx={{ m: 1 }}>
                <Button color="error" onClick={cancelClickAction}>取消</Button>
                <Button variant="contained" disabled={currentItem.id === 0} onClick={() => handleDoubleClickItem(currentItem)}>确定</Button>
            </DialogActions>
        </>
    );
};

export default WORefer;