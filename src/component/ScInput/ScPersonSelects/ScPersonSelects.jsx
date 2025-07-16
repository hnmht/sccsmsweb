import React, { useState, useEffect, memo } from "react";
import {
    InputLabel,
    Tooltip
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./constructor";
const personName = "person";

//502 人员多选组件
const ScPersonSelects = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [persons, setPersons] = useState([]);
    const [selectedPersons, setSelectedPersons] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });

    useEffect(() => {
        async function getData() {
            //获取本地缓存
            const newPersons = await GetLocalCache(personName);
            //更新
            setPersons(newPersons);
        }
        getData();
    }, []);


    //刷新人员
    const handleRefreshPersons = async () => {
        //向服务器请求最新人员缓存
        await InitDocCache(personName);
        //获取本地缓存
        const newPersons = await GetLocalCache(personName);
        //更新
        setPersons(newPersons);
    };

    //向父组件传送数据
    const handleTransfer = async (items = selectedPersons) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (items.length === 0 && !allowNull) {
            err = { isErr: true, msg: "不允许为空" };
        } else if (isBackendTest) {
            err = await backendTestFunc(items);
        }

        setErrInfo(err);
        pickDone(items, itemKey, positionID, rowIndex, err);
    };

    //人员列表选择框发生变化
    const handleSelectPersons = (items) => {
        setSelectedPersons(items);
        handleTransfer(items);
    };

    return (
        <>
            <InputLabel key={`${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>
                {itemShowName}
                {errInfo.isErr
                    ? <Tooltip id={`${itemKey}${positionID}${rowIndex}`} title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                    : null
                }
            </InputLabel>
            <DocTable
                id={`${itemKey}${positionID}${rowIndex}`}
                isEdit={isEdit}
                columns={columns}
                refreshAction={handleRefreshPersons}
                rows={persons}
                docListTitle="选择人员"
                selectItem={handleSelectPersons}
                isMultiple={true}
                selectRows={selectedPersons}
                perPage={10}
                tableContainerHeight={256}
            />
        </>

    );
};

export default memo(ScPersonSelects);