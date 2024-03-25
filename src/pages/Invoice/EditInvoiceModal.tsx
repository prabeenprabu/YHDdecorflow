import React, { useState } from "react";

const EditInvoiceModal = ({ invoice, saveEditedInvoice, closeModal }) => {
    const [editedData, setEditedData] = useState({ ...invoice });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            data: {
                ...prevData.data,
                [name]: value,
            },
        }));


        calculateAmountAndGst({
            ...editedData,
            data: { ...editedData.data, [name]: value },
        });
    };

    const calculateAmountAndGst = ({
        data: { quantity, rate, gstPercentage },
    }) => {
        if (!quantity || !rate || !gstPercentage) {
            console.error("Please fill in all required fields");
            return;
        }

        const parsedQuantity = parseFloat(quantity);
        const parsedRate = parseFloat(rate);
        const parsedGstPercentage = parseFloat(gstPercentage);

        if (
            isNaN(parsedQuantity) ||
            isNaN(parsedRate) ||
            isNaN(parsedGstPercentage)
        ) {
            console.error("Invalid input values");
            return;
        }

        const calculatedAmount = parsedQuantity * parsedRate;
        const calculatedGstAmount =
            (calculatedAmount * parsedGstPercentage) / 100;
        const calculatedTotal = calculatedAmount + calculatedGstAmount;


        setEditedData((prevData) => ({
            ...prevData,
            data: {
                ...prevData.data,
                amount: isNaN(calculatedAmount)
                    ? "0.00"
                    : calculatedAmount.toFixed(2),
                gstAmount: isNaN(calculatedGstAmount)
                    ? "0.00"
                    : calculatedGstAmount.toFixed(2),
                total: isNaN(calculatedTotal)
                    ? "0.00"
                    : calculatedTotal.toFixed(2),
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const editedDataWithId = {
            ...editedData,
            id: invoice.id,
        };

        saveEditedInvoice(editedDataWithId);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                &#8203;
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all lg:max-w-lg sm:my-8 sm:align-middle sm:max-w-full sm:w-full">
                    <button
                        className="absolute top-0 right-0 mt-4 mr-4 text-slate-600 hover:text-slate-800 focus:outline-none"
                        onClick={closeModal}>
                        <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label
                                        htmlFor="area"
                                        className="block text-sm font-medium text-slate-700">
                                        Particulars
                                    </label>
                                    <input
                                        type="text"
                                        name="area"
                                        id="area"
                                        value={editedData.data.area}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label
                                        htmlFor="quantity"
                                        className="block text-sm font-medium text-slate-700">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        onWheel={(e) => e.target.blur()}
                                        onKeyDown={(event) => {
                                            if (
                                                event.keyCode === 38 ||
                                                event.keyCode === 40
                                            ) {
                                                event.preventDefault();
                                            }
                                        }}
                                        name="quantity"
                                        id="quantity"
                                        value={editedData.data.quantity}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label
                                        htmlFor="rate"
                                        className="block text-sm font-medium text-slate-700">
                                        Rate
                                    </label>
                                    <input
                                        type="number"
                                        onWheel={(e) => e.target.blur()}
                                        onKeyDown={(event) => {
                                            if (
                                                event.keyCode === 38 ||
                                                event.keyCode === 40
                                            ) {
                                                event.preventDefault();
                                            }
                                        }}
                                        name="rate"
                                        id="rate"
                                        value={editedData.data.rate}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label
                                        htmlFor="gstPercentage"
                                        className="block text-sm font-medium text-slate-700">
                                        GST%
                                    </label>
                                    <select
                                        name="gstPercentage"
                                        id="gstPercentage"
                                        value={editedData.data.gstPercentage}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 w-full border rounded-md">
                                        <option value="">Select GST%</option>
                                        <option value="0">None</option>
                                        <option value="5">5%</option>
                                        <option value="12">12%</option>
                                        <option value="18">18%</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-3 py-3 sm:px-6 mx-4 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                className="w-full lg:mx-2 inline-flex my-2 justify-center rounded-md border border-transparent px-4 py-2 bg-red-700 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-800 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="w-full lg:mx-2 inline-flex my-2 justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-slate-700 shadow-sm hover:text-slate-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="discountPercentage"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Discount%
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    id="discountPercentage"
                    value={editedData.data.discountPercentage}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-3 py-3 sm:px-6 mx-4 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full lg:mx-2 inline-flex my-2 justify-center rounded-md border border-transparent px-4 py-2 bg-red-700 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-800 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Save
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="w-full lg:mx-2 inline-flex my-2 justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-slate-700 shadow-sm hover:text-slate-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Cancel
              </button>
            </div>
        </div>
    );
};

export default EditInvoiceModal;
