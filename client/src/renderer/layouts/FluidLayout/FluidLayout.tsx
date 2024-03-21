import { Outlet } from "react-router-dom";

export default function FluidLayout() {
  const getAppVersion = localStorage.getItem('app-version');
  return (
    <div className="wrapper">
      <div className="container-fluid"><Outlet/></div>
      <div id="app-version">Phiên bản: {getAppVersion}</div>
    </div>
  );
};
