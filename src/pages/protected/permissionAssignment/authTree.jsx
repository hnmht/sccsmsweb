import { useState, useEffect } from "react";
import {
    List,
    ListSubheader,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Checkbox,
    ListItemText,
    Collapse,
    IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ExpandLessIcon,  ExpandMoreIcon} from "../../../component/PubIcon/PubIcon";
import { cloneDeep } from "lodash";
import { toTree, findChildrens, findParents } from "../../../utils/tree";
import useContentHeight from "../../../hooks/useContentHeight";


function AuthTree({ menus, isEdit, selectedOk }) {
    const [auths, setAuths] = useState([]);
    const [openAll, setOpenAll] = useState(true);
    const contentHeight = useContentHeight();
    const {t} = useTranslation();
    useEffect(() => {
        setAuths(menus);
    }, [menus]);

    // Actions after select child item
    const handleChildItemClick = (item, event) => {
        let newMenus = [];
        // Modify the selected field of the chosen item
        auths.forEach((auth, index) => {
            if (item.id === auth.id) {
                auth.selected = !auth.selected;
                newMenus.push(auth);
            } else {
                newMenus.push(auth);
            }
        })
        // Recalculate parent node status
        // Find all parent nodes of the current item
        let parents = findParents(newMenus, item.id);
        // Calculate the status of all parents nodes
        parents.forEach((parent) => {
            // Find all children nodes of the parent node
            const childrens = findChildrens(newMenus, parent.id);
            let selectedNum = 0;
            let isSelected = false;
            let isIndeter = false;
            childrens.forEach(children => {
                if (children.selected) {
                    selectedNum++
                }
            })
            // Update parent node status based on child node status
            if (selectedNum === 0) {
                isSelected = false;
                isIndeter = false;
            } else if (selectedNum > 0 && selectedNum < childrens.length) {
                isSelected = true;
                isIndeter = true;
            } else if (selectedNum === childrens.length) {
                isSelected = true;
                isIndeter = false;
            }
            for (let i = 1; i < newMenus.length; i++) {
                if (newMenus[i].id === parent.id) {
                    newMenus[i].selected = isSelected;
                    newMenus[i].indeterminate = isIndeter;
                    break;
                }
            }
        })
        selectedOk(newMenus);
        setAuths(newMenus);
    };

    // Actions after select parent item
    const handleParentItemClick = (item, event) => {
        let newAuths = cloneDeep(auths);
        // Find all child nodes of the node
        let childs = findChildrens(newAuths, item.id);
        // Calculate the values of the selected and indeterminate fileds for child nodes 
        // and the current node
        if (item.selected && !item.indeterminate) {
            //selected=true 并且 isIndeter = false 说明下级节点全部被选择，则将下级全部取消选择
            childs.forEach(child => {
                for (let i = 0; i < newAuths.length; i++) {
                    if (child.id === newAuths[i].id) {
                        newAuths[i].selected = false;
                        newAuths[i].indeterminate = false;
                        break
                    }
                }
            })
            // 本节点取消选择：设置本节点selected = false 和 isIndeter =false
            for (let index = 0; index < newAuths.length; index++) {
                if (item.id === newAuths[index].id) {
                    newAuths[index].selected = false;
                    newAuths[index].isIndeter = false;
                    break
                }
            }

        } else if (!item.selected && !item.indeterminate) {//selected=true并且 isIndeter = false 说明下级节点全部未被选择，则将下级全部选择
            childs.forEach(child => {
                for (let i = 0; i < newAuths.length; i++) {
                    if (child.id === newAuths[i].id) {
                        newAuths[i].selected = true;
                        newAuths[i].indeterminate = false;
                        break
                    }
                }
            })
            //设置本节点selected = true 和 isIndeter =false
            for (let index = 0; index < newAuths.length; index++) {
                if (item.id === newAuths[index].id) {
                    newAuths[index].selected = true;
                    newAuths[index].indeterminate = false;
                    break
                }
            }
        } else if (item.selected && item.indeterminate) {  //selected=true 并且 isIndeter = true 说明下级部分被选择，则将下级节全部取消选择
            childs.forEach(child => {
                for (let i = 0; i < newAuths.length; i++) {
                    if (child.id === newAuths[i].id) {
                        newAuths[i].selected = false;
                        newAuths[i].indeterminate = false;
                        break
                    }
                }
            })
            //设置本节点selected = false 和 isIndeter =false
            for (let index = 0; index < newAuths.length; index++) {
                if (item.id === newAuths[index].id) {
                    newAuths[index].selected = false;
                    newAuths[index].indeterminate = false;
                    break
                }
            }
        }

        //2 查找处理该节点的所有父节点
        let parents = findParents(newAuths, item.id);
        //判断父节点的所有子节点是否全部选择,并更新父节点的selected,indeterminate
        parents.forEach((parent) => {
            //查找父节点的所有子节点
            const childrens = findChildrens(newAuths, parent.id);
            let selectedNum = 0;
            let isSelected = false;
            let isIndeter = false;
            childrens.forEach(children => {
                if (children.selected) {
                    selectedNum++
                }
            })
            //根据子节点选择情况判定父节点的selected值和indecter值
            if (selectedNum === 0) {
                isSelected = false;
                isIndeter = false;
            } else if (selectedNum > 0 && selectedNum < childrens.length) {
                isSelected = true;
                isIndeter = true;
            } else if (selectedNum === childrens.length) {
                isSelected = true;
                isIndeter = false;
            }
            //更新newAuths中的父节点
            for (let i = 1; i < newAuths.length; i++) {
                if (newAuths[i].id === parent.id) {
                    newAuths[i].selected = isSelected;
                    newAuths[i].indeterminate = isIndeter;
                    break;
                }
            }
        })
        selectedOk(newAuths);
        //更新auths
        setAuths(newAuths);

    };

    // Select All
    const selectAll = () => {
        const newAuths = cloneDeep(auths);
        newAuths.forEach(auth => {
            auth.selected = true;
            auth.indeterminate = false;
        });
        selectedOk(newAuths);
        setAuths(newAuths);
    };

    // Deselect all
    const DeselectAll = () => {
        const newAuths = cloneDeep(auths);
        newAuths.forEach(auth => {
            auth.selected = false;
            auth.indeterminate = false;
        });
        selectedOk(newAuths);
        setAuths(newAuths);
    };

    // Actions after click the select all button
    const handleAllClick = () => {
        const selected = allSelectedChecked();
        const indeter = allSelectedIndeterminate();
        if (selected && indeter) { 
            DeselectAll(); 
        } else if (selected && !indeter) { 
            DeselectAll(); 
        } else if (!selected && !indeter) {
            selectAll();
        }
    };
    //全选按钮Checked值
    const allSelectedChecked = () => {
        let selectedNum = 0;
        auths.forEach(auth => {
            if (auth.selected) {
                selectedNum++
            }
        });
        if (selectedNum === 0) {
            return false;
        } else {
            return true
        }
    };
    //全选按钮indeterminate值
    const allSelectedIndeterminate = () => {
        let selectedNum = 0;
        auths.forEach(auth => {
            if (auth.selected) {
                selectedNum++
            }
        });
        if (selectedNum === 0) {
            return false;
        } else if (selectedNum > 0 && selectedNum < auths.length) {
            return true;
        } else {
            return false;
        }
    }


    const RenderItem = ({ item, level }) => {
        const [open, setOpen] = useState(true);
        const handleClick = () => {
            setOpen(!open);
        };
        return (
            item.children
                ? <>
                    <ListItem disablePadding key={"parentItem" + item.id} sx={{ p: 0, m: 0, paddingLeft: level + 2, width: "100%" }}>
                        <IconButton key={"parenticonbutton" + item.id} sx={{ padding: 0, margin: 0 }} onClick={handleClick}>
                            {open ? <ExpandLessIcon key={"parentexpandless" + item.id} fontSize="small" /> : < ExpandMoreIcon key={"expandMore" + item.id} fontSize="small" />}
                        </IconButton>
                        <ListItemButton key={"parentitembutton" + item.id} disabled={!isEdit} onClick={(event) => handleParentItemClick(item, event)}>
                            <ListItemIcon key={"parentitemicon" + item.id}>
                                <Checkbox key={"parentcheckbox" + item.id} size="small" checked={item.selected} indeterminate={item.indeterminate} />
                            </ListItemIcon>
                            <ListItemText key={"parentitemtext" + item.id} primary={t(item.title)} />
                        </ListItemButton>
                    </ListItem>
                    <Collapse key={"collapse" + item.id} in={open} sx={{ p: 0, m: 0 }}>
                        <RenderList data={item.children} listKey={item.id} level={level} />
                    </Collapse></>
                : <ListItem key={"child" + item.id} disablePadding sx={{ p: 0, m: 0, paddingLeft: level + 2, width: "100%" }}>
                    <ExpandLessIcon key={"childexpandless" + item.id} fontSize="small" sx={{ opacity: 0 }} />
                    <ListItemButton key={"childitembutton" + item.id} disabled={!isEdit} onClick={() => handleChildItemClick(item)}>
                        <ListItemIcon key={"childitemicon" + item.id}>
                            <Checkbox key={"childcheckbox" + item.id} size="small" checked={item.selected} />
                        </ListItemIcon>
                        <ListItemText key={"childitemtext" + item.id} primary={t(item.title)} />
                    </ListItemButton>
                </ListItem>
        );
    };

    const RenderList = ({ data, listKey, level }) => {
        const levelA = level + 1;
        return (
            <List key={listKey} component="div" dense sx={{ p: 0, m: 0, paddingLeft: level + 2, width: "100%" }}>
                {data.map((item) => (
                    <RenderItem item={item} key={item.id} level={levelA} />
                ))}
            </List>
        );
    };
    return (
        <List
            subheader={
                <ListSubheader component="div" id="nested-list-subheader"
                    sx={{ borderBottomStyle: "solid", borderBottomWidth: 1, borderBottomColor: "divider", fontWeight: "bold", fontSize: "1.125em", bgcolor: "background.paper" }}
                >
                    {t("menuList")}
                </ListSubheader>
            }
            sx={{ width: "100%", height: contentHeight - 38, overflow: "auto", p: 0, borderStyle: "solid", borderWidth: 1, borderColor: "divider", bgcolor: "background.paper" }}
            key="top"
            dense
            component="div"
        >
            <ListItem disablePadding key={"allItem"} sx={{ p: 0, m: 0, width: "100%" }}>
                <IconButton key={"openAllIconButton"} sx={{ padding: 0, margin: 0 }} onClick={() => setOpenAll(!openAll)}>
                    {openAll ? <ExpandLessIcon key={"openAllExpandless"} fontSize="small" /> : < ExpandMoreIcon key={"openAllExpandMore"} fontSize="small" />}
                </IconButton>
                <ListItemButton key={"openAllItembutton"} disabled={!isEdit} onClick={handleAllClick}>
                    <ListItemIcon key={"openAllItemicon"}>
                        <Checkbox key={"openAllItemCheckbox"} size="small" checked={allSelectedChecked()} indeterminate={allSelectedIndeterminate()} />
                    </ListItemIcon>
                    <ListItemText key={"openAllItetext"} primary={t("allMenu")} />
                </ListItemButton>
            </ListItem>
            <Collapse key="collapseAll" in={openAll} sx={{ p: 0, m: 0 }}>
                {/* {renderList(toTree(auths, 0), 0, 0)} */}
                <RenderList data={toTree(auths, 0)} listKey={0} level={0} />
            </Collapse>
        </List>

    );
}

export default AuthTree;
