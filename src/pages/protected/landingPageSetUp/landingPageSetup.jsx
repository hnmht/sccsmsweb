import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Paper, Divider, Card, CardContent, Grid, Typography, Button, } from "@mui/material";
import { message } from "mui-message";

import PageTitle from "../../../component/PageTitle/PageTitle";
import Loader from "../../../component/Loader/Loader";
import ScInput from "../../../component/ScInput";

import { reqLandingPageInfo,reqModifyLandingPageInfo } from "../../../api/landingPage";
import { cloneDeep } from "lodash";
import useContentHeight from "../../../hooks/useContentHeight";

const Image = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  box-shadow: 0 6px 18px 0 rgba(18, 38, 63, 0.075);
  border-radius: 5px;
  transform: perspective(1920px) rotateX(25deg);
  z-index: 0;
  position: relative;
  image-rendering: auto;
  image-rendering: -webkit-optimize-contrast;
  margin-bottom: -100px;
  margin-top: -35px;
  ${(props) => props.theme.breakpoints.up("md")} {
    margin-top: -50px;
  }
`;

const ImageWrapper = styled.div`
  
  max-width:80%;
  margin: 0 auto;
  margin-top:50px;
  &:before {
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.02));
    bottom: 0;
    left: 0;
    position: absolute;
    content: " ";
    z-index: 1;
    display: block;
    width: 100%;
    height: 75px;
    pointer-events: none;
  }
`;
const checkError = (errors) => {
    let number = 0;
    for (let key in errors) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};

const LandingPageSetUp = () => {
    const [currentSetup, setCurrentSetup] = useState(undefined);
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({});
    const contentHeight = useContentHeight();
    useEffect(() => {
        async function initialData() {
            let infoRes = await reqLandingPageInfo();
            let info = {};
            if (infoRes.data.status === 0) {
                info = infoRes.data.data;
            } else {
                message.error("获取首页设置信息出错:" + infoRes.data.statusMsg);
                info = undefined;
            }
            setCurrentSetup(info);
        }
        initialData();
    }, []);

    //图片规格检查
    const handleCheckFile = (file) => {
        let err = { isErr: false, msg: "" };
        if (file.isImage === 0) {
            err = { isErr: true, msg: "必须为图片文件" };
            return err;
        }
        if (file.imageWidth !== 1920 || file.imageHeight !== 1200) {
            err = { isErr: true, msg: `图片规格必须为1920*1200,上传图片宽:${file.imageWidth}高:${file.imageHeight}!` }
            return err;
        }
        return err;
    }

    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentSetup === undefined || !isEdit) {
            return
        }
        //更新errors
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        //更新输入的用户信息
        setCurrentSetup((prevState) => {
            // 结构赋值方法
            return ({
                ...prevState,
                [itemkey]: value,
            });
        });
    };

    //提交保存
    const handleModifySetup = async () => {
        let newInfo = cloneDeep(currentSetup);
        const modifyRes = await reqModifyLandingPageInfo(newInfo);
        if (modifyRes.data.status === 0) {
            newInfo = modifyRes.data.data;
            message.success("修改成功!");
        } else {
            message.error("向服务器提交修改信息错误:"+modifyRes.data.statusMsg);
        }

        setCurrentSetup(newInfo);
        setIsEdit(false);
    };

    return (
        <>
            <PageTitle pageName="首页定义" />
            <Divider my={2} />
            <Paper sx={{ width: "100%", maxHeight: contentHeight, mt: 2, backgroundColor: "paper" ,overflowX:"hidden",overflowY:"scroll"}}>
                {currentSetup !== undefined
                    ? <Card sx={{ mt: 0, width: "100%", alignItems: "center", justifyContent: "center" }}>
                        <CardContent>
                            <Grid container spacing={4}>
                                <Grid item xs={8}>
                                    <Grid item xs={12} textAlign="left" pb={4}>
                                        {isEdit
                                            ? <>
                                                <Button variant='contained' disabled={checkError(errors)} onClick={handleModifySetup}>保存</Button>
                                                <Button color='error' variant='contained' onClick={() => setIsEdit(false)} sx={{ ml: 4 }}>取消</Button>
                                            </>
                                            : <Button variant="contained" onClick={() => setIsEdit(true)} >修改</Button>
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ScInput
                                            dataType={301}
                                            allowNull={false}
                                            isEdit={isEdit}
                                            itemShowName="显示名称"
                                            itemKey="sysnamedisp"
                                            initValue={currentSetup.sysnamedisp}
                                            pickDone={handleGetValue}
                                            placeholder="请输入显示名称(不超过64字)"
                                            isBackendTest={false}
                                            key="sysnamedisp"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ScInput
                                            dataType={301}
                                            allowNull={false}
                                            isEdit={isEdit}
                                            itemShowName="系统介绍"
                                            itemKey="introtext"
                                            initValue={currentSetup.introtext}
                                            pickDone={handleGetValue}
                                            placeholder="请输入系统介绍(不超过128字)"
                                            isBackendTest={false}
                                            isMultiline={true}
                                            rowNumber={2}
                                            key="sysnamedisp"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ScInput
                                            dataType={903}
                                            allowNull={true}
                                            isEdit={isEdit}
                                            itemShowName="选择图片"
                                            itemKey="file"
                                            initValue={currentSetup.file}
                                            pickDone={handleGetValue}
                                            placeholder="请选择图片"
                                            isBackendTest={true}
                                            backendTestFunc={handleCheckFile}
                                            key="file"
                                        />
                                    </Grid>
                                    <Grid item xs={12} s>
                                        <Typography variant="subtitle1">图片预览:</Typography>
                                        <ImageWrapper>
                                            <Image
                                                alt="instroduction image review"
                                                src={currentSetup.file.fileid === 0 ? `/static/img/screenshots/dashboard.jpg` : currentSetup.file.fileurl}
                                            />
                                        </ImageWrapper>

                                    </Grid>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle2">说明:</Typography>
                                    <img
                                        alt="landing Page Setup help"
                                        src={`/static/img/helps/landingpagesetup.jpg`}
                                        style={{ maxHeight: "100%" }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    : <Loader />
                }
            </Paper>
        </>
    );
};

export default LandingPageSetUp;