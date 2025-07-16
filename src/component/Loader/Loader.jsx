import { Typography, CircularProgress } from "@mui/material";

function Loader() {
    return (
        <div
            style={{
                display: 'flex',	// 使用flex布局
                flexDirection: "column",
                position: 'absolute',	// 绝对定位
                top: '0px',	// 距离父级元素顶部0像素
                left: '0px',	// 距离父级元素左侧0像素
                zIndex: 10,	// 遮罩层的堆叠层级（只要设置的比被遮罩元素高就行）
                height: '100%',	// 与父级元素同高
                width: '100%',	// 与父级元素同宽
                background: 'rgba(0,0,0,0.3)',	// 半透明背景
                textAlign: 'center',
                justifyContent: "center",
                alignItems: 'center'
            }}>
            <CircularProgress color="primary" size={32} disableShrink />
            <Typography variant="body2" sx={{ mt: 2 }}>Loading...</Typography>
        </div>
    );
}

export default Loader;