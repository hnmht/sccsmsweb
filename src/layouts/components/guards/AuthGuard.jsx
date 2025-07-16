import * as React from "react";
import { Navigate,useLocation } from "react-router-dom"; //,useLocation
import { connect } from "react-redux";

function hasAuth(path,menulist) {
  return menulist.some(menu => menu.path === path);
}

// 只允许用于进入有权限的界面
function AuthGuard(props) {
  const { children, user } = props; 
  const location = useLocation();
  // console.log("AuthGuard location:",location);
  // console.log("AuthGuard user:",user);
  
  if (!user || JSON.stringify(user) === '{}' || user.name === '') {
    //如果user内容为空,表示用户没有登录，导航到登录界面
    return <Navigate to="/" />;
  } else if (!user.menulist || user.menulist.length === 0 || !hasAuth(location.pathname,user.menulist)) {
    return <Navigate to="/auth/page203" />
  } 
  // else {
  //   if (user.menulist.length === 0 ) {
  //     //没有分配权限的用户,导航到没有权限界面
  //     return <Navigate to="/auth/page203" />;
  //   }
  // }
  return <React.Fragment>{children}</React.Fragment>;
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, null)(AuthGuard);
