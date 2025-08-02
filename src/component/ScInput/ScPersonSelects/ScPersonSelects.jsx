import React, { useState, useEffect, memo } from "react";
import {
    InputLabel,
    Tooltip
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./constructor";
const personName = "person";

//502 Person multi-select component
const ScPersonSelects = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [persons, setPersons] = useState([]);
    const [selectedPersons, setSelectedPersons] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });

    const {t} = useTranslation();

    useEffect(() => {
        async function getData() {
            // Get Local Person Master Data cache
            const newPersons = await GetLocalCache(personName);
            // Update persons
            setPersons(newPersons);
        }
        getData();
    }, []);


    // Update Person Master data
    const handleRefreshPersons = async () => {
        // Request the latest Person Master Data from the server 
        await InitDocCache(personName);
        // Get Local Person Master Data cache
        const newPersons = await GetLocalCache(personName);
        // Update persons
        setPersons(newPersons);
    };

    // Send Data to the parent component
    const handleTransfer = async (items = selectedPersons) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (items.length === 0 && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (isBackendTest) {
            err = await backendTestFunc(items);
        }

        setErrInfo(err);
        pickDone(items, itemKey, positionID, rowIndex, err);
    };

    // Action after person chackbox change.
    const handleSelectPersons = (items) => {
        setSelectedPersons(items);
        handleTransfer(items);
    };

    return (
        <>
            <InputLabel key={`${itemKey}${positionID}${rowIndex}`} sx={{ color: allowNull ? "primary" : "blue" }}>
                {t(itemShowName)}
                {errInfo.isErr
                    ? <Tooltip id={`${itemKey}${positionID}${rowIndex}`} title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                    : null
                }
            </InputLabel>
            <DocTable
                id={`${itemKey}${positionID}${rowIndex}`}
                isEdit={isEdit}
                columns={columns}
                refreshAction={handleRefreshPersons}
                rows={persons}
                docListTitle="persons"
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