import React, { useState, useEffect } from "react";
import axios from "axios";
import CurtainsOrdersTable from "./printTable/CurtainsOrdersTable";
import SofaOrdersTable from "./printTable/SofaOrdersTable";
import BlindOrdersTable from "./printTable/BlindOrdersTable";
import FurnitureOrdersTable from "./printTable/FurnitureOrdersTable";
import WallpaperOrdersTable from "./printTable/WallpaperOrdersTable";
import FlooringsOrdersTable from "./printTable/FlooringsOrdersTable";
import Logo from "../../images/logo/Logo.png";
import Loader from "../../common/Loader/index";

axios.defaults.baseURL = "https://cors-h05i.onrender.com";

const printTable = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/api/customer/names", getHeaders());
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error.message);
    }
  };

  const fetchCustomerDetails = async (customerId) => {
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

  const fetchProducts = async (customerId) => {
    try {
      setLoading(true); // Set loading to true while fetching products
      const response = await axios.get(
        `/api/products/${customerId}`,
        getHeaders()
      );
      console.log("Products data:", response.data); // Log the products data
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    } finally {
      setLoading(false); // Set loading back to false after fetching completes
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

  const handleSelectCustomer = async (customerId) => {
    const customerDetails = await fetchCustomerDetails(customerId);
    setSelectedCustomer(customerDetails);
    fetchProducts(customerId);
  };

  const renderProductTables = () => {
    if (loading) {
      return (
        <div className="text-center mt-4">
          Loading...
          <Loader />
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-gray-600 text-xl text-center mt-4">
          Oops! No product data available
        </div>
      );
    }

    const productTables = {};
    products.forEach((product) => {
      const category = product.category;
      if (!productTables[category]) {
        productTables[category] = [];
      }
      productTables[category].push(product);
    });

    return Object.entries(productTables).map(([category, products]) => {
      switch (category) {
        case "Curtains":
          return <CurtainsOrdersTable key={category} products={products} />;
        case "Sofa":
          return <SofaOrdersTable key={category} products={products} />;
        case "Blinds":
          return <BlindOrdersTable key={category} products={products} />;
        case "Furniture":
          return <FurnitureOrdersTable key={category} products={products} />;
        case "Wallpaper":
          return <WallpaperOrdersTable key={category} products={products} />;
        case "Flooring":
          return <FlooringsOrdersTable key={category} products={products} />;
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
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
          <style>
          body, h1, p, table {
            margin: 10px;
            padding: 0;
            border-radius: 5px;
          }

          /* Global styles */
          body {
            font-family: "Inter", sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            line-height: 1;
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
              text-transform: uppercase;
          }

          .invoice-header p {
              margin: 5px 0;
              color: #666;
              font-family: "Nunito",sans-serif;
              font-weight: 300;
          }

          /* Customer details styles */
          .customer-details {
              margin-top: 10px;
          }

          /* Table styles */
          table {
              width: 75%;
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
              padding: 10px auto;
          }

          /* Image styles */
          img {
              max-width: 160px;
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

    setTimeout(() => {
      try {
        newWindow.print();
        console.log("Printing initiated");
      } catch (error) {
        console.error("Error during printing:", error);
      }
      newWindow.close(); // Close the window after printing
    }, 1000); // Delay printing to ensure proper loading
  };

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true);
      console.log("Generating PDF for you :)...");
      const printContent = document.querySelector(".print-content");
      const htmlContent = `
        <html>
          <head>
            <title>Invoicing Preview</title>
            <style>
              /* Include the CSS styles from handlePrint function */
              body, h1, p, table {
                margin: 10px;
                padding: 0;
              }
  
              /* Global styles */
              body {
                font-family: Arial, sans-serif;
                line-height: 1;
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
                width: 70%;
                border-collapse: collapse;
                margin-top: 20px;
                border-radius: 5px;
                margin: 0 20px;
              }
              th{
                padding: 15px auto;
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
      console.log("Content Posted", htmlContent);

      const response = await axios.post("/api/pdf/convert", htmlContent, {
        headers: {
          "Content-Type": "text/html",
          ...getHeaders().headers,
        },
        responseType: "blob",
      });

      console.log("PDF generated successfully:", response.data);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invoice.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error.message);
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <select
        value={selectedCustomer ? selectedCustomer.id : ""}
        onChange={(e) => handleSelectCustomer(e.target.value)}
        className="block w-full p-3 border border-slate-400 shadow-lg rounded-xl dark:bg-slate-950 focus:outline-none focus:border-strokedark mb-4"
      >
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
              src="https://ik.imagekit.io/tealcdn2023/assets/Logo.png?updatedAt=1709360170200"
              className="w-25"
              alt={"Logo"}
            ></img>
            <h1 className="text-3xl font-semibold uppercase text-slate-800 dark:text-white">
              Yash Home Decors
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              #174, Pycrofts Road, Royapettah, Chennai - 600014
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Ph: +91-95000-05914
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              GSTIN/UIN: 33CJWPM2113B1ZJ
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Tamil Nadu, Code: 33
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Email: yashdecoratives@gmail.com
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
                <span className="font-semibold">Customer Name:</span>{" "}
                {selectedCustomer.clientName}
              </p>
              <p>
                <span className="font-semibold">Customer ID:</span>{" "}
                {selectedCustomer.cid}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {selectedCustomer.address}
              </p>
              <p>
                <span className="font-semibold">Client Type:</span>{" "}
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
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrint}
          className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-xl"
        >
          Print & Download
        </button>
        <button
          onClick={handleGeneratePDF}
          className="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded-xl"
          disabled={generatingPDF}
        >
          {generatingPDF ? "Generating PDF..." : "Generate PDF"}
        </button>
      </div>
    </div>
  );
};

export default printTable;