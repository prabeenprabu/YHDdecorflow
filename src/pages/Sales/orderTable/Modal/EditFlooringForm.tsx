
import React, { useState, useEffect } from "react";
import axios from "axios";

const EditFlooringOrderForm = ({
    selectedProduct,
    onSave,
    onCloseModal,
    products,
    editProduct,
}) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        size: "",
        numberOfSqft: "",
        unit: "Mtr",
        width: "",
        height: "",
        unit1: "in",
        unit2: "in",
        totOfSq: "",
        fabricName: "",
        fabricCode: "",
        image: null,
        remarks: "",
        id: "",
        widthOfFloor: "",
        typesOfFlooring: "",
        flooringThickness: "",
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
                widthOfFloor: selectedProduct.data.widthOfFloor || "",
                typesOfFlooring: selectedProduct.data.typesOfFlooring || "",
                flooringThickness: selectedProduct.data.flooringThickness || "",
                numberOfSqft: selectedProduct.data.numberOfSqft || "",
                remarks: selectedProduct.data.remarks || "",
                // Additional properties from the new state object initialized with default values
                unit: selectedProduct.data.unit || "",
                width: selectedProduct.data.width || "",
                height: selectedProduct.data.height || "",
                unit1: selectedProduct.data.unit1 || "",
                unit2: selectedProduct.data.unit2 || "",
                totOfSq: selectedProduct.data.totOfSq || "",
                fabricName: selectedProduct.data.fabricName || "",
                fabricCode: selectedProduct.data.fabricCode || "",
                image: selectedProduct.data.image || null,
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

    const handleFileInputChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files && e.target.files[0];
        const name = e.target.name;
        if (file) {
            try {
                const compressedImage = await compressImage(file);
                const renamedFile = new File([compressedImage], "image.jpg", {
                    type: "image/jpeg",
                });
                setSelectedImage((prevState: any) => ({
                    ...prevState,
                    [name]: URL.createObjectURL(file),
                }));
                console.log("Sending image with filename:", renamedFile.name);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    image: compressedImage,
                }));
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
                    canvas.width = 700;
                    canvas.height = 800;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error("Failed to compress image."));
                                return;
                            }
                            const compressedFile = new File([blob], file.name, {
                                type: "image/jpeg",
                            });
                            resolve(compressedFile);
                        },
                        "image/jpeg",
                        0.6
                    );
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            formData.size = `${formData.height}H x ${formData.width}W`;
            const formDataToSend = new FormData();
            // Set file name to "image.jpg"
            if (formData.image) {
                formDataToSend.append("image", formData.image, "image.jpg");
            }

            Object.keys(formData).forEach((key) => {
                if (key !== "image") {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Make the PUT request to update the product
            const response = await axios.put(
                `/api/products/${selectedProduct.id}`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: "Basic " + btoa("abinesh:abi"),
                    },
                }
            );

            // Update the product list in the state with the edited data
            const editedProduct = response.data; // Assuming the response contains the updated product data

            // Call the editProduct function from props with the updated products array
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
                        Edit Flooring Order Form
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
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-purple-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter title"
                                />
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="description"
                                    className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                    Description
                                </label>
                                <select
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={() => handleInputChange}
                                    required
                                    className="bg-purple-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                    <option value="">Select description</option>
                                    <option value="Vinyl Roll">
                                        Vinyl - Vinyl Roll
                                    </option>
                                    <option value="Vinyl Plank">
                                        Vinyl - Vinyl Plank
                                    </option>
                                    <option value="Wooden">Wooden</option>
                                    <option value="Carpet - Roll Carpet">
                                        Carpet - Roll Carpet
                                    </option>
                                    <option value="Carpet - Tile Carpet">
                                        Carpet - Tile Carpet
                                    </option>
                                </select>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label
                                    htmlFor="sizeOfFloor"
                                    className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                    Size of the Floor
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
                            {/* /*change code* */}
                            <div className="col-span-2">
                                <label
                                    htmlFor="numberOfSqft"
                                    className="block mb-2  text-sm font-medium text-slate-900 dark:text-white">
                                    Number of Sqft/meter
                                </label>
                                <div className="flex items-center" role="group">
                                    <input
                                        type="text"
                                        name="numberOfSqft"
                                        id="numberOfSqft"
                                        value={formData.numberOfSqft}
                                        onChange={handleInputChange}
                                        required
                                        className=" bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-l-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Enter number"
                                    />
                                    <select
                                        name="unit"
                                        id="unit"
                                        value={formData.unit}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                        }}
                                        className="bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-r-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 m-0">
                                        <option value="SqFt">SqFt</option>
                                        <option value="Mts">Mts</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="widthOfFloor"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Width of Floor
                                </label>
                                <input
                                    type="text"
                                    id="widthOfFloor"
                                    name="widthOfFloor"
                                    value={formData.widthOfFloor}
                                    onChange={(e) => handleInputChange(e)}
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter width of Floor"
                                    list="widthOfFloors"
                                />
                                <datalist id="widthOfFloors">
                                    <option value="6 feet" />
                                    <option value="6.5 feet" />
                                    <option value="13 feet" />
                                    <option value="5 feet" />
                                    <option value="12 feet" />
                                    <option value="4 feet" />
                                    <option value="3 feet" />
                                    <option value="2 feet" />
                                </datalist>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="flooringThickness"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Flooring Thickness
                                </label>
                                <input
                                    type="text"
                                    id="flooringThickness"
                                    name="flooringThickness"
                                    value={formData.flooringThickness}
                                    onChange={(e) => handleInputChange(e)}
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter flooring thickness"
                                    list="flooringThicknessOptions"
                                />
                                <datalist id="flooringThicknessOptions">
                                    <option value="0.45mm" />
                                    <option value="0.5mm" />
                                    <option value="0.6mm" />
                                    <option value="0.8mm" />
                                    <option value="1mm" />
                                    <option value="1.2mm" />
                                    <option value="1.3mm" />
                                    <option value="1.5mm" />
                                    <option value="2mm" />
                                    <option value="3mm" />
                                    <option value="4mm" />
                                    <option value="5mm" />
                                    <option value="6mm" />
                                    <option value="7mm" />
                                    <option value="8mm" />
                                    <option value="9mm" />
                                    <option value="10mm" />
                                    <option value="11mm" />
                                    <option value="12mm" />
                                    <option value="13mm" />
                                    <option value="14mm" />
                                    <option value="15mm" />
                                    <option value="16mm" />
                                    <option value="17mm" />
                                    <option value="18mm" />
                                </datalist>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="typesOfFlooring"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Type of Floorings
                                </label>
                                <input
                                    type="text"
                                    id="typesOfFlooring"
                                    name="typesOfFlooring"
                                    value={formData.typesOfFlooring}
                                    onChange={(e) => handleInputChange(e)}
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter Type of Floor"
                                    list="typesOfFloorings"
                                />
                                <datalist id="typesOfFloorings">
                                    <option value="Artificial grass" />
                                </datalist>
                            </div>

                            <div className="col-span-2">
                                <label
                                    htmlFor="catalogCodeAndNumber"
                                    className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                    Fabric Name
                                </label>
                                <input
                                    type="text"
                                    id="fabricName"
                                    name="fabricName"
                                    value={formData.fabricName}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-purple-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter catalog code and number"
                                />
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="catalogCodeAndNumber"
                                    className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                    Fabric code
                                </label>
                                <input
                                    type="text"
                                    id="fabricCode"
                                    name="fabricCode"
                                    value={formData.fabricCode}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-purple-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter catalog code and number"
                                />
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="image"
                                    className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                    Flooring Image
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleFileInputChange}
                                    accept="image/*"
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
                                    className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                    Remarks
                                </label>
                                <textarea
                                    id="remarks"
                                    name="remarks"
                                    rows={2}
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                    className="bg-purple-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
    );
};

export default EditFlooringOrderForm;
