import {
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Button
} from "@mui/material";

import { Divider } from "../../../component/ScMui/ScMui";
import Loader from "../../../component/Loader/Loader"
import ScInput from "../../../component/ScInput";

const viewEvent = ({ currentEvent, onCancel }) => {
    return currentEvent !== undefined
        ? <>
            <DialogTitle>详情</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 512 }}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="来源单据"
                            itemKey="billnumber"
                            initValue={currentEvent.billnumber}
                            pickDone={() => { }}
                            key="billnumber"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="行号"
                            itemKey="rownumber"
                            initValue={currentEvent.rownumber}
                            pickDone={() => { }}
                            key="rownumber"
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={405}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="状态"
                            itemKey="status"
                            initValue={currentEvent.status}
                            pickDone={() => { }}
                            key="status"
                        />
                    </Grid>
                    <Grid item xs={7}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="标题"
                            itemKey="title"
                            initValue={currentEvent.title}
                            pickDone={() => { }}
                            key="title"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="表头说明"
                            itemKey="hdescription"
                            initValue={currentEvent.hdescription}
                            pickDone={() => { }}
                            key="hdescription"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="行说明"
                            itemKey="bdescription"
                            initValue={currentEvent.bdescription}
                            pickDone={() => { }}
                            key="bdescription"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={307}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="开始时间"
                            itemKey="start"
                            initValue={currentEvent.start}
                            pickDone={() => { }}
                            key="start"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={307}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="完成时间"
                            itemKey="end"
                            initValue={currentEvent.end}
                            pickDone={() => { }}
                            key="end"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={570}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="现场"
                            itemKey="sceneitem"
                            initValue={currentEvent.sceneitem}
                            pickDone={() => { }}
                            key="sceneitem"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={580}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="执行模板"
                            itemKey="eit"
                            initValue={currentEvent.eit}
                            pickDone={() => { }}
                            key="eit"
                        />
                    </Grid>
                    {
                        currentEvent.billtype === "ED"
                            ? <>
                                <Grid item xs={6}>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="执行项目"
                                        itemKey="eidname"
                                        initValue={currentEvent.eidname}
                                        pickDone={() => { }}
                                        key="eidname"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="执行项目值"
                                        itemKey="eidvaluedisp"
                                        initValue={currentEvent.eidvaluedisp}
                                        pickDone={() => { }}
                                        key="eidvaluedisp"
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ScInput
                                        dataType={902}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="附件"
                                        itemKey="files"
                                        initValue={currentEvent.files}
                                        pickDone={() => { }}
                                        isBackendTest={false}
                                        key="files"                                       
                                    />
                                </Grid>
                            </>
                            : null
                    }
                    <Grid item xs={3}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="创建人"
                            itemKey="createuser"
                            initValue={currentEvent.createuser}
                            pickDone={() => { }}
                            key="createuser"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
                <Button variant='contained' onClick={onCancel}>返回</Button>
            </DialogActions>
        </>
        : <Loader />
};

export default viewEvent;