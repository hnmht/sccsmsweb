//说明列显示
export const CellDescription = (row, column) => {
    return <span style={{ width: column.minWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{row.description}</span>;
};