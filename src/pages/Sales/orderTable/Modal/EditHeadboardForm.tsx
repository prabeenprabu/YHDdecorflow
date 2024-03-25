
import React, { useState, useEffect } from "react";
import axios from "axios";

const EditHeadboardForm = ({
    onCloseModal,
    selectedProduct,
    onSave,
    editProduct,
}) => {
    const [formData, setFormData] = useState<any>({
        title: "",
        description: "",
        size: "",
        fabricName: "",
        fabricCode: "",
        remarks: "",
        image: null,
        fimg: null,
        limg: null,
        width: "",
        height: "",
        unit1: "in",
        unit2: "in",
    });

    useEffect(() => {
        if (selectedProduct) {
            const newFormData = {
                title: selectedProduct.data.title || "",
                description: selectedProduct.data.description || "",
                size: selectedProduct.data.size || "",
                fabricName: selectedProduct.data.fabricName || "",
                fabricCode: selectedProduct.data.fabricCode || "",
                remarks: selectedProduct.data.remarks || "",
                image: selectedProduct.data.image || null,
                fimg: selectedProduct.data.fimg || null,
                limg: selectedProduct.data.limg || null,
                width: selectedProduct.data.width || "",
                height: selectedProduct.data.height || "",
                unit1: selectedProduct.data.unit1 || "",
                unit2: selectedProduct.data.unit2 || "",
            };

            setFormData(newFormData);
        }
    }, [selectedProduct]);

    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>({
        image: null,
        fimg: null,
        limg: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
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
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: compressedImage,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            formData.size = `${formData.height}H x ${formData.width}W`;
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

            Object.keys(formData).forEach((key) => {
                if (key !== "image" && key !== "fimg" && key !== "limg") {
                    dataToSubmit.append(key, formData[key]);
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
                        Edit Headboard Order Form
                    </h3>
                    <hr></hr>
                    <div className="overflow-auto max-h-[30rem]">
                        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label
                                        htmlFor="title"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Enter title"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="description"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Write product description here"></textarea>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label
                                        htmlFor="sizeOfHeadboard"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Size of Headboard
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
                                        htmlFor="headboardFabricCode"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Fabric Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fabricName"
                                        name="fabricName"
                                        value={formData.fabricName}
                                        onChange={handleInputChange}
                                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Enter fabric code"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="headboardFabricCode"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Fabric Code
                                    </label>
                                    <input
                                        type="text"
                                        id="fabricCode"
                                        name="fabricCode"
                                        value={formData.fabricCode}
                                        onChange={handleInputChange}
                                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Enter fabric code"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="image"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Fabric Image
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
                                        htmlFor="fimg"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        References Image
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
                                <div className="col-span-2">
                                    <label
                                        htmlFor="limg"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Sight Image
                                    </label>
                                    <input
                                        type="file"
                                        id="limg"
                                        name="limg"
                                        accept="image/*"
                                        onChange={handleFileInputChange}
                                        className="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
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
                                        htmlFor="remarks"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Remarks
                                    </label>
                                    <textarea
                                        id="remarks"
                                        name="remarks"
                                        rows={4}
                                        value={formData.remarks}
                                        onChange={handleInputChange}
                                        className="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Add any additional remarks here"></textarea>
                                </div>
                            </div>
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditHeadboardForm;
