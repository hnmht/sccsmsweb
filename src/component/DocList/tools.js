
//确定默认排序方式
export function getSortColumns(tableColumns) {
    // console.log("getSortColumns tableColumns:",tableColumns);
    let sortColumns = [];
    tableColumns.forEach((column) => {
        if (column.sort) {
            let sortColumn = {
                sort: false,
                id: column.sortField,
                label: column.label,
                direction: "asc",
            };
            sortColumns.push(sortColumn);
        }
    })
    sortColumns[0].sort = true;
    // sortColumns[0].direction = "asc";

    return sortColumns;
}
//将列名转化为数组
export function getColumnsKey(columns) {
    let keys = [];
    columns.forEach((column) => {
        keys.push(column.sortField);
    });
    return keys;
}

//排序数据转化为orderby
export function getOrderBy(sortColumns, tableColumns) {
    let orderBy = [];
    sortColumns.forEach(element => {
        if (element.sort) {
            orderBy.push({ field: element.id, order: element.direction });
        }
    });
    //如果没有选择任何排序列
    if (orderBy.length === 0) {
        getSortColumns(tableColumns).forEach(element => {
            if (element.sort) {
                orderBy.push({ field: element.id, order: element.direction });
            }
        });
    }

    return orderBy;
}

//导出excel前整理列数据
export function excelColumns(currentColumns) {
    let columns = [];
    currentColumns.forEach((column) => {
        if (column.visible) {
            columns.push(column.label);
        }
    })
    return columns;
}

//导出excel前整理行数据
export function excelRows(currentRows, currentColumns) {
    let excelRows = [];
    currentRows.forEach(row => {
        let excelRow = {};
        currentColumns.forEach(column => {
            if (column.visible) {
                excelRow[column.label] = row[column.id];
            }
        })
        excelRows.push(excelRow);
    })
    return excelRows;
}

