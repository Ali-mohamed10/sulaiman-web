import Nav from "./Nav";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export default function Layout() {
  const { isLogin, setIsLogin } = useContext(AuthContext);
  return (
    <>
      <Nav isLogin={isLogin} setIsLogin={setIsLogin} />
      <Outlet />
    </>
  );
}
