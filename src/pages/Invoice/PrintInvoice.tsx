import React, { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import Loader from "../../common/Loader/index";

const PrintInvoice = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);

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

  const fetchInvoices = async (customerId) => {
    try {
      const response = await axios.get(
        `/api/invoice/${customerId}`,
        getHeaders()
      );
      setInvoices(response.data);
      console.log("Invoices:", response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error.message);
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
    try {
      setLoading(true);
      const customerDetails = await fetchCustomerDetails(customerId);
      setSelectedCustomer(customerDetails);
      await fetchInvoices(customerId); // Fetch invoices for the selected customer
      setLoading(false);
    } catch (error) {
      console.error("Error selecting customer:", error.message);
      setLoading(false);
    }
  };

  const filterInvoicesByCategory = (category) => {
    return invoices.filter((invoice) => invoice.category === category);
  };

  const uniqueCategories = Array.from(
    new Set(
      invoices && invoices.length > 0
        ? invoices.map((invoice) => invoice.category)
        : []
    )
  );

  const handlePrint = () => {
    const printContent = document.querySelector(".print-content");
    const newWindow = window.open("", "_blank");
    const htmlContent = `
    <html>
    <head>
    <title>Invoicing</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: "Inter", sans-serif;
          font-optical-sizing: auto;
          font-weight: 400;
          line-height: 1;
          color: #333;
          margin: 1%;
        }

        image {
          width: 180px;
          height: 180px;
        }
    
        .customer-details {
          margin-top: 20px;
          margin-right: 30px;
        }
    
        table {
          width: 90%;
          border-collapse: collapse;
          background-color: #f8f8f8;
        }
    
        th, td {
          border: 1px solid #ccc;
          text-align: center;
        }
    
        th {
          background-color: #880D1E;
          color: #fff;
        }
    
        /* Terms and conditions styles */
        .terms-conditions {
          margin: 30px 60px;
          background-color: rgb(241 245 249);
          border-radius: 5px;
          page-break-before: always;
          padding: 10px;
        }
    
        .terms-conditions h2 {
          color: #DD2342;
          margin-top: 0;
          font-weight: bold;
          font-size: 20px;
        }
    
        .terms-conditions ol li {
          margin-bottom: 5px;
        }
@page {
  margin: 15%;
  size: landscape;
}
section {
  page-break-after: always;
  break-after: page;
  width: 500px;
}


.print-content h1,
.print-content h2,
.print-content p {
  margin: 10px 0;
}
.order-details {
  margin-right: 35px;
}

.print-content table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  color:black;
}

.print-content th,
.print-content td {
  padding: 0 !important;
  border: 1px solid #ccc;
  text-align: left;
  color: #000;
}

.print-content th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.print-content ol {
  margin-left: 20px;
}
.justify-between{
  justify-content:between;
}

.print-content .terms-conditions {
  margin-top: 10px;
  border-radius: 5px;
  background-color: #f8f8f8;
}

.print-content .terms-conditions h2 {
  color: #DD2342;
  font-size: 18px;
  margin-top: 0;
}

.yhd {
  margin-left: 2%;
  margin-top: 1%;
}

.print-content .terms-conditions p {
  margin: 10px 0;
}

.print-content .terms-conditions ol {
  margin-left: 20px;
}

.print-content {
  margin: 5%;
}

@page {
  margin: 1cm; 
}

.print-content table tbody tr,
.table-category {
  page-break-inside: avoid; 

section {
  margin-bottom: 20px; 
}
@page {
  size: landscape;
}      </style>
    </head>
    <body>
      ${printContent.innerHTML}
      <div class="terms-conditions">
        <h2>Terms and Conditions:</h2>
        <ol>
          <li>50% advance payment to be made in favor of “YASH HOME DECORS”</li>
          <li>Delivery period 45 to 60 days on receipt of the payment.</li>
          <li>Our Responsibility Ceases as soon as the goods leave our hands.</li>
          <li>Order once placed cannot be taken back or exchanged.</li>
          <li>Service will be given if any damage occurred (not immediate).</li>
          <li>Finished Product should be collected at CHOOLAI showroom.</li>
          <li>In case of outstation work there will be extra charges levied.</li>
          <li>At the time of installation ladders & scaffolding should be provided by the clients.</li>
          <li>Material not mentioned in the quote will be extra.</li>
          <li>Final installation will be done after complete payment.</li>
          <li>TRANSPORATION AND INSTALLATION WILL BE EXTRA</li>
        </ol>
        <hr/>
        <br/>
        <p><strong>GST TIN NO:</strong> 33CJWPM2113B1ZJ</p>
        <p><strong>Our Bank Details:</strong></p>
        <p><strong>ACCOUNT NO:</strong>357201010036581</p>
        <p><strong>A/C NAME:</strong> Yash Home Decors</p>
        <p>UNION BANK OF INDIA (TRIPLICANE BRANCH)</p>
        <p><strong>IFSC Code:</strong> UBIN053572</p>
      </div>
      <script src="https://cdn.tailwindcss.com"></script>
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
      newWindow.close();
    }, 1000);
  };

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true);
      const printContent = document.querySelector(".print-content");
      const htmlContent = `
      <html>
      <head>
      <title>Invoicing</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: "Inter", sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            line-height: 1;
            color: #333;
            margin: 1%;
          }
  
          image {
            width: 180px;
            height: 180px;
          }
      
          .customer-details {
            margin-top: 20px;
            margin-right: 30px;
          }
      
          table {
            width: 90%;
            border-collapse: collapse;
            background-color: #f8f8f8;
          }
      
          th, td {
            border: 1px solid #ccc;
            text-align: center;
          }
      
          th {
            background-color: #880D1E !important;
            color: #fff;
          }
      
          /* Terms and conditions styles */
          .terms-conditions {
            margin: 30px 60px;
            background-color: rgb(241 245 249);
            border-radius: 5px;
            page-break-before: always;
            padding: 10px;
          }
      
          .terms-conditions h2 {
            color: #DD2342;
            margin-top: 0;
            font-weight: bold;
            font-size: 20px;
          }
      
          .terms-conditions ol li {
            margin-bottom: 5px;
          }
  section {
    page-break-after: always;
    break-after: page;
    width: 500px;
  }
  
  
  .print-content h1,
  .print-content h2,
  .print-content p {
    margin: 10px 0;
  }
  .order-details {
    margin-right: 35px;
  }
  
  .print-content table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    color:black;
  }
  
  .print-content th,
  .print-content td {
    padding: 0 !important;
    border: 1px solid #ccc;
    text-align: left;
    color: #000;
  }
  
  .print-content th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  
  .print-content ol {
    margin-left: 20px;
  }
  .justify-between{
    justify-content:between;
  }
  
  .print-content .terms-conditions {
    margin-top: 10px;
    border-radius: 5px;
    background-color: #f8f8f8;
  }
  
  .print-content .terms-conditions h2 {
    color: #DD2342;
    font-size: 18px;
    margin-top: 0;
  }
  
  .yhd {
    margin-left: 2%;
    margin-top: 1%;
  }
  
  .print-content .terms-conditions p {
    margin: 10px 0;
  }
  
  .print-content .terms-conditions ol {
    margin-left: 20px;
  }
  
  .print-content {
    margin: 5%;
  }
  
  @page {
    margin: 1px; 
    size:landscape;
  }
  
  .print-content table tbody tr,
  .table-category {
    page-break-inside: avoid; 
  
  section {
    margin-bottom: 20px; 
  }
  
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
        <div class="terms-conditions">
          <h2>Terms and Conditions:</h2>
          <ol>
            <li>50% advance payment to be made in favor of “YASH HOME DECORS”</li>
            <li>Delivery period 45 to 60 days on receipt of the payment.</li>
            <li>Our Responsibility Ceases as soon as the goods leave our hands.</li>
            <li>Order once placed cannot be taken back or exchanged.</li>
            <li>Service will be given if any damage occurred (not immediate).</li>
            <li>Finished Product should be collected at CHOOLAI showroom.</li>
            <li>In case of outstation work there will be extra charges levied.</li>
            <li>At the time of installation ladders & scaffolding should be provided by the clients.</li>
            <li>Material not mentioned in the quote will be extra.</li>
            <li>Final installation will be done after complete payment.</li>
            <li>TRANSPORATION AND INSTALLATION WILL BE EXTRA</li>
          </ol>
          <hr/>
          <br/>
          <p><strong>GST TIN NO:</strong> 33CJWPM2113B1ZJ</p>
          <p><strong>Our Bank Details:</strong></p>
          <p><strong>ACCOUNT NO:</strong>357201010036581</p>
          <p><strong>A/C NAME:</strong> Yash Home Decors</p>
          <p>UNION BANK OF INDIA (TRIPLICANE BRANCH)</p>
          <p><strong>IFSC Code:</strong> UBIN053572</p>
        </div>
        <script src="https://cdn.tailwindcss.com"></script>
      </body>
      </html>
      `;
      const serverUrl = "https://cors-1-4v2k.onrender.com/convert";

      const response = await fetch(`${serverUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "text/html",
        },
        body: htmlContent,
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      console.log("PDF file downloaded successfully.");
      setGeneratingPDF(false);
    } catch (error) {
      console.error("Error generating PDF:", error.message);
      setGeneratingPDF(false);
    }
  };

  const calculateSubtotalByCategory = (category) => {
    const categoryInvoices = filterInvoicesByCategory(category);
    const subtotal = categoryInvoices.reduce(
      (total, invoice) => total + parseFloat(invoice.data.total),
      0
    );
    return subtotal.toFixed(2);
  };

  const calculateGrandTotal = () => {
    if (!Array.isArray(invoices)) {
      return 0;
    }
    if (invoices.length > 0) {
      const subtotal = invoices.reduce(
        (total, invoice) => total + parseFloat(invoice.data.total),
        0
      );
      const discountAmount = (subtotal * discountPercentage) / 100; // Calculate discount amount
      const grandTotal = subtotal - discountAmount; // Subtract discount amount from subtotal
      return grandTotal.toFixed(2);
    } else {
      return 0;
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="PrintInvoice" className="font-normal" />
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

        {loading ? (
          <Loader />
        ) : selectedCustomer ? (
          <div>
            <div className="bg-white dark:bg-slate-950 p-4 shadow-lg rounded-xl print-content">
              <div className="flex justify-between yhd flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img
                    src="https://ik.imagekit.io/tealcdn2023/assets/YHD.png"
                    width="100"
                    className="w-25"
                    alt="Logo"
                  />
                  <h1 className="text-3xl font-semibold uppercase text-slate-800 dark:text-white">
                    Yash Home Decors
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    #174, Pycrofts Road, Royapettah, Chennai - 600014
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Ph: +91-95000-05914
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    GSTIN/UIN: 33CJWPM2113B1ZJ
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Tamil Nadu, Code: 33
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Email: yashdecoratives@gmail.com
                  </p>
                </div>

                <div className="md:w-1/3 mt-4 md:mt-0 sm:text-start md:text-end">
                  <div className="order-details">
                    <h2 className="text-xl font-normal uppercase text-slate-600 dark:text-white">
                      Order Details
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Date: 19/02/2024
                    </p>
                  </div>

                  <div className="mt-4 customer-details">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-neutral-900 dark:text-white">
                      <h2 className="text-2xl font-normal uppercase text-neutral-800 dark:text-white">
                        Customer Details
                      </h2>
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
                </div>
              </div>

              <div className="max-w-screen mx-auto p-6 space-y-6 text-neutral-700 dark:text-neutral-100">
                <h1 className="text-3xl font-normal uppercase">
                  Order Invoice
                </h1>

                <div className="overflow-y-auto overflow-x-auto rounded-xl">
                  {/* Subtotal by category */}
                  {uniqueCategories.map((category, index) => (
                    <div
                      key={index}
                      className="overflow-y-auto overflow-x-auto rounded-xl table-category"
                    >
                      <h2 className="text-2xl font-medium mt-6 mb-4 text-teal-800 dark:text-teal-200">
                        {category} Invoices
                      </h2>
                      <table className="w-full rounded-lg text-sm text-left text-slate-500 dark:text-slate-400 bg-gray-900 dark:bg-gray-800">
                        {/* Table header */}
                        <thead className="rounded-lg text-sm text-blue-900 uppercase bg-blue-100 dark:bg-slate-900 dark:text-slate-300">
                          <tr>
                            <th scope="col" className="px-3 py-4">
                              S.No.
                            </th>
                            <th scope="col" className="px-3 py-4">
                              Particulars
                            </th>
                            <th scope="col" className="px-4 py-4">
                              Quantity
                            </th>
                            <th scope="col" className="px-4 py-4">
                              Rate
                            </th>
                            <th scope="col" className="px-4 py-4">
                              Amount
                            </th>
                            <th scope="col" className="px-4 py-4">
                              GST %
                            </th>
                            <th scope="col" className="px-4 py-4">
                              GST Amt
                            </th>
                            <th scope="col" className="px-4 py-4">
                              Discount
                            </th>
                            <th scope="col" className="px-4 py-4">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filterInvoicesByCategory(category).map(
                            (invoice, index) => (
                              <tr
                                key={invoice.id}
                                className="bg-white border-b border-zinc-200 dark:bg-slate-800 dark:border-slate-700"
                              >
                                <td className="py-2 px-3 text-slate-900">
                                  {index + 1}
                                </td>
                                <td className="py-2 px-3">
                                  {invoice.data.area}
                                </td>
                                <td className="py-2 px-4">
                                  {invoice.data.quantity}
                                </td>
                                <td className="py-2 px-4">
                                  {invoice.data.rate}
                                </td>
                                <td className="py-2 px-4">
                                  {invoice.data.amount}
                                </td>
                                <td className="py-2 px-4">
                                  {invoice.data.gstPercentage}
                                </td>
                                <td className="py-2 px-4">
                                  {invoice.data.gstAmount}
                                </td>
                                <td className="py-2 px-2">
                                  <span className="text-xs">
                                    ({invoice.data.discountPercentage}%)
                                  </span>
                                  <span className="text-sm ml-1">
                                    {invoice.data.discountAmount}
                                  </span>
                                </td>

                                <td className="py-2 px-4">
                                  {invoice.data.total}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                      {/* Subtotal calculation with Category <div className="flex justify-end"><p className="font-normal text-xl">Subtotal ({category}) : {calculateSubtotalByCategory(category)} <br /></p></div></div>*/}
                      <div className="flex justify-end">
                        <p className="font-normal text-lg">
                          Subtotal - {calculateSubtotalByCategory(category)}{" "}
                          <br />
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* GrandTotal calculation */}
                  <div className="flex justify-end">
                    <p className="font-normal text-xl bg-slate-100 p-2 rounded-xl text-neutral-900">
                      Grand Total : {calculateGrandTotal()} <br />
                    </p>
                  </div>
                </div>

                {/* Edit Invoice Modal */}
                {showEditModal && (
                  <EditInvoiceModal
                    invoice={editedInvoice}
                    saveEditedInvoice={saveEditedInvoice}
                    closeModal={closeModal}
                  />
                )}

                {/* Toast Notification */}
                {showToast && (
                  <div
                    id="toast-success"
                    className="absolute top-0 right-0 flex items-center w-xl max-w-xs p-2 px-4 mr-4 mb-4 text-slate-500 bg-emerald-100 rounded-lg shadow"
                    role="alert"
                  >
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-900 bg-emerald-300 rounded-lg">
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 0a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8 14a2 2 0 1 1 4 0H8zm1-6a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0V8z"
                        />
                      </svg>
                    </div>
                    <p className="ml-2 text-slate-800 font-normal">
                      {toastMessage}
                    </p>
                  </div>
                )}
              </div>
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
                className="bg-emerald-600 hover:bg-emerald-900 text-white py-2 px-4 rounded-xl"
                disabled={generatingPDF}
              >
                {generatingPDF ? "Generating PDF..." : "Generate PDF"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-900 text-xl mt-4">
            <img
              src="https://ik.imagekit.io/tealcdn2023/assets/No%20data-cuate.svg"
              className="w-100"
              alt="No data available"
            />
            <p>Oops! It seems there are no products available.</p>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default PrintInvoice;
