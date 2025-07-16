import { useState, useRef, useEffect, useCallback, memo, useLayoutEffect } from "react";
import { Stack, SpeedDial, SpeedDialIcon, SpeedDialAction, Typography } from "@mui/material";
import { AddRowIcon, ToTopIcon, ToBottomIcon } from "../PubIcon/PubIcon";
import styled from "@emotion/styled";
import { ColumnWidthContext } from "./columnContext";


const BodyHeaderStyled = styled.table`  
    display: grid;
    left:0px;
    top:0px;
    height:45px;
    overflow-x: none;
    overflow-y:none;
    position: sticky; 
    top:0;
    background: ${(props) => props.theme.palette.background.default};
    border-collapse:collapse;
    z-index:1; 

    thead,
    tr {
        display:contents;       
    }
    th {
        position: relative;
        font-size: 12px;
        text-align: center;
        padding: 2px 3px;        
        border: 1px solid #ccc;
        border-collapse:collapse;
        border-top:none;
        line-height:40px;        
    }
    
    td:first-of-type, 
    th:first-of-type {
        border-left:none;
    }

    th span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: block
    }
   

     .resize-handle {
        display: block;
        position: absolute;
        cursor: col-resize;
        width: 7px;
        right: 0;
        top: 0;
        z-index: 2;
        border-right: 2px solid transparent;
    }

    .resize-handle:hover {
        border-color: ${(props) => props.theme.palette.primary.main};;
    }


    .resize-handle .active {
        border-color: #517ea5;
    }
`;
//创建单据体表头
const createBodyHeaders = (bodyCols) => {
    return bodyCols.map((col) => ({
        col: col,
        ref: useRef(),
    }));
};
//自动生成单据体表头宽度
const transColWidth = (headers) => {
    const gridCols = [];
    let width = 0;
    headers.forEach(col => {
        if (col.visible) {
            gridCols.push(`${col.width}px`);
        }
        if (col.visible) {
            width = width + col.width;
        }
    });

    return {
        gridCols: gridCols.join(" "),
        width: width
    };
};

const ScVoucherBody = ({ bodyColumns, children, addRowVisible, addRowAction, title = "表体", actionComponent = null }) => {
    const [colWidth, setColWidth] = useState(transColWidth(bodyColumns));
    const bodyHeaderRef = useRef(null);
    const columns = createBodyHeaders(bodyColumns);
    const [activeIndex, setActiveIndex] = useState(null);
    const [tableHeight, setTableHeight] = useState('auto');
    const bodyRowRef = useRef(null);
    const [bodyScroll, setBodyScroll] = useState({ position: "top", count: 1 });

    //调整表体内容显示
    useLayoutEffect(() => {
        if (bodyScroll.position === "top") {
            bodyRowRef.current.scrollTop = 0;
        } else if (bodyScroll.position === "bottom") {
            bodyRowRef.current.scrollTop = bodyRowRef.current.scrollHeight;
        }
    }, [bodyScroll]);

    const handleScrollTo = (position) => {
        setBodyScroll((prevState) => {
            let newState = { position: position, count: prevState.count + 1 };
            return newState;
        });
    };
    //增行
    const handleAddRow = () => {
        addRowAction();
        handleScrollTo("bottom");
    };

    useEffect(() => {
        setTableHeight(bodyHeaderRef.current.offsetHeight);
    }, []);
    //鼠标按下
    const mouseDown = (event, index) => {
        // console.log("mouseDown event:",event);
        setActiveIndex(index);
    };
    //鼠标移动
    const mouseMove = useCallback((e) => {
        if (!e) {
            return
        }
        const scrollLeft = bodyRowRef.current.scrollLeft;
        const gridColumns = columns.map((col, i) => {
            if (i === activeIndex) {
                const currentWidth = e.clientX + scrollLeft - col.ref.current.offsetLeft;
                if (currentWidth >= col.col.minWidth && currentWidth <= col.col.maxWidth) {//如果调整的宽度在最大值和最小值之间，则返回调整值                    
                    return currentWidth;
                }
            }
            return col.ref.current.offsetWidth;
        });
        let width = 0;
        gridColumns.forEach(w => {
            width = width + w;
        });
        setColWidth({
            gridCols: `${gridColumns.join("px ")}px`,
            width: width
        });
    }, [activeIndex, columns, setColWidth]);
    //鼠标释放
    const mouseUp = useCallback(() => {
        setActiveIndex(null);
    }, [setActiveIndex]);
    //增加监听
    useEffect(() => {
        if (activeIndex !== null) {
            window.addEventListener("mousemove", mouseMove);
            window.addEventListener("mouseup", mouseUp);
        } else {
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseup", mouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseup", mouseUp);
        };
    }, [activeIndex, mouseMove, mouseUp]);

    return (
        <ColumnWidthContext.Provider value={colWidth}>
            <Stack component="div" id="relativeContainer" sx={{ position: "relative", overflow: "hidden" }}>
                <Stack component="div" id="bodyTitleArea" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 1 }} >
                    <Typography variant="subtitle2">{title}</Typography>
                    <Stack component={"div"} id="bodyTitleAction" sx={{ display: "flex", flexDirection: "row",alignItems:"center" }} >
                        {actionComponent}
                    </Stack>
                </Stack>
                <Stack
                    ref={bodyRowRef}
                    component="div"
                    id="bodyScrollContainer"
                    sx={{ maxWidth: "100%", height: 512, borderStyle: "solid", borderWidth: 1, borderColor: "#ccc", overflowY: "auto", overflowX: "auto" }}
                >
                    <SpeedDial
                        ariaLabel="bodyAction"
                        sx={{ position: 'absolute', bottom: 16, right: 16, '& .MuiFab-primary': { width: 36, height: 36 } }}
                        icon={<SpeedDialIcon />}
                    >
                        {addRowVisible
                            ? <SpeedDialAction key="bodyRowAdd" icon={<AddRowIcon color="secondary" />} tooltipTitle="增行" onClick={handleAddRow} />
                            : null
                        }
                        <SpeedDialAction key="bodyRowScrollBotton" icon={<ToBottomIcon color="secondary" />} tooltipTitle="末行" onClick={() => handleScrollTo("bottom")} />
                        <SpeedDialAction key="bodyRowScrollTop" icon={<ToTopIcon color="secondary" />} tooltipTitle="首行" onClick={() => handleScrollTo("top")} />
                    </SpeedDial>
                    <Stack component="div" id="bodyContainer" style={{ width: "100%" }}>
                        <BodyHeaderStyled ref={bodyHeaderRef} style={{ gridTemplateColumns: colWidth.gridCols, width: colWidth.width }}>
                            <thead>
                                <tr>
                                    {columns.map(({ ref, col }, i) => (
                                        <th ref={ref} key={col.id}>
                                            <span style={{ color: col.allowNul ? "primary" : "blue" }}>{col.label}</span>
                                            <div
                                                style={{ height: tableHeight }}
                                                onMouseDown={(event) => mouseDown(event, i)}
                                                className={`resize-handle ${activeIndex === i ? "active" : "idle"}`}
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                        </BodyHeaderStyled>
                        {children}
                    </Stack>
                </Stack>
            </Stack>
        </ColumnWidthContext.Provider>
    );
};

export default memo(ScVoucherBody);