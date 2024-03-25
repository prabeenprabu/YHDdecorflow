import React, { useState, useEffect } from "react";

const EditDispatchModal = ({ formData, saveEditedData, closeModal }) => {
    const [editedData, setEditedData] = useState(formData || {});

    useEffect(() => {
        setEditedData(formData || {});
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            data: {
                ...prevData.data,
                [name]: value,
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveEditedData(editedData);
    };


    return (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black bg-opacity-75">
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Edit Dispatch</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="areaOfRoom"
                            className="block text-sm font-medium mb-1">
                            Area of Room:
                        </label>
                        <input
                            type="text"
                            id="areaOfRoom"
                            name="areaOfRoom"
                            value={editedData.data.areaOfRoom}
                            onChange={handleInputChange}
                            className="rounded-lg border-gray-300 px-4 py-2 w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="catalogName"
                            className="text-sm font-medium">
                            Catalog Name:
                        </label>
                        <input
                            type="text"
                            id="catalogName"
                            name="catalogName"
                            value={editedData.data.catalogName}
                            onChange={handleInputChange}
                            className="rounded-md py-2 px-3 focus:border-red-500 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="quantity"
                            className="text-sm font-medium">
                            Fabric Code Number:
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
                            id="quantity"
                            name="quantity"
                            value={editedData.data.quantity}
                            onChange={handleInputChange}
                            className="rounded-md py-2 px-3 focus:border-red-500 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="quantityOrdered"
                            className="text-sm font-medium">
                            Quantity Ordered:
                        </label>
                        <input
                            type="text"
                            id="quantityOrdered"
                            name="quantityOrdered"
                            value={editedData.data.quantityOrdered}
                            onChange={handleInputChange}
                            className="rounded-md py-2 px-3 focus:border-red-500 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="companyName"
                            className="text-sm font-medium">
                            Company Name:
                        </label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={editedData.data.companyName}
                            onChange={handleInputChange}
                            className="rounded-md py-2 px-3 focus:border-red-500 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="orderNum"
                            className="text-sm font-medium">
                            Order Number:
                        </label>
                        <input
                            type="text"
                            id="orderNum"
                            name="orderNum"
                            value={editedData.data.orderNum}
                            onChange={handleInputChange}
                            className="rounded-md py-2 px-3 focus:border-red-500 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="docNumber"
                            className="text-sm font-medium">
                            Doc Number:
                        </label>
                        <input
                            type="text"
                            id="docNumber"
                            name="docNumber"
                            value={editedData.data.docNumber}
                            onChange={handleInputChange}
                            className="rounded-md py-2 px-3 focus:border-red-500 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="received" className="mr-4">
                            Received
                            <input
                                type="radio"
                                id="received"
                                name="transitInformation"
                                value="Received"
                                checked={
                                    editedData.data.transitInformation ===
                                    "Received"
                                }
                                onChange={handleInputChange}
                                className="ml-1"
                            />
                        </label>
                        <label htmlFor="notReceived">
                            Not Received
                            <input
                                type="radio"
                                id="notReceived"
                                name="transitInformation"
                                value="Not Received"
                                checked={
                                    editedData.data.transitInformation ===
                                    "Not Received"
                                }
                                onChange={handleInputChange}
                                className="ml-1"
                            />
                        </label>
                    </div>
                    {/* Add similar input fields for other dispatch data */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-600 px-4 py-2 mr-2">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDispatchModal;
