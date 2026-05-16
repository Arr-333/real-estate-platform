"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // export default function Sidebar() {
  return (
    <>
      <div>
        {/* Sidebar */}
        <div
          id="main-sidebar"
          className={`main-sidebar ${isOpen ? "sidebar-open" : "sidebar-close"}`}
        >
          {/* Toggle Button */}
          <button onClick={toggleSidebar} className="sidebar-toggle-btn">
            {isOpen ? "◀" : "▶"}
          </button>

          <div className="sidebar-wrapper">
            <div id="main-sidebar" className="main-sidebar">
              <div className="sidebar-wrapper">
                <div
                  className="navbar-menu px-5 simplebar-scrollable-y"
                  id="navbar-menu-list"
                  data-simplebar="init"
                >
                  <div
                    className="simplebar-wrapper"
                    style={{ margin: "0px -20px" }}
                  >
                    <div className="simplebar-height-auto-observer-wrapper">
                      <div className="simplebar-height-auto-observer"></div>
                    </div>
                    <div className="simplebar-mask">
                      <div
                        className="simplebar-offset"
                        style={{ right: "0px; bottom: 0px" }}
                      >
                        <div
                          className="simplebar-content-wrapper"
                          tabIndex="0"
                          role="region"
                          aria-label="scrollable content"
                          style={{ height: "100%", overflow: "hidden scroll" }}
                        >
                          <div
                            className="simplebar-content"
                            style={{ padding: "0px 20px" }}
                          >
                            <ul className="list-unstyled p-0 navbar-nav-menu">
                              <li
                                className="nav-menu-title"
                                data-translate="pe-dashboards"
                              >
                                Dashboards
                              </li>
                              <li className="nav-item">
                                <Link
                                  className="nav-link "
                                  data-position="right-top"
                                  href="/admin/dashboard"
                                  aria-expanded="false"
                                >
                                  <span
                                    className="content"
                                    data-translate="pe-dashboards"
                                  >
                                    Dashboards
                                  </span>
                                </Link>
                                <div
                                  className="collapse"
                                  id="collapseDashboards"
                                ></div>
                              </li>
                              <li
                                className="nav-menu-title"
                                data-translate="pe-apps"
                              >
                                Pages
                              </li>
                              <li className="nav-item">
                                <Link
                                  className="nav-link "
                                  data-position="right-top"
                                  href="/admin/user"
                                  aria-expanded="false"
                                >
                                  <span
                                    className="content"
                                    data-translate="pe-chat"
                                  >
                                    User
                                  </span>
                                </Link>
                              </li>

                              <li className="nav-item">
                                <Link
                                  className="nav-link "
                                  data-position="right-top"
                                  href="/admin/role"
                                  aria-expanded="false"
                                >
                                  <span
                                    className="content"
                                    data-translate="pe-calendar"
                                  >
                                    Role
                                  </span>
                                </Link>
                              </li>
                              <li className="nav-item">
                                <Link
                                  className="nav-link "
                                  data-position="right-top"
                                  href="/admin/listing"
                                  aria-expanded="false"
                                >
                                  <span
                                    className="content"
                                    data-translate="pe-calendar"
                                  >
                                    Properties
                                  </span>
                                </Link>
                              </li>
                              <li className="nav-item">
                                <Link
                                  className="nav-link "
                                  data-position="right-top"
                                  href="/admin/propertyType"
                                  aria-expanded="false"
                                >
                                  <span
                                    className="content"
                                    data-translate="pe-calendar"
                                  >
                                    Property Types
                                  </span>
                                </Link>
                              </li>
                              <li className="nav-item">
                                <Link
                                  className="nav-link "
                                  data-position="right-top"
                                  href="/admin/state"
                                  aria-expanded="false"
                                >
                                  <span
                                    className="content"
                                    data-translate="pe-calendar"
                                  >
                                    State
                                  </span>
                                </Link>
                              </li>
                              <li className="nav-item">
                                <Link
                                  className="nav-link "
                                  data-position="right-top"
                                  href="/admin/city"
                                  aria-expanded="false"
                                >
                                  <span
                                    className="content"
                                    data-translate="pe-calendar"
                                  >
                                    City
                                  </span>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="simplebar-placeholder"
                      style={{ width: "248px", height: "1721px" }}
                    ></div>
                  </div>
                  <div
                    className="simplebar-track simplebar-horizontal"
                    style={{ visibility: " hidden" }}
                  >
                    <div
                      className="simplebar-scrollbar"
                      style={{ width: "0px", display: " none" }}
                    ></div>
                  </div>
                  <div
                    className="simplebar-track simplebar-vertical"
                    style={{ visibility: "visible" }}
                  >
                    <div
                      className="simplebar-scrollbar"
                      style={{
                        height: "190px",
                        transform: " translate3d(0px, 382px, 0px)",
                        display: "block",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
