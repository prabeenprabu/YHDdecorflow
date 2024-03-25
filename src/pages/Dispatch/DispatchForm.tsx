import React, { useState, useEffect } from "react";
import axios from "axios";

const DispatchForm = () => {
    const [formData, setFormData] = useState({
        customerName: "",
        areaOfRoom: "",
        catalogName: "",
        quantity: "",
        quantityOrdered: "",
        companyName: "",
        orderNum: "",
        docNumber: "",
        transitInformation: "",
    });

    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [referenceImage, setReferenceImage] = useState(null);

    useEffect(() => {
        let timer;
        if (showToast) {
            timer = setTimeout(() => {
                setShowToast(false);
            }, 3500);
        }
        return () => clearTimeout(timer);
    }, [showToast]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(
                "/api/customer/names",
                getHeaders()
            );
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error.message);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCustomerChange = (e) => {
        setSelectedCustomer(e.target.value);
    };

    const handleFileInputChange = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            try {
                const compressedImage = await compressImage(file);
                setReferenceImage(compressedImage);
            } catch (error) {
                console.error("Error compressing image:", error);
            }
        }
    };

    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = (90 / 100) * img.width;
                    canvas.height = (90 / 100) * img.height;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error("Failed to compress image."));
                                return;
                            }
                            const compressedFile = new File([blob], file.name, {
                                type: "image/jpeg", // Adjust mime type as needed
                            });
                            resolve(compressedFile);
                        },
                        "image/jpeg",
                        0.9
                    ); // Adjust quality as needed
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const selectedCustomerObject = customers.find(
                (customer) => customer.id === selectedCustomer
            );

            if (selectedCustomerObject) {
                const formDataToSend = new FormData();

                // Set reference image in FormData
                if (referenceImage) {
                    formDataToSend.append("image", referenceImage);
                }

                // Append other form data
                Object.keys(formData).forEach((key) => {
                    formDataToSend.append(key, formData[key]);
                });

                formDataToSend.append("customerId", selectedCustomer);
                formDataToSend.append(
                    "customerName",
                    selectedCustomerObject.clientName
                );


                const response = await axios.post(
                    `/api/dispatch/${selectedCustomer}`,
                    formDataToSend,
                    getHeaders()
                );

                console.log("Form submitted successfully:", response.data);
                setShowToast(true); // Show the toast
                clearForm(); // Clear the form fields and selected customer after submission
            } else {
                console.error("Selected customer not found");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const clearForm = () => {
        setFormData({
            customerName: "",
            areaOfRoom: "",
            catalogName: "",
            quantity: "",
            quantityOrdered: "",
            companyName: "",
            orderNum: "",
            docNumber: "",
            transitInformation: "",
        });
        //setSelectedCustomer("");
        setReferenceImage(null);
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 space-y-6 text-neutral-700 dark:text-neutral-100 dark:bg- dark:bg-slate-950 rounded-xl relative">
            <h1 className="text-3xl font-normal text-center uppercase mb-4">
                Dispatch Form
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label
                        htmlFor="customerName"
                        className="text-sm font-medium">
                        Customer Name
                    </label>
                    <select
                        name="customerName"
                        id="customerName"
                        className="rounded-md py-2 px-3 focus:border-red-500 dark:border-neutral-800 dark:bg-slate-900"
                        onChange={handleCustomerChange}
                        value={selectedCustomer}
                        required>
                        <option value="">Select Customer</option>
                        {customers.map((customer, index) => (
                            <option key={index} value={customer.id}>
                                {customer.clientName} - {customer.cid}
                            </option>
                        ))}
                    </select>
                </div>
                <hr></hr>
                <div className="sm:m-2 lg:m-8 p-6 rounded-xl text-blue-950 dark:text-white">
                    <div className="flex flex-col">
                        <label
                            htmlFor="areaOfRoom"
                            className="text-sm font-medium">
                            Area of Room
                        </label>
                        <input
                            type="text"
                            name="areaOfRoom"
                            id="areaOfRoom"
                            className="rounded-md py-2 px-3 focus:border-red-500 dark:border-neutral-500 dark:bg-slate-900"
                            onChange={handleInputChange}
                            value={formData.areaOfRoom}
                            required
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
                            value={formData.catalogName}
                            onChange={handleInputChange}
                            className="rounded-md py-2 px-3 focus:border-red-500 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                            required
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
                            value={formData.quantity}
                            onChange={handleInputChange}
                            className="rounded-md py-2 px-3 focus:border-red-500 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                            required
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
                            value={formData.quantityOrdered}
                            onChange={handleInputChange}
                            className="rounded-md py-2 px-3 focus:border-red-500 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                            required
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
                            value={formData.companyName}
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
                            value={formData.orderNum}
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
                            value={formData.docNumber}
                            onChange={handleInputChange}
                            className="rounded-md py-2 px-3 focus:border-red-500 bg-white dark:bg-slate-900 text-black-2 dark:text-white"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="transitInformation"
                            className="text-sm font-medium">
                            Transit Information:
                        </label>
                        <hr className="divide-red-50"></hr>
                        <div className="flex items-center">
                            <label htmlFor="received" className="mr-4">
                                Received
                                <input
                                    type="radio"
                                    id="received"
                                    name="transitInformation"
                                    value="Received"
                                    checked={
                                        formData.transitInformation ===
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
                                        formData.transitInformation ===
                                        "Not Received"
                                    }
                                    onChange={handleInputChange}
                                    className="ml-1"
                                />
                            </label>
                        </div>
                        {/* New field for reference image */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="referenceImage"
                                className="text-sm font-medium">
                                Reference Image
                            </label>
                            <input
                                type="file"
                                id="referenceImage"
                                name="referenceImage"
                                accept="image/*"
                                onChange={handleFileInputChange}
                                className="rounded-md py-2 px-3 focus:border-red-500 dark:border-neutral-500 dark:bg-slate-900"
                            />
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800">
                    Submit Dispatch
                </button>
            </form>
            {showToast && (
                <div
                    id="toast-success"
                    className="absolute top-2 right-2 flex items-center w-full max-w-xs p-2 mb-4 text-slate-500 bg-white rounded-lg shadow"
                    role="alert">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20">
                            <path
                                fill="#34D399"
                                d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm3.707 8.207l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414z"
                            />
                        </svg>
                    </div>
                    <div className="ms-2 text-sm text-slate-800 font-normal">
                        Dispatch added successfully.
                    </div>
                </div>
            )}

        </div>
    );
};

export default DispatchForm;
