import { Fragment } from "react";
import DownloadQR from "./DownloadQR";
import AppBar from "./AppBar";
import Introduction from "./Introduction";
import Advantages from "./Advantages";
import About from "./About";

function Presentation() {
  return (
    <Fragment>
        <DownloadQR />
        <AppBar />
        <Introduction />
        <Advantages />
        <About />
    </Fragment>
  );
}

export default Presentation;
