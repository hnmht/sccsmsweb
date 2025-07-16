import { forwardRef } from "react";
import dayjs from "../../../../utils/myDayjs";
import { ConvertFloatFormat } from "../../../../utils/tools";
import { PeriodDisplay } from "../../../../storage/dataTypes";
import "./printA4.css";

//按照劳保用品ID汇总劳保用品发放单数据
const sumVoucherData = (voucherData) => {
    const lpCount = [];
    let lpMap = new Map();
    let countMap = new Map();

    voucherData.body.forEach(row => {
        if (!lpMap.get(row.lp.id)) {
            lpMap.set(row.lp.id, row.lp);
            countMap.set(row.lp.id, row.quantity);
        } else {
            let count = countMap.get(row.lp.id);          
            countMap.set(row.lp.id, row.quantity + count);
        }
    });

    countMap.forEach((v, k )=> {
        const lpC = { lp: lpMap.get(k), quantity: v };
        lpCount.push(lpC);
    });

    return lpCount;
};

export const LDPrintRegFormA4 = forwardRef((props, ref) => {
    const { voucherData } = props;
    return (
        <div ref={ref} className="printContent">
            <header><h2>劳动防护用品发放登记表</h2></header>
            <div className="voucherHeader">
                <p className="headColumn">单据编码:{voucherData.billnumber}</p>
                <p className="headColumn">单据日期:{dayjs(voucherData.billdate).format("YYYY-MM-DD")}</p>
                <p className="headColumn">发放部门:{voucherData.department.name}</p>
                <p className="headColumn">发放周期:{PeriodDisplay.get(voucherData.period) + "(" + dayjs(voucherData.startdate).format("YYYY-MM-DD") + "至" + dayjs(voucherData.enddate).format("YYYY-MM-DD") + ")"}</p>
                <p className="headColumn">备注:{voucherData.description}</p>
            </div>
            <div className="voucherBody">
                <table style={{ width: "100%" }}>
                    <thead style={{ width: "100%" }}>
                        <tr style={{ width: "100%" }}>
                            <th className="rowNumber">行号</th>
                            <th className="recipient">领用人</th>
                            <th className="opName">岗位</th>
                            <th className="deptName">部门</th>
                            <th className="lpName">劳保用品</th>
                            <th className="lpModel">规格型号</th>
                            <th className="lpUnit">计量单位</th>
                            <th className="quantity">数量</th>
                            <th className="sign">领用人签字</th>
                            <th className="description">备注</th>
                        </tr>
                    </thead>
                    <tbody style={{ width: "100%" }}>
                        {voucherData.body.map((row, index) => {
                            return <tr key={index} style={{ width: "100%" }}>
                                <td className="rowNumber">{row.rownumber}</td>
                                <td className="recipient">{row.recipient.name}</td>
                                <td className="opName">{row.opname}</td>
                                <td className="deptName">{row.deptname}</td>
                                <td className="lpName">{row.lp.name}</td>
                                <td className="lpModel">{row.lp.model}</td>
                                <td className="lpUnit">{row.lp.unit}</td>
                                <td className="quantityBody">{ConvertFloatFormat(row.quantity)}</td>
                                <td className="sign"></td>
                                <td className="description">{row.description}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <footer>
                    <p>发放人:___________</p>
                    <p>日期:{"________年______月______日"}</p>
                </footer>
            </div>
        </div>
    )
});


export const LDPrintDeliveryA4 = forwardRef((props, ref) => {
    const { voucherData } = props;
    const countData = sumVoucherData(voucherData);

    return (
        <div ref={ref} className="printContent">
            <header><h2>劳动防护用品出库单</h2></header>
            <div className="voucherHeader">
                <p className="headColumn">单据编码:{voucherData.billnumber}</p>
                <p className="headColumn">单据日期:{dayjs(voucherData.billdate).format("YYYY-MM-DD")}</p>
                <p className="headColumn">领用部门:{voucherData.department.name}</p>
                <p className="headColumn">发放周期:{PeriodDisplay.get(voucherData.period) + "(" + dayjs(voucherData.startdate).format("YYYY-MM-DD") + "至" + dayjs(voucherData.enddate).format("YYYY-MM-DD") + ")"}</p>
                <p className="headColumn">备注:{voucherData.description}</p>
            </div>
            <div className="voucherBody">
                <table style={{ width: "100%" }}>
                    <thead style={{ width: "100%" }}>
                        <tr style={{ width: "100%" }}>                           
                            <th className="deptName">编码</th>
                            <th className="lpName">劳保用品</th>
                            <th className="lpModel">规格型号</th>
                            <th className="lpUnit">计量单位</th>
                            <th className="quantity">数量</th>
                            <th className="description">备注</th>
                        </tr>
                    </thead>
                    <tbody style={{ width: "100%" }}>
                        {countData.map((row, index) => {
                            return <tr key={index} style={{ width: "100%" }}>
                                <td className="rowNumber">{row.lp.code}</td>
                                <td className="recipient">{row.lp.name}</td>
                                <td className="opName">{row.lp.model}</td>
                                <td className="lpUnit">{row.lp.unit}</td>
                                <td className="quantityBody">{ConvertFloatFormat(row.quantity)}</td>      
                                <td className="description"></td>                        
                            </tr>
                        })}
                    </tbody>
                </table>
                <footer>
                    <p>领用人:___________</p>
                    <p>日期:{"________年______月______日"}</p>
                </footer>
            </div>
        </div>
    )
});


