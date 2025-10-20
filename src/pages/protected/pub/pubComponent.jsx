import { Typography } from "@mui/material";
//说明列显示
export const CellDescription = (row, column) => {
    return <span style={{ width: column.minWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{row.description}</span>;
};

//风险等级显示
export const CellRiskLevel = (row, column) => {
    return (<div style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0, borderRadius: 4, backgroundColor: row.riskLevel.color }}>
        <Typography variant="body1" style={{ padding: 4 }}>{row.riskLevel.name}</Typography>
    </div>);
};