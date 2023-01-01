import React, { useState } from "react";
import "./Layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const adminMenu = [
    {
      name: "Home",
      path: "/admin/home",
      icon: "ri-home-line",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "ri-user-line",
    },
  ];

  return (
    <div className="main">
      <div className="d-flex layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1 className="text-black text-center" style={{fontSize:'25px'}}>Ring</h1>
          </div>
          <div className="menu">
            {adminMenu.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item" //head
                  }`}
                  onClick={() => {
                    navigate(menu.path);
                  }}
                  >
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div
              className={`d-flex menu-item`}
              onClick={() => {
                localStorage.removeItem("adminToken");
                navigate("/admin");
              }}
            >
              <i className="ri-logout-circle-line"></i>
              {!collapsed && <Link to="/login">Logout</Link>}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                class="ri-menu-2-line header-action-icon"
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-close-line header-action-icon"
                onClick={() => setCollapsed(true)}
              ></i>
            )}
            <div className="d-flex align-items-center px-3">
              {/* <Badge className="mx-3" size="default" count={user?.unseenNotifications.length} onClick={()=>navigate('/notifications')}>
                <i className="ri-notification-line header-action-icon"></i>
              </Badge> */}
              
              <h4 className="anchor">
                admin
              </h4>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;