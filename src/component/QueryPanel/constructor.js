export const Comparisons = [
    { id: "equal", label: '等于', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
    { id: "notequal", label: '不等于', value: '!=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
    { id: "lessthan", label: '小于', value: '<', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
    { id: "greaterthan", label: '大于', value: '>', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
    { id: "lessthanequal", label: '小于等于', value: '<=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
    { id: "greaterthanequal", label: '大于等于', value: '>=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
    { id: "contain", label: '包含', value: 'ilike', addCharacter: true, addStart: "%", addEnd: "%", needInput: true, applicable: ["string"] },
    { id: "notcontain", label: '不包含', value: 'not ilike', addCharacter: true, addStart: "%", addEnd: "%", needInput: true, applicable: ["string"] },
    { id: "null", label: '为空', value: 'is null', addCharacter: false, needInput: false, applicable: ["object", "string", "int", "number"] },
    { id: "notnull", label: '不为空', value: 'is not null', addCharacter: false, applicable: ["object", "string", "int", "number"] },
];

export const transConditionsToString = (conditions) => {
    let queryString = "";
    conditions.forEach((con, index) => {
        let cs = "";
        if (index !== 0) {
            cs = cs + con.logic + " ";
        }
        cs = cs + con.field.value + " ";
        cs = cs + con.compare.value + " ";

        switch (con.field.resultType) {
            case "number":
                cs = cs + con.value + " ";
                break;
            case "int":
                cs = cs + con.value + " ";
                break;
            case "string":
                if (con.compare.addCharacter) {
                    cs = cs + "'" + con.compare.addStart + con.value + con.compare.addEnd + "' ";                    
                } else {
                    cs = cs + "'" + con.value + "' ";
                }               
                break;
            case "object":
                cs = cs + con.value.id + " ";
                break;
            default:
                break
        }
        queryString = queryString + cs;
    });

    return queryString;
};
