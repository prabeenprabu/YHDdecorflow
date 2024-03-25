
import React, { useState, useEffect } from "react";
import axios from "axios";

const EditSofaOrderForm = ({
    onCloseModal,
    selectedProduct,
    onSave,
    editProduct,
}) => {
    const [formData, setFormData] = useState<any>({
        title: "",
        description: "",
        size: "",
        qty: "",
        referenceCode: "",
        image: null,
        remarks: "",
        width: "",
        height: "",
        unit1: "in",
        unit2: "in",
    });
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>({
        image: null,
        fimg: null,
        limg: null,
    });

    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                title: selectedProduct.data.title || "",
                description: selectedProduct.data.description || "",
                size: selectedProduct.data.size || "",
                qty: selectedProduct.data.qty || "",
                referenceCode: selectedProduct.data.referenceCode || "",
                image: selectedProduct.data.image || null,
                remarks: selectedProduct.data.remarks || "",
                width: selectedProduct.data.width || "",
                height: selectedProduct.data.height || "",
                unit1: selectedProduct.data.unit1 || "",
                unit2: selectedProduct.data.unit2 || "",
            });
        }
    }, [selectedProduct]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files && e.target.files[0];
        const name = e.target.name;
        if (file) {
            setSelectedImage((prevState: any) => ({
                ...prevState,
                [name]: URL.createObjectURL(file),
            }));
            try {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [e.target.name]: file,
                }));
            } catch (err) {
                console.error("fileerror", err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            formData.size = `${formData.height}H x ${formData.width}W`;
            const dataToSubmit = new FormData();
            if (formData.image) {
                dataToSubmit.append("image", formData.image, "image.jpg");
            }
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== "image") {
                    dataToSubmit.append(key, value);
                }
            });

            const response = await axios.put(
                `/api/products/${selectedProduct.id}`,
                dataToSubmit,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: "Basic " + btoa("abinesh:abi"),
                    },
                }
            );

            const editedProduct = response.data; // Assuming the response contains the updated product data

            editProduct((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === editedProduct.id
                        ? { ...product, data: editedProduct.data }
                        : product
                )
            );

            onSave(formData);
            onCloseModal();
        } catch (error) {
            console.error("Error saving edited order:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 mt-10 bg-black bg-opacity-50">
            <div className="relative bg-purple-100 rounded-lg shadow dark:bg-slate-700 w-full max-w-sm p-4 overflow-auto max-h-[80vh]">
                <div className="absolute top-0 right-0 p-2">
                    <button
                        onClick={onCloseModal}
                        className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-slate-600 dark:hover:text-white"
                        data-modal-toggle="crud-modal">
                        <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14">
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="overflow-auto">
                    <h3 className="text-xl font-normal text-slate-800 dark:text-white mb-4">
                        Edit Furniture Order Form
                    </h3>
                    <hr></hr>
                    <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                        <div className="grid gap-4 mb-4 grid-cols-2">
                            <div className="col-span-2">
                                <label
                                    htmlFor="title"
                                    className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="bg-purple-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="description"
                                    className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={2}
                                    className="block p-2.5 w-full text-sm text-slate-900 bg-purple-50 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Write product description here"
                                    value={formData.description}
                                    onChange={handleInputChange}></textarea>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label
                                    htmlFor="size"
                                    className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                    Size
                                </label>
                                <div className="inputGrp w-full flex">
                                    <input
                                        className=" bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-l-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                                        id="height"
                                        name="height"
                                        onChange={(e) => {
                                            handleInputChange(e);
                                        }}
                                        value={formData.height}
                                        placeholder="Height"
                                    />
                                    <select
                                        className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-r-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 m-0"
                                        id="unit1"
                                        name="unit1"
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            // Set the value of the other dropdown to match the selected value
                                            setFormData({
                                                ...formData,
                                                unit2: e.target.value,
                                                unit1: e.target.value,
                                            });
                                        }}
                                        value={formData.unit1}>
                                        <option value="mm">mm</option>
                                        <option value="in">Inch</option>
                                        <option value="cm">cm</option>
                                        <option value="yd">yd</option>
                                        <option value="ft">ft</option>
                                        <option value="m">m</option>
                                    </select>
                                </div>
                                <div className="inputGrp w-full flex items-center">
                                    <input
                                        className=" bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-l-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                                        id="width"
                                        name="width"
                                        onChange={(e) => {
                                            handleInputChange(e);
                                        }}
                                        value={formData.width}
                                        placeholder="width"
                                    />
                                    <select
                                        className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-r-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 m-0"
                                        id="unit2"
                                        name="unit2"
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            // Set the value of the other dropdown to match the selected value
                                            setFormData({
                                                ...formData,
                                                unit1: e.target.value,
                                                unit2: e.target.value,
                                            });
                                        }}
                                        value={formData.unit2}>
                                        <option value="mm">mm</option>
                                        <option value="in">Inch</option>
                                        <option value="cm">cm</option>
                                        <option value="yd">yd</option>
                                        <option value="ft">ft</option>
                                        <option value="m">m</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="qty"
                                    className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                    Quantity
                                </label>
                                <input
                                    type="text"
                                    id="qty"
                                    name="qty"
                                    className="bg-purple-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter quantity"
                                    value={formData.qty}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="referenceCode"
                                    className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                    Reference Code
                                </label>
                                <input
                                    type="text"
                                    id="referenceCode"
                                    name="referenceCode"
                                    value={formData.referenceCode}
                                    className="bg-purple-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter reference code"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="referenceImage"
                                    className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                    Reference Image
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileInputChange}
                                    className="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                {selectedImage.image && (
                                    <div className="mt-2">
                                        <img
                                            src={selectedImage.image}
                                            alt="Selected"
                                            className="w-full rounded-lg border border-gray-300"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="remarks"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Remarks
                                </label>
                                <textarea
                                    id="remarks"
                                    name="remarks"
                                    rows={2}
                                    className="block p-2.5 w-full text-sm text-slate-900 bg-purple-50 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Add any additional remarks here"
                                    onChange={handleInputChange}
                                    value={formData.remarks}></textarea>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="text-white w-full justify-center inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg
                                className="me-1 -ms-1 w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fillRule="evenodd"
                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                    clipRule="evenodd"></path>
                            </svg>
                            Add new product
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditSofaOrderForm;
