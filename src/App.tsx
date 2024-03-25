import { useEffect, useState } from "react";
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useParams,
} from "react-router-dom";
import axios from "axios";

import Loader from "./common/Loader/index";
import PageTitle from "./components/PageTitle";
import ECommerce from "./pages/Dashboard/ECommerce";
import Settings from "./pages/Settings";
import Neworder from "./pages/Sales/Neworder";
import Vieworder from "./pages/Sales/Vieworder";
import Printorder from "./pages/Sales/printorder";
import AddCustomer from "./pages/Customer/AddCustomer";
import ViewCustomer from "./pages/Customer/ViewCustomer";
import NotFound from "./pages/NotFound";
import ViewEntry from "./pages/Dispatch/ViewEntry";
import OrderEntry from "./pages/Dispatch/OrderEntry";
import NewInvoice from "./pages/Invoice/NewInvoice";
import ViewInvoice from "./pages/Invoice/ViewInvoice";
import PrintInvoice from "./pages/Invoice/PrintInvoice";

axios.defaults.baseURL = "https://cors-abineshcodes-projects.vercel.app";

function App() {
    const [loading, setLoading] = useState<boolean>(true);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    return loading ? (
        <Loader />
    ) : (
        <>
            <Routes>
                <Route
                    index
                    element={
                        <>
                            <PageTitle title="Dashboard | YHD" />
                            <ECommerce />
                        </>
                    }
                />
                <Route
                    path="/customer/new"
                    element={
                        <>
                            <PageTitle title="New-Customer | YHD" />
                            <AddCustomer />
                        </>
                    }
                />
                <Route
                    path="/customer/view"
                    element={
                        <>
                            <PageTitle title="View-Customer | YHD" />
                            <ViewCustomer />
                        </>
                    }
                />
                <Route
                    path="/order/new"
                    element={
                        <>
                            <PageTitle title="New-Order | YHD" />
                            <Neworder />
                        </>
                    }
                />
                <Route
                    path="/order/view"
                    element={
                        <>
                            <PageTitle title="View-Order | YHD" />
                            <Vieworder />
                        </>
                    }
                />
                <Route
                    path="/order/print"
                    element={
                        <>
                            <PageTitle title="Printing Preview | YHD" />
                            <Printorder />
                        </>
                    }
                />
                {/* Dispatching Routing Starts Here:)) */}
                <Route
                    path="/dispatch/entry"
                    element={
                        <>
                            <PageTitle title="OrderEntry | YHD" />
                            <OrderEntry />
                        </>
                    }
                />
                <Route
                    path="/dispatch/view"
                    element={
                        <>
                            <PageTitle title="OrderEntry | YHD" />
                            <ViewEntry />
                        </>
                    }
                />
                <Route
                    path="/invoice/new"
                    element={
                        <>
                            <PageTitle title="Quote | YHD" />
                            <NewInvoice />
                        </>
                    }
                />
                <Route
                    path="/invoice/view"
                    element={
                        <>
                            <PageTitle title="Viewing Invoice | YHD" />
                            <ViewInvoice />
                        </>
                    }
                />
                <Route
                    path="/invoice/print"
                    element={
                        <>
                            <PageTitle title="Printing Invoice | YHD" />
                            <PrintInvoice />
                        </>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <>
                            <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <Settings />
                        </>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
    return loading ? (
        <Loader />
    ) : (
        <>
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route
                    path="/"
                    element={<Navigate to="/analytics/dashboard" />}
                />
                <Route
                    index
                    path="/analytics/dashboard"
                    element={
                        <>
                            <PageTitle title="Dashboard | YHD" />
                            <Dashboard />
                        </>
                    }
                />
                <Route
                    path="/analytics/performance"
                    element={
                        <>
                            <PageTitle title="Performance | YHD" />
                            <Performance />
                        </>
                    }
                />
                <Route
                    path="/client/new"
                    element={
                        <>
                            <PageTitle title="New-Customer | YHD" />
                            <AddCustomer />
                        </>
                    }
                />
                <Route
                    path="/client/view"
                    element={
                        <>
                            <PageTitle title="View-Customer | YHD" />
                            <ViewCustomer />
                        </>
                    }
                />
                <Route
                    path="/order/new"
                    element={
                        <>
                            <PageTitle title="New-Order | YHD" />
                            <Neworder />
                        </>
                    }
                />
                <Route
                    path="/order/view"
                    element={
                        <>
                            <PageTitle title="View-Order | YHD" />
                            <Vieworder />
                        </>
                    }
                />
                <Route
                    path="/order/print"
                    element={
                        <>
                            <PageTitle title="Printing Preview | YHD" />
                            <Printorder />
                        </>
                    }
                />
                <Route
                    path="/dispatch/entry"
                    element={
                        <>
                            <PageTitle title="OrderEntry | YHD" />
                            <OrderEntry />
                        </>
                    }
                />
                <Route
                    path="/dispatch/view"
                    element={
                        <>
                            <PageTitle title="OrderEntry | YHD" />
                            <ViewEntry />
                        </>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
