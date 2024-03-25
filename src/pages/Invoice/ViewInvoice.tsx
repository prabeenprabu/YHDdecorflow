import React, { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import EditInvoiceModal from "./EditInvoiceModal";
import Loader from "../../common/Loader/index";
import edit from "../../images/icon/edit.svg";
import trash from "../../images/icon/trash.svg";

const ViewInvoice = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/customer/names", getHeaders());
      setCustomers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error.message);
      setIsLoading(false);
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

  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value);
    fetchInvoices(e.target.value);
  };

  const fetchInvoices = async (customerId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/invoice/${customerId}`,
        getHeaders()
      );
      setInvoices(response.data);
      setIsLoading(false);
      console.log("Invoices:", response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error.message);
      setIsLoading(false);
    }
  };

  const editInvoice = (invoice) => {
    setEditedInvoice(invoice);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
  };

  const saveEditedInvoice = async (editedData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("customerId", editedData.customerId);
      formDataToSend.append("category", editedData.category);
      Object.keys(editedData.data).forEach((key) => {
        formDataToSend.append(`${key}`, editedData.data[key]);
      });

      const response = await axios.put(
        `/api/invoice/${editedData.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Basic " + btoa("abinesh:abi"),
          },
        }
      );

      console.log("Data saved successfully:", response.data);
      setShowEditModal(false);
      setToastMessage("Invoice updated successfully.");
      setShowToast(true);
      fetchInvoices(selectedCustomer);
    } catch (error) {
      console.error("Error saving invoice:", error.message);
    }
  };

  const deleteInvoice = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(`/api/invoice/${invoiceId}`, getHeaders()); // Adjust the API endpoint
        setInvoices((prevInvoices) =>
          prevInvoices.filter((invoice) => invoice.id !== invoiceId)
        );
        setToastMessage("Invoice deleted successfully.");
        setShowToast(true);
      } catch (error) {
        console.error("Error deleting invoice:", error.message);
      }
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

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ViewInvoice" />
      <h1 className="text-3xl font-extralight">Invoice Section</h1>

      <div className="max-w-screen mx-auto p-6 space-y-6 text-neutral-700 dark:text-neutral-100">
        <h1 className="text-3xl font-normal mb-4">Invoice View</h1>
        <div className="flex space-x-4">
          <div className="flex flex-col w-2/3">
            <label htmlFor="customerName" className="text-sm font-medium">
              Select Customer
            </label>
            <select
              name="customerName"
              id="customerName"
              className="rounded-lg py-2 px-3 focus:border-blue-500 dark:border-neutral-500 dark:bg-slate-700"
              onChange={handleCustomerChange}
              value={selectedCustomer}
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer, index) => (
                <option key={index} value={customer.id}>
                  {customer.clientName} - {customer.cid}
                </option>
              ))}
            </select>
          </div>
        </div>
        {isLoading && <Loader />}
        {!isLoading && invoices.length === 0 && (
          <div className="flex flex-col items-center justify-center text-gray-900 text-xl mt-4">
            <img
              src="https://ik.imagekit.io/tealcdn2023/assets/No%20data-cuate.svg"
              className="w-100"
              alt="No data available"
            />
            <p>Oops! It seems there are no Quotes available.</p>
          </div>
        )}
        {!isLoading && Array.isArray(invoices) && invoices.length > 0 && (
          <>
            {uniqueCategories.map((category, index) => (
              <div
                key={index}
                className="overflow-y-auto overflow-x-auto rounded-xl"
              >
                <h2 className="text-2xl font-medium mt-6 mb-4">
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
                      <th scope="col" className="px-4 py-4">
                        Actions
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
                          <td className="py-2 px-3">{invoice.data.area}</td>
                          <td className="py-2 px-4">{invoice.data.quantity}</td>
                          <td className="py-2 px-4">{invoice.data.rate}</td>
                          <td className="py-2 px-4">{invoice.data.amount}</td>
                          <td className="py-2 px-4">
                            {invoice.data.gstPercentage}
                          </td>
                          <td className="py-2 px-4">
                            {invoice.data.gstAmount}
                          </td>
                          <td className="py-2 px-2">
                            ({invoice.data.discountPercentage}%)
                            {invoice.data.discountAmount}
                          </td>
                          <td className="py-2 px-4">{invoice.data.total}</td>
                          <td className="py-2 px-4">
                            <button onClick={() => editInvoice(invoice)}>
                              <img
                                src={edit}
                                className="hover:scale-125 transition-transform duration-300 ease-in-out cursor-pointer"
                                alt="Edit Button"
                              ></img>
                            </button>
                            <button onClick={() => deleteInvoice(invoice.id)}>
                              <img
                                src={trash}
                                className="hover:scale-125 transition-transform duration-300 ease-in-out cursor-pointer"
                                alt="Trash Icon"
                              />
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )}
        {showEditModal && (
          <EditInvoiceModal
            invoice={editedInvoice}
            saveEditedInvoice={saveEditedInvoice}
            closeModal={closeModal}
          />
        )}
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
            <p className="ml-2 text-slate-800 font-normal">{toastMessage}</p>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ViewInvoice;
