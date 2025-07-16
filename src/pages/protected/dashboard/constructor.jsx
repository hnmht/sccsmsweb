import dayjs from "../../../utils/myDayjs";

export const fieldNames = {
    siname: "现场",
    respname: "负责人",
    eidname: "执行项目",
    eicname: "执行项目类别",
    sicname: "现场类别",
    createusername: "执行人",
    isfinish: "是否处理完成",
    isrectify: "是否现场整改",
    billnumber: "单据号",
    reviewusername: "审阅人",
    rlname: "风险等级"
}

export const initDateIntervals = () => {
    return [
        { id: "today", label: "今天", startDate: dayjs(new Date()).format("YYYYMMDD"), endDate: dayjs(new Date()).format("YYYYMMDD") },
        { id: "yesterday", label: "昨天", startDate: dayjs(new Date()).subtract(1, "day").format("YYYYMMDD"), endDate: dayjs(new Date()).subtract(1, "day").format("YYYYMMDD") },
        { id: "thisweek", label: "本周", startDate: dayjs().weekday(0).format("YYYYMMDD"), endDate: dayjs(new Date()).format("YYYYMMDD") },
        { id: "lastweek", label: "上周", startDate: dayjs().add(-1, 'week').startOf('week').format('YYYYMMDD'), endDate: dayjs().add(-1, 'week').endOf('week').format('YYYYMMDD') },
        { id: "thismonth", label: "本月", startDate: dayjs().startOf('month').format('YYYYMMDD'), endDate: dayjs(new Date()).format("YYYYMMDD") },
        { id: "lastmonth", label: "上月", startDate: dayjs().add(-1, 'month').startOf('month').format('YYYYMMDD'), endDate: dayjs().add(-1, 'month').endOf('month').format('YYYYMMDD') }
    ];
};


export const transProblemDataToPieData = (problemdata, field) => {
    let newMap = new Map();

    //按照field汇总
    problemdata.forEach(item => {
        let problemNumber = 0;
        if (isNaN(newMap.get(item[field]))) {
            problemNumber = 0;
        } else {
            problemNumber = newMap.get(item[field]);
        }
        newMap.set(item[field], problemNumber + 1);
    })

    let pieData = {
        labels: [],
        datasets: [
            {
                label: '问题数量',
                data: [],
                borderWidth: 1,
            },
        ],
    };
    //map转数组
    let rows = [];
    for (let [key, value] of newMap.entries()) {
        let row = {};
        row.value = value;
        row[field] = key;
        rows.push(row);
        pieData.labels.push(key);
        pieData.datasets[0].data.push(value);
    }
    return {
        columns: ['排名', fieldNames[field], "数量"],
        rows: rows,
        pieData: pieData
    };
};

export const transReviewDataToTable = (reviewData, field) => {
    let newMap = new Map();

    //按照field汇总
    reviewData.forEach(item => {
        let consumesec = 0;
        if (isNaN(newMap.get(item[field]))) {
            consumesec = 0;
        } else {
            consumesec = newMap.get(item[field]);
        }
        newMap.set(item[field], consumesec + item.consumesec);
    })

    //map转数组
    let rows = [];
    for (let [key, value] of newMap.entries()) {
        let row = {};
        row.value = value;
        row[field] = key;
        rows.push(row);
    }
    return {
        columns: ['排名', fieldNames[field], "耗时(秒)"],
        rows: rows
    };
};

export const transProblemDataToPolarArea = (problemdata) => {
    let newMap = new Map();
    //按照field汇总
    problemdata.forEach(item => {
        let problemNumber = 0;
        if (!newMap.get(item.rlname)) {
            problemNumber = 0;
        } else {
            problemNumber = newMap.get(item.rlname).count;
        }
        newMap.set(item.rlname, { id: item.respid, color: item.rlcolor, name: item.rlname, count: problemNumber + 1 });
    })

    const data = {
        labels: [],
        datasets: [
            {
                label: '发生数',
                data: [],
                backgroundColor: [],
                borderWidth: 1,
            },
        ],
    };
    //map转数组
    for (let [key, value] of newMap.entries()) {
        data.labels.push(key);
        data.datasets[0].data.push(value.count);
        data.datasets[0].backgroundColor.push(value.color)
    }
    return data;
};

export const transRiskTrendsToPolarArea = (rlData) => {
    let newMap = new Map();
    //按照field汇总
    rlData.forEach(item => {
        let problemNumber = 0;
        if (!newMap.get(item.risklevel.name)) {
            problemNumber = item.totalnumber;
        } else {
            problemNumber = newMap.get(item.risklevel.name).count + item.totalnumber;
        }
        newMap.set(item.risklevel.name, { id: item.risklevel.id, color: item.risklevel.color, name: item.risklevel.name, count: problemNumber });
    })

    const data = {
        labels: [],
        datasets: [
            {
                label: '发生数',
                data: [],
                backgroundColor: [],
                borderWidth: 1,
            },
        ],
    };

    //map转数组
    for (let [key, value] of newMap.entries()) {
        data.labels.push(key);
        data.datasets[0].data.push(value.count);
        data.datasets[0].backgroundColor.push(value.color)
    }

    return data;

};

export const transRiskTrendsToLine = (rlData,groupby) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,       
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                showLabelBackdrop: false,                               
            },          
        },
    };
    let rlMap = new Map();
    let rlArr = [];
    let xMap = new Map();
    let xArr = [];

    //获取标签数据和日期数据
    rlData.forEach(item => {
        if (!rlMap.get(item.risklevel.name)) {
            rlMap.set(item.risklevel.name, item.risklevel);
            rlArr.push(item.risklevel)
        }
        if (!xMap.get(item[groupby])) {
            xMap.set(item[groupby], 1);
            xArr.push(item[groupby]);
        }
    });
    var datasets = [];
    rlArr.forEach((rl, index) => {
        var data = {
            label: rl.name,
            data: [],
            borderColor: rl.color,
            backgroundColor: rl.color,
            yAxisID: `y`
        };
        //填写data.data
        xArr.forEach(x => {
            var total = 0;
            rlData.forEach(item => {
                if (item[groupby] === x && item.risklevel.id === rl.id) {
                    total = total + item.totalnumber;
                }
            })
            data.data.push(total);
        })
        datasets.push(data);
    });
    return {
        data: {
            labels: xArr,
            datasets: datasets,
        },
        options: options,
    }
};

