import { cloneDeep } from "lodash";
/**
 * 数组转树  递归求解 
 * list:对象数组，每个对象都包含包含fatherid元素。 
 * parId:数字，转结构体的层级
 */
export function toTree(list, parId) {
    let newList = cloneDeep(list);
    let len = newList.length;
    function loop(parId) {
        let res = [];
        for (let i = 0; i < len; i++) {
            let item = newList[i];
            if (item.fatherid === parId) {
                let child = loop(item.id)
                if (child.length > 0) {
                    item.children = loop(item.id);
                }
                res.push(item);
            }
        }
        return res;
    }
    return loop(parId);
}
/**
 * 树转数组扁平化结构 
 * tree:树数组，如果只有一个元素，也需要转化为数组。 
 */
export function treeToArr(tree) {
    let res = [];
    tree.forEach(el => {
        res.push(el);
        el.children && res.push(...treeToArr(el.children))
    })
    return res;
}

/**
 * 查找树状结构数组的某一个节点的所有父节点
 * arr1:对象数组，每个对象都包含包含id,fatherid元素。 
 * id1:数字，节点的id
 */
export function findParents(arr1, id1) {
    let parents = [];
    let forFn = function (arr, id) {
        //获取父节点id
        let fatherId = -1;
        for (let index = 0; index < arr.length; index++) {
            if (arr[index].id === id) {
                fatherId = arr[index].fatherid;
                break
            }
        }
        //获取父节点
        for (let i = 0; i < arr.length; i++) {           
            if (arr[i].id === fatherId) {
                parents.push(arr[i]);
                //寻找父节点的父节点
                forFn(arr, arr[i].id)
                break
            }
        }
    }
    forFn(arr1, id1);
    return parents;
}

/**
 * 查找树状结构数组的某一个节点的子节点
 * arr1:对象数组，每个对象都包含包含id,fatherid元素。 
 * id1:数字，节点的id
 */
export function findChildrens(arr1, id1) {
    let childrens = [];
    let forFn = function (arr, id) {
        //查找该节点的所有子节点
        for (let i = 1; i < arr.length; i++) {
            if (arr[i].fatherid === id) {
                childrens.push(arr[i]);
                forFn(arr, arr[i].id);
            }
        }
    }
    forFn(arr1, id1);
    return childrens;
}