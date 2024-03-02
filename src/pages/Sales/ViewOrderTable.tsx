import React, { useState, useEffect } from "react";
import axios from "axios";
import CurtainsOrdersTable from "./orderTable/CurtainsOrdersTable";
import SofaOrdersTable from "./orderTable/SofaOrdersTable";
import BlindOrdersTable from "./orderTable/BlindOrdersTable";
import FurnitureOrdersTable from "./orderTable/FurnitureOrdersTable";
import WallpaperOrdersTable from "./orderTable/WallpaperOrdersTable";
import FlooringsOrdersTable from "./orderTable/FlooringsOrdersTable";

axios.defaults.baseURL = "https://cors-h05i.onrender.com";

const ViewOrderComponent = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchCustomers(); // Fetch customers when component mounts
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(
                "/api/customer/names",
                getHeaders()
            );
            setCustomers(response.data);
        } catch (error: any) {
            console.error("Error fetching customers:", error.message);
        }
    };

    const fetchCustomerDetails = async (customerId: any) => {
        try {
            const response = await axios.get(
                `/api/customer/${customerId}`,
                getHeaders()
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching customer details:", error.message);
            return null;
        }
    };

    const fetchProducts = async (customerId: any) => {
        try {
            const response = await axios.get(
                `/api/products/${customerId}`,
                getHeaders()
            );
            console.log("Products data:", response.data); // Log the products data
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error.message);
        }
    };

    const getHeaders = () => {
        const username = "abinesh";
        const password = "abi";
        const basicAuth = "Basic " + btoa(username + ":" + password);
        return {
            headers: {
                Authorization: basicAuth,
            },
        };
    };

    const handleSelectCustomer = async (customerId: any) => {
        const customerDetails = await fetchCustomerDetails(customerId);
        setSelectedCustomer(customerDetails);
        fetchProducts(customerId);
    };

    const renderProductTables = () => {
        if (products.length === 0) {
            return (
                <div className="text-red-600 text-xl text-center mt-30">
                    Oops! :( <br />) No product data available
                </div>
            );
        }

        const productTables = {};
        products.forEach((product: any) => {
            const category = product.category;
            if (!productTables[category]) {
                productTables[category] = [];
            }
            productTables[category].push(product);
        });

        return Object.entries(productTables).map(([category, products]) => {
            switch (category) {
                case "Curtains":
                    return (
                        <CurtainsOrdersTable
                            key={category}
                            products={products}
                        />
                    );
                case "Sofa":
                    return (
                        <SofaOrdersTable key={category} products={products} />
                    );
                case "Blinds":
                    return (
                        <BlindOrdersTable key={category} products={products} />
                    );
                case "Furniture":
                    return (
                        <FurnitureOrdersTable
                            key={category}
                            products={products}
                        />
                    );
                case "Wallpaper":
                    return (
                        <WallpaperOrdersTable
                            key={category}
                            products={products}
                        />
                    );
                case "Flooring":
                    return (
                        <FlooringsOrdersTable
                            key={category}
                            products={products}
                        />
                    );
                default:
                    return null;
            }
        });
    };

    const handlePrint = () => {
        const printContent = document.querySelector(".print-content");
        const newWindow = window.open("", "_blank");
        const htmlContent = `
      <html>
        <head>
          <title>Invoicing Preview</title>
          <style>
          body, h1, p, table {
            margin: 0;
            padding: 0;
        }

        /* Global styles */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        /* Header styles */
        .invoice-header {
            background-color: #f2f2f2;
            padding: 10px;
            border-bottom: 1px solid #ccc;
        }

        .invoice-header h1 {
            margin: 0;
        }

        .invoice-header p {
            margin: 5px 0;
            color: #666;
        }

        /* Customer details styles */
        .customer-details {
            margin-top: 10px;
        }

        /* Table styles */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            border-radius:5px;
            margin: 0 20px;
        }

        th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        /* Image styles */
        img {
            max-width: 150px;
            height: auto;
        }
        </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `;
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        newWindow.print();
    };

    return (
        <div className="container mx-auto p-4">
            <select
                value={selectedCustomer ? selectedCustomer.id : ""}
                onChange={(e) => handleSelectCustomer(e.target.value)}
                className="block w-full p-3 border border-slate-400 shadow-lg rounded-xl dark:bg-slate-950 focus:outline-none focus:border-strokedark mb-4">
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                        {customer.clientName} - {customer.cid}
                    </option>
                ))}
            </select>

            <div className="bg-white dark:bg-slate-950 p-4 shadow-lg rounded-xl print-content">
                <div className="flex justify-between mb-4">
                    <div>
                        <img
                            src="/favicon.png"
                            className="w-25"
                            alt={"Logo"}></img>
                        <h1 className="text-3xl font-semibold uppercase text-slate-800 dark:text-white">
                            Yash Home Decors
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            No: 174, Pycrofts Road,(Nearby EA), Royapettah,
                            Chennai, Tamil Nadu 600014
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Phone: +91-95000 05914
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            yashdecoratives@gmail.com
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-normal uppercase text-slate-600 dark:text-white">
                            Order Details
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Date: 19/02/2024
                        </p>
                    </div>
                </div>

                {selectedCustomer && (
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Customer Details
                        </h2>
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
                            <p>
                                <span className="font-semibold">
                                    Customer Name:
                                </span>{" "}
                                {selectedCustomer.clientName}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Customer ID:
                                </span>{" "}
                                {selectedCustomer.cid}
                            </p>
                            <p>
                                <span className="font-semibold">Address:</span>{" "}
                                {selectedCustomer.address}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Client Type:
                                </span>{" "}
                                {selectedCustomer.clientType}
                            </p>
                            <p>
                                <span className="font-semibold">Purpose:</span>{" "}
                                {selectedCustomer.purpose}
                            </p>
                            <p>
                                <span className="font-semibold">Phone:</span>{" "}
                                {selectedCustomer.phone}
                            </p>
                            <p>
                                <span className="font-semibold">Email:</span>{" "}
                                {selectedCustomer.emailAddress}
                            </p>
                        </div>
                    </div>
                )}

                {renderProductTables()}
            </div>
            <div className="flex justify-end mt-4">
                <button
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">
                    Print & Download
                </button>
            </div>
        </div>
    );
};

export default ViewOrderComponent;
