import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Logo from "/favicon.png";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const location = useLocation();
    const { pathname } = location;

    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null
            ? false
            : storedSidebarExpanded === "true"
    );

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    useEffect(() => {
        localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector("body")?.classList.add("sidebar-expanded");
        } else {
            document
                .querySelector("body")
                ?.classList.remove("sidebar-expanded");
        }
    }, [sidebarExpanded]);

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-gradient-to-tr from-slate-950 to-cyan-950 duration-500 ease-linear dark:bg-stone-900 lg:static lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-start gap-2 px-6 py-5.5 lg:py-6.5">
                <NavLink to="/" className="h-1/2 lg:h-full flex">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="max-h-full max-w-24"
                    />
                    <h3 className="text-xl text-slate-200 align-center py-3">
                        Yash Home Decors
                    </h3>
                </NavLink>

                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden ">
                    <svg
                        className="fill-current"
                        width="20"
                        height="18"
                        viewBox="0 0 20 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                            fill=""
                        />
                    </svg>
                </button>
            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                    {/* <----------YHD navs-------> */}

                    {/* --------analytice----- */}
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2 uppercase">
                            Analytics
                        </h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === "/analytics" ||
                                    pathname.includes("analytics")
                                }>
                                {(handleClick, open) => {
                                    return (
                                        <>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 px-4 py-2 font-normal rounded-xl text-bodydark2 duration-300 ease-in-out hover:bg-sky-950 dark:hover:bg-meta-4 ${
                                                    (pathname ===
                                                        "/analytics" ||
                                                        pathname.includes(
                                                            "analytics"
                                                        )) &&
                                                    "bg-sky-950 !text-bodydark1 dark:bg-meta-4"
                                                }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    sidebarExpanded
                                                        ? handleClick()
                                                        : setSidebarExpanded(
                                                              true
                                                          );
                                                }}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-5 h-5">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"></path>
                                                </svg>
                                                Analytics
                                                <svg
                                                    className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                                        open && "rotate-180"
                                                    }`}
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </NavLink>
                                            <div
                                                className={`translate transform overflow-hidden ${
                                                    !open && "hidden"
                                                }`}>
                                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="/analytics/dashboard"
                                                            className={({
                                                                isActive,
                                                            }) =>
                                                                "group relative flex items-center gap-2.5 rounded-md px-4 font-normal text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                                                (isActive &&
                                                                    "!text-white")
                                                            }>
                                                            <svg
                                                                className="w-6 h-6 text-gray-800 dark:text-white"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24">
                                                                <path
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeWidth="1.1"
                                                                    d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4"></path>
                                                            </svg>
                                                            Dashboard
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/analytics/performance"
                                                            className={({
                                                                isActive,
                                                            }) =>
                                                                "group relative flex items-center gap-2.5 rounded-md px-4 font-normal text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                                                (isActive &&
                                                                    "!text-white")
                                                            }>
                                                            <svg
                                                                className="w-6 h-6 text-gray-800 dark:text-white"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24">
                                                                <path
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="1.1"
                                                                    d="M13.6 16.7c.2.3.5.5.9.6a1.4 1.4 0 0 0 1.7-.8c.2-.6-.4-1.3-1.2-1.5-.8-.2-1.4-.8-1.2-1.5a1.4 1.4 0 0 1 1.7-.7c.4 0 .7.2.9.5m-1.4 4v.6m0-5.9v.7M4 15v4m3-6v6M6 8.5 10.5 5 14 7.5 18 4m0 0h-3.5M18 4v3m2 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"></path>
                                                            </svg>
                                                            Performance
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* <!-- Dropdown Menu End --> */}
                                        </>
                                    );
                                }}
                            </SidebarLinkGroup>
                        </ul>
                    </div>

                    {/* --------Customer----- */}
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2 uppercase">
                            Customer
                        </h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            <li>
                                <NavLink
                                    to="/customer/new"
                                    className={({ isActive }) =>
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-normal text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                        (isActive && "!text-white")
                                    }>
                                    <svg
                                        className="w-6 h-6 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.1"
                                            d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1c0 .6-.4 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
                                    </svg>
                                    Add Customer
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/customer/view"
                                    className={({ isActive }) =>
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-normal text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                        (isActive && "!text-white")
                                    }>
                                    <svg
                                        className="w-6 h-6 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="square"
                                            strokeLinejoin="round"
                                            strokeWidth="1.1"
                                            d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.1 1.9-.7-.7m5.6 5.6-.7-.7m-4.2 0-.7.7m5.6-5.6-.7.7M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
                                    </svg>
                                    View Customer
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    {/* --------Sales----- */}
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2 uppercase">
                            Sales
                        </h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            <li>
                                <NavLink
                                    to="/order/new"
                                    className={({ isActive }) =>
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-normal text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                        (isActive && "!text-white")
                                    }>
                                    <svg
                                        className="w-6 h-6 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.1"
                                            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.3L19 7h-1M8 7h-.7M13 5v4m-2-2h4"></path>
                                    </svg>
                                    New Order
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/order/view"
                                    className={({ isActive }) =>
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-normal text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                        (isActive && "!text-white")
                                    }>
                                    <svg
                                        className="w-6 h-6 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.1"
                                            d="M6 12c.3 0 .5 0 .8-.2.2 0 .4-.3.6-.5l.4-.7.2-.9c0 .6.2 1.2.6 1.6.4.4.9.7 1.4.7.5 0 1-.3 1.4-.7.4-.4.6-1 .6-1.6 0 .6.2 1.2.6 1.6.4.4.9.7 1.4.7.5 0 1-.3 1.4-.7.4-.4.6-1 .6-1.6a2.5 2.5 0 0 0 .6 1.6l.6.5a1.8 1.8 0 0 0 1.6 0l.6-.5.4-.7.2-.9c0-1-1.1-3.8-1.6-5a1 1 0 0 0-1-.7h-11a1 1 0 0 0-.9.6A29 29 0 0 0 4 9.7c0 .6.2 1.2.6 1.6.4.4.9.7 1.4.7Zm0 0c.3 0 .7 0 1-.3l.7-.7h.6c.2.3.5.6.8.7a1.8 1.8 0 0 0 1.8 0c.3-.1.6-.4.8-.7h.6c.2.3.5.6.8.7a1.8 1.8 0 0 0 1.8 0c.3-.1.6-.4.8-.7h.6c.2.3.5.6.8.7.2.2.6.3.9.3.4 0 .7-.1 1-.4M6 12a2 2 0 0 1-1.2-.5m.2.5v7c0 .6.4 1 1 1h2v-5h3v5h7c.6 0 1-.4 1-1v-7m-5 3v2h2v-2h-2Z"></path>
                                    </svg>
                                    View Order
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    {/* <----------YHD navs ends-------> */}
                    {/* Future Component Updates  Invoice/Add , View Order, UserProfile etc..*/}
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2 uppercase">
                            Invoicing
                        </h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-normal text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                        (isActive && "!text-white")
                                    }>
                                    <svg
                                        className="w-5 h-5 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.1"
                                            d="M18 9V4c0-.6-.4-1-1-1H9a1 1 0 0 0-.8.3l-4 4a1 1 0 0 0-.2.6V20c0 .6.4 1 1 1h4M9 3v4c0 .6-.4 1-1 1H4m11 6v4m-2-2h4m3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
                                        />
                                    </svg>
                                    Add Invoice
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-normal text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                        (isActive && "!text-white")
                                    }>
                                    <svg
                                        className="w-5 h-5 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path d="M9 7V2.2a2 2 0 0 0-.5.4l-4 3.9a2 2 0 0 0-.3.5H9Z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M11 7V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm4.7 5.7a1 1 0 0 0-1.4-1.4L11 14.6l-1.3-1.3a1 1 0 0 0-1.4 1.4l2 2c.4.4 1 .4 1.4 0l4-4Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    View Invoice
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </aside>
    );
};

export default Sidebar;
