
import React, { useState, useEffect } from "react";
import axios from "axios";

interface EditSofaOrderFormProps {
    onCloseModal: () => void;
    selectedProduct: any;
}

const EditSofaOrderForm: React.FC<EditSofaOrderFormProps> = ({
    onCloseModal,
    selectedProduct,
}) => {
    const [formData, setFormData] = useState<any>({
        title: selectedProduct.data.title,
        description: selectedProduct.data.description,
        size: selectedProduct.data.size,
        depth: selectedProduct.data.depth || "",
        depthUnit: selectedProduct.data.depthUnit || "",
        floorToSeat: selectedProduct.data.floorToSeat || "",
        floorToSeatUnit: selectedProduct.data.floorToSeatUnit || "",
        seatToBackHeight: selectedProduct.data.seatToBackHeight || "",
        seatToBackHeightUnit: selectedProduct.data.seatToBackHeightUnit || "",
        shapeModel: selectedProduct.data.shapeModel || "",
        image: selectedProduct.data.image || null,
        fimg: selectedProduct.data.fimg || null,
        limg: selectedProduct.data.limg || null,
        fabricName: selectedProduct.data.fabricName || "", // Changed key name
        fabricCode: selectedProduct.data.fabricCode || "",
        sofaLeg: selectedProduct.data.sofaLeg || "",
        deliveryTime: selectedProduct.data.deliveryTime || "",
        remarks: selectedProduct.data.remarks || "",
        pillowSize: selectedProduct.data.pillowSize || "",
        pillowFabric: selectedProduct.data.pillowFabric || "",
        timeOfDeliveryValue: selectedProduct.data.timeOfDeliveryValue || "",
        timeOfDeliveryUnit: selectedProduct.data.timeOfDeliveryUnit || "",
    });

    const [loading, setLoading] = useState(false);
    const [includePillows, setIncludePillows] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>({
        image: null,
        fimg: null,
        limg: null,
    });
    const [fileNames, setFileNames] = useState<any>({
        image: "",
        fimg: "",
        limg: "",
    });
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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleNumberInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: { ...prevFormData[name], value: value },
        }));
    };

    const compressImage = (file: File) => {
        return new Promise<File>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d")!;
                    canvas.width = 700; // Adjust width as needed
                    canvas.height = 800; // Adjust height as needed
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
                        0.6
                    ); // Adjust quality as needed
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileInputChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files && e.target.files[0];
        const name = e.target.name;

        if (file) {
            const compressedImage = await compressImage(file);
            setSelectedImage((prevState) => ({
                ...prevState,
                [name]: URL.createObjectURL(file),
            }));
            setFileNames((prevFileNames) => ({
                ...prevFileNames,
                [name]: file.name,
            }));
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: compressedImage,
            }));
        }
    };

    // const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files && e.target.files[0];
    //     if (file) {
    //         setSelectedImage((prevState) => ({
    //             ...prevState,
    //             [name]: URL.createObjectURL(file),
    //         }));
    //         setFileNames((prevFileNames) => ({
    //             ...prevFileNames,
    //             [name]: file.name,
    //         }));
    //         setFormData((prevFormData) => ({
    //             ...prevFormData,
    //             [name]: file,
    //         }));
    //         const name = e.target.name;
    //         const fileType = file.type;
    //         let newName = "";
    //         if (fileType === "image/jpeg") {
    //             newName = `${name}.jpeg`;
    //         } else if (fileType === "image/jpg") {
    //             newName = `${name}.jpg`;
    //         } else {
    //             newName = file.name;
    //         }
    //         const renamedFile = new File([file], newName, { type: file.type });
    //         setFormData((prevFormData) => ({
    //             ...prevFormData,
    //             [name]: renamedFile,
    //         }));
    //     }
    // };

    const handleTimeOfDeliveryChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIncludePillows(e.target.checked); // Update state based on checkbox value
    };

    const submitFormData = async (formData: any) => {
        try {
            setLoading(true);
            formData.timeOfDelivery = `${formData.timeOfDeliveryValue} ${formData.timeOfDeliveryUnit}`;
            const dataToSubmit = new FormData();
            if (formData.image) {
                dataToSubmit.append("image", formData.image, "image1.jpg");
            }
            if (formData.fimg) {
                dataToSubmit.append("fimg", formData.fimg, "image2.jpg");
            }
            if (formData.limg) {
                dataToSubmit.append("limg", formData.limg, "image3.jpg");
            }
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== "image" && key !== "fimg" && key !== "limg") {
                    dataToSubmit.append(key, value);
                }
            });

            const response = await axios.put(
                `/api/products/${selectedProduct.id}`,
                dataToSubmit,
                getHeaders()
            );

            console.log("Form submitted successfully:", response.data);
            onCloseModal();
            //toast.success("Sofa Order has been updated successfully!");
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Sofa Data:", formData);
        await submitFormData(formData);
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
                        Edit Sofa Order Form
                    </h3>
                    <hr></hr>
                    <div className="overflow-auto max-h-[30rem]">
                        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                {/* Title */}
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
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Enter title"
                                    />
                                </div>
                                {/* Description */}
                                <div className="col-span-2">
                                    <label
                                        htmlFor="description"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-400 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Write product description here"></textarea>
                                </div>
                                <div className="col-span-2 text-black dark:text-white">
                                    <p>Dimensions</p>
                                    <hr></hr>
                                </div>
                                <div className="col-span-1">
                                    <label
                                        htmlFor="size"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                        Size
                                    </label>
                                    <input
                                        type="text"
                                        id="size"
                                        name="size"
                                        value={formData.size}
                                        onChange={handleInputChange}
                                        className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Enter size (inches)"
                                    />
                                </div>
                                {/* Depth */}
                                <div className="col-span-1">
                                    <label
                                        htmlFor="depth"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                        Depth
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            id="depth"
                                            name="depth"
                                            value={formData.depth}
                                            onChange={handleInputChange}
                                            className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-l-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Enter depth"
                                        />
                                        <select
                                            name="depthUnit"
                                            value={formData.depthUnit}
                                            onChange={handleInputChange}
                                            className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-r-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                            <option value="inches">
                                                inches
                                            </option>
                                            <option value="feet">feet</option>
                                            <option value="cm">cm</option>
                                            <option value="mm">mm</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Floor to Seat */}
                                <div className="col-span-1">
                                    <label
                                        htmlFor="floorToSeat"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                        Floor to Seat
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            id="floorToSeat"
                                            name="floorToSeat"
                                            value={formData.floorToSeat}
                                            onChange={handleInputChange}
                                            className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-l-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Enter floor to seat height"
                                        />
                                        <select
                                            name="floorToSeatUnit"
                                            value={formData.floorToSeatUnit}
                                            onChange={handleInputChange}
                                            className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-r-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                            <option value="inches">
                                                inches
                                            </option>
                                            <option value="feet">feet</option>
                                            <option value="cm">cm</option>
                                            <option value="mm">mm</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Seat to Back */}
                                <div className="col-span-1">
                                    <label
                                        htmlFor="seatToBackHeight"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                        Seat to Back
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            id="seatToBackHeight"
                                            name="seatToBackHeight"
                                            value={formData.seatToBackHeight}
                                            onChange={handleInputChange}
                                            className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-l-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Enter seat to back height"
                                        />
                                        <select
                                            name="seatToBackHeightUnit"
                                            value={
                                                formData.seatToBackHeightUnit
                                            }
                                            onChange={handleInputChange}
                                            className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-r-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                            <option value="inches">
                                                inches
                                            </option>
                                            <option value="feet">feet</option>
                                            <option value="cm">cm</option>
                                            <option value="mm">mm</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="shapeModel"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                        Shape and Model
                                    </label>
                                    <select
                                        id="shapeModel"
                                        name="shapeModel"
                                        value={formData.shapeModel}
                                        onChange={handleInputChange}
                                        className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                        <option value="Squared">Squared</option>
                                        <option value="Normal">Normal</option>
                                        <option value="L-Shaped">
                                            L-Shaped
                                        </option>
                                        <option value="Poufs">Poufs</option>
                                        <option value="Ottoman">Ottoman</option>
                                        <option value="Cot and Bed Side">
                                            Cot and Bed Side
                                        </option>
                                        <option value="Deewan cum Sofa">
                                            Deewan cum Sofa
                                        </option>
                                        <option value="Sofa cum Sofa">
                                            Sofa cum Bed
                                        </option>
                                        <option value="Corner Sofa">
                                            Corner Sofa
                                        </option>
                                        <option value="Seatout Cushion">
                                            Seatout Cushion
                                        </option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="image"
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
                                <div className="col-span-2 md:col-span-1">
                                    <label
                                        htmlFor="fabricName"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                        Fabric Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fabricName"
                                        name="fabricName"
                                        value={formData.fabricName}
                                        onChange={handleInputChange}
                                        className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Enter fabric name and code"
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label
                                        htmlFor="fabricCode"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                        Fabric Code
                                    </label>
                                    <input
                                        type="text"
                                        id="fabricCode"
                                        name="fabricCode"
                                        value={formData.fabricCode}
                                        onChange={handleInputChange}
                                        className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Enter fabric name and code"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="fimg"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                        Fabric Image
                                    </label>
                                    <input
                                        type="file"
                                        id="fimg"
                                        name="fimg"
                                        accept="image/*"
                                        onChange={handleFileInputChange}
                                        className="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                    {selectedImage.fimg && (
                                        <div className="mt-2">
                                            <img
                                                src={selectedImage.fimg}
                                                alt="Selected"
                                                className="w-full rounded-lg border border-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-2 relative">
                                    <label
                                        htmlFor="limg"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                        Sofa Leg Image
                                    </label>
                                    <input
                                        type="file"
                                        id="limg"
                                        name="limg"
                                        accept="image/*"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                    />
                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value={fileNames.limg}
                                            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-16 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Choose file"
                                        />
                                        <label
                                            htmlFor="limg"
                                            className="absolute top-0 right-0 bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white px-4 py-2.5 rounded-lg cursor-pointer text-sm">
                                            Choose File
                                        </label>
                                    </div>
                                    {selectedImage.limg && (
                                        <div className="mt-2">
                                            <img
                                                src={selectedImage.limg}
                                                alt="Selected"
                                                className="w-full rounded-lg border border-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="timeOfDelivery"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                        Time of Delivery
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            id="timeOfDelivery"
                                            name="timeOfDeliveryValue"
                                            value={formData.timeOfDeliveryValue}
                                            onChange={
                                                handleTimeOfDeliveryChange
                                            }
                                            className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-l-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Enter time of delivery"
                                        />
                                        <select
                                            value={formData.timeOfDeliveryUnit}
                                            name="timeOfDeliveryUnit"
                                            onChange={
                                                handleTimeOfDeliveryChange
                                            }
                                            className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-r-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                            <option value="days">days</option>
                                            <option value="weeks">weeks</option>
                                            <option value="months">
                                                months
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="remarks"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                        Remarks
                                    </label>
                                    <textarea
                                        id="remarks"
                                        name="remarks"
                                        rows={3}
                                        value={formData.remarks}
                                        onChange={handleInputChange}
                                        className="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-400 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Add any additional remarks here"></textarea>
                                </div>
                                <div className="col-span-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="includePillows"
                                            name="includePillows"
                                            checked={includePillows}
                                            onChange={handleCheckboxChange}
                                            className="text-primary-600 border-gray-300 focus:ring-primary-500 h-4 w-4 mr-2"
                                        />
                                        <label
                                            htmlFor="includePillows"
                                            className="block text-sm font-medium text-slate-900 dark:text-white">
                                            Include Pillows
                                        </label>
                                    </div>
                                </div>
                                {includePillows && (
                                    <div className="col-span-2">
                                        <label
                                            htmlFor="pillowSize"
                                            className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                            Pillow Size
                                        </label>
                                        <input
                                            type="text"
                                            id="pillowSize"
                                            name="pillowSize"
                                            value={formData.pillowSize}
                                            onChange={handleInputChange}
                                            className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Enter pillow size"
                                        />
                                    </div>
                                )}
                                {includePillows && (
                                    <div className="col-span-2">
                                        <label
                                            htmlFor="pillowFabric"
                                            className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                            Pillow Fabric
                                        </label>
                                        <input
                                            type="text"
                                            id="pillowFabric"
                                            name="pillowFabric"
                                            value={formData.pillowFabric}
                                            onChange={handleInputChange}
                                            className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Enter pillow fabric"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn bg-pink-800 px-2 p-1 text-white rounded-xl mx-1">
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={onCloseModal}
                                    className="btn bg-purple-800 px-2 p-1 text-white rounded-xl mx-1">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditSofaOrderForm;
