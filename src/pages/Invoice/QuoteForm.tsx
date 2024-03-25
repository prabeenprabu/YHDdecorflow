import React, { useState, useEffect } from "react";
import axios from "axios";

const QuoteForm = ({ selectedCustomer, selectedCategory }) => {

  const [formData, setFormData] = useState({
    area: "",
    quantity: "",
    rate: "",
    gstPercentage: "",
    discountPercentage: 0,
    amount: 0,
    gstAmount: 0,
    discountAmount: 0,
    total: 0,
  });

    const [customers, setCustomers] = useState([]);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        let timer;
        if (showToast) {
            timer = setTimeout(() => {
                setShowToast(false);
            }, 3500);
        }
        return () => clearTimeout(timer);
    }, [showToast]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        calculateAmountAndGst({ ...formData, [name]: value });
    };


  const calculateAmountAndGst = ({ quantity, rate, gstPercentage }) => {
    // Check if all required fields are filled
    if (!quantity || !rate || !gstPercentage || !discountPercentage) {
      return;
    }
    const parsedQuantity = parseFloat(quantity);
    const parsedRate = parseFloat(rate);
    const parsedGstPercentage = parseFloat(gstPercentage);
    const parsedDiscountPercentage = parseFloat(formData.discountPercentage);

    if (
      isNaN(parsedQuantity) ||
      isNaN(parsedRate) ||
      isNaN(parsedGstPercentage) ||
      isNaN(parsedDiscountPercentage)
    ) {
      console.error("Invalid input values");
      return;
    }

    const calculatedAmount = parsedQuantity * parsedRate;
    const calculatedGstAmount = (calculatedAmount * parsedGstPercentage) / 100;
    const calculatedDiscountAmount =
      (calculatedAmount + calculatedGstAmount) *
      (parsedDiscountPercentage / 100);
    const calculatedTotal =
      calculatedAmount + calculatedGstAmount - calculatedDiscountAmount;

    setFormData((prevFormData) => ({
      ...prevFormData,
      amount: isNaN(calculatedAmount) ? "0.00" : calculatedAmount.toFixed(2),
      gstAmount: isNaN(calculatedGstAmount)
        ? "0.00"
        : calculatedGstAmount.toFixed(2),
      discountAmount: isNaN(calculatedDiscountAmount)
        ? "0.00"
        : calculatedDiscountAmount.toFixed(2),
      total: isNaN(calculatedTotal) ? "0.00" : calculatedTotal.toFixed(2),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCustomer) {
        // Destructure form data
        const {
          area,
          quantity,
          rate,
          gstPercentage,
          amount,
          gstAmount,
          discountPercentage,
          discountAmount,
          total,
        } = formData;

        // Construct the URL with parameters
        const url = `/api/invoice/${selectedCustomer.id}/${selectedCategory}?area=${area}&quantity=${quantity}&rate=${rate}&gstPercentage=${gstPercentage}&amount=${amount}&gstAmount=${gstAmount}&discountPercentage=${discountPercentage}&discountAmount=${discountAmount}&total=${total}`;
        const response = await axios.post(url, {}, getHeaders());

        console.log("Form submitted successfully:", response.data);
        setShowToast(true); // Show toast on successful submission
        clearForm();
      } else {
        console.error("No customer selected");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const clearForm = () => {
    setFormData({
      area: "",
      quantity: "",
      rate: "",
      gstPercentage: "",
      discountPercentage: 0,
      amount: 0,
      gstAmount: 0,
      discountAmount: 0,
      total: 0,
    });
    // setSelectedCustomer(null);
  };

  return (
    <div className="relative">
      <div>
        {!selectedCustomer && (
          <select
            value={selectedCustomer ? selectedCustomer.id : ""}
            onChange={(e) =>
              setSelectedCustomer(
                customers.find((customer) => customer.id === e.target.value)
              )
            }
            className="block w-full mt-4 p-3 border border-slate-400 shadow-lg rounded-xl dark:bg-slate-950 focus:outline-none focus:border-strokedark"
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.clientName} - {customer.cid}
              </option>
            ))}
          </select>
        )}
        {selectedCustomer && (
          <>
            <p className="text-slate-700 dark:text-slate-50 text-lg font-thin text-start">
              Quote Entry for {selectedCustomer.clientName}
            </p>
            <div className="max-w-lg mx-auto mt-10 p-6 space-y-6 text-neutral-700 dark:text-neutral-100 dark:bg- dark:bg-slate-950 rounded-xl relative">
              <h1 className="text-3xl font-normal text-center uppercase mb-4">
                {selectedCategory} Quote Form
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="area" className="text-sm font-medium">
                    Particulars
                  </label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="rounded-md py-2 px-3 focus:border-red-500 dark:border-neutral-800 dark:bg-slate-900"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="rounded-md py-2 px-3 focus:border-red-500 dark:border-neutral-800 dark:bg-slate-900"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="rate" className="text-sm font-medium">
                    Rate
                  </label>
                  <input
                    type="number"
                    id="rate"
                    name="rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    className="rounded-md py-2 px-3 focus:border-red-500 dark:border-neutral-800 dark:bg-slate-900"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="gstPercentage"
                    className="text-sm font-medium"
                  >
                    GST%
                  </label>
                  <select
                    id="gstPercentage"
                    name="gstPercentage"
                    value={formData.gstPercentage}
                    onChange={handleInputChange}
                    className="rounded-md py-2 px-3 focus:border-red-500 dark:border-neutral-800 dark:bg-slate-900"
                    required
                  >
                    <option value="">Select GST%</option>
                    <option value="0">None</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                  </select>
                </div>
                {/* Discount Percentage input */}
                <div className="flex flex-col">
                  <label
                    htmlFor="discountPercentage"
                    className="text-sm font-medium"
                  >
                    Discount %
                  </label>
                  <input
                    type="number"
                    id="discountPercentage"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    className="rounded-md py-2 px-3 focus:border-red-500 dark:border-neutral-800 dark:bg-slate-900"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount
                  </label>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    readOnly
                    className="rounded-md py-2 px-3 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="gstAmount" className="text-sm font-medium">
                    GST Amount
                  </label>
                  <input
                    type="text"
                    id="gstAmount"
                    name="gstAmount"
                    value={formData.gstAmount}
                    readOnly
                    className="rounded-md py-2 px-3 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="discountAmount"
                    className="text-sm font-medium"
                  >
                    Discount Amount
                  </label>
                  <input
                    type="text"
                    id="discountAmount"
                    name="discountAmount"
                    value={formData.discountAmount}
                    readOnly
                    className="rounded-md py-2 px-3 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="total" className="text-sm font-medium">
                    Total
                  </label>
                  <input
                    type="text"
                    id="total"
                    name="total"
                    value={formData.total}
                    readOnly
                    className="rounded-md py-2 px-3 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800"
                >
                  Submit
                </button>
              </form>
            </div>
          </>
        )}
        {showToast && (
          <div
            id="toast-success"
            className="absolute top-2 right-2 flex items-center w-full max-w-xs p-2 mb-4 text-slate-500 bg-white rounded-lg shadow"
            role="alert"
          >
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  fill="#34D399"
                  d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm3.707 8.207l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414z"
                />
              </svg>
            </div>
            <div className="ms-2 text-sm text-slate-800 font-normal">
              {selectedCategory} Quote has been Submitted.
            </div>
        </div>
    );
};

export default QuoteForm;
