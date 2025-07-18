import { Fragment } from "react";
import DownloadQR from "./DownloadQR";
import AppBar from "./AppBar";
import Introduction from "./Introduction";
import About from "./About";

function Presentation() {
  return (
    <Fragment>
        <DownloadQR />
        <AppBar />
        <Introduction /> 
        <About />
    </Fragment>
  );
}

export default Presentation;
