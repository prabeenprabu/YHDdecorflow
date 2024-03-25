
import React, { useState, useEffect } from "react";
import axios from "axios";
import { convertUnit } from "../../../../service/UnitConverstions";

const EditCurtainsForm = ({
    selectedProduct,
    onSave,
    onCloseModal,
    editProduct,
}) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        size: "",
        height: "", // Add height field corresponding to new order form data
        width: "", // Add width field corresponding to new order form data
        unit1: "in", // Add unit1 field corresponding to new order form data
        unit2: "in", // Add unit2 field corresponding to new order form data
        widthOfFabric: "",
        noOfPieces: "",
        noOfPanels: "",
        modelOfStitching: "",
        fabricName: "",
        fabricCode: "",
        hookType: "", // Add hookType field corresponding to new order form data
        trackType: "", // Add trackType field corresponding to new order form data
        image: null,
        tieOption: "",
        remarks: "",
        motorType: "Wired motor",
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
                height: selectedProduct.data.height || "", // Update height field assignment
                width: selectedProduct.data.width || "", // Update width field assignment
                unit1: selectedProduct.data.unit1 || "in", // Update unit1 field assignment
                unit2: selectedProduct.data.unit2 || "in", // Update unit2 field assignment
                widthOfFabric: selectedProduct.data.widthOfFabric || "",
                noOfPieces: selectedProduct.data.noOfPieces || "",
                noOfPanels: selectedProduct.data.noOfPanels || "",
                modelOfStitching: selectedProduct.data.modelOfStitching || "",
                fabricName: selectedProduct.data.fabricName || "",
                fabricCode: selectedProduct.data.fabricCode || "",
                hookType: selectedProduct.data.hookType || "", // Update hookType field assignment
                trackType: selectedProduct.data.trackType || "", // Update trackType field assignment
                remarks: selectedProduct.data.remarks || "",
                tieOption: selectedProduct.data.tieOption || "",
                motorType: selectedProduct.data.motorType || "",
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
        if (file) {
            try {
                setSelectedImage((prevState: any) => ({
                    ...prevState,
                    [e.target.name]: URL.createObjectURL(file),
                }));

                const compressedImage = await compressImage(file);
                setFormData((prevFormData: any) => ({
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
            const editedProduct = response.data;
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
                        Edit Curtains Order Form
                    </h3>
                    <hr></hr>
                    <form
                        className="p-4 md:p-5"
                        onSubmit={handleSubmit}
                        encType="multipart/form-data">
                        <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2">
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
                            <div className="col-span-2 md:col-span-2">
                                <label
                                    htmlFor="description"
                                    className="block mb-2 text-sm font-medium  text-gray-900 dark:text-white">
                                    Description
                                </label>
                                <textarea
                                    type={"text"}
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    rows={4}
                                    onChange={handleInputChange}
                                    className="block p-2.5 w-full text-sm col-span-2 text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Write product description here"></textarea>
                            </div>
                            <div className="col-span-2  wrap w-full space-y-2">
                                <label
                                    htmlFor="description"
                                    className="block mb-2 text-sm font-medium  text-gray-900 dark:text-white">
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

                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="widthOfFabric"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Width of Fabric
                                </label>
                                <input
                                    type="text"
                                    id="widthOfFabric"
                                    name="widthOfFabric"
                                    value={formData.widthOfFabric}
                                    onChange={(e) => handleInputChange(e)}
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter width of fabric"
                                    list="widthOfFabricOptions"
                                />
                                <datalist id="widthOfFabricOptions">
                                    <option value="48" />
                                    <option value="54" />
                                    <option value="118" />
                                    <option value="125" />
                                    <option value="128" />
                                    <option value="129" />
                                </datalist>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="noOfPieces"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Number of Pieces
                                </label>
                                <input
                                    type="text"
                                    id="noOfPieces"
                                    name="noOfPieces"
                                    value={formData.noOfPieces}
                                    onChange={(e) => handleInputChange(e)}
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter number of pieces"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="noOfPanels"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Number of Panels
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
                                    id="noOfPanels"
                                    name="noOfPanels"
                                    value={formData.noOfPanels}
                                    onClick={() => {
                                        if (formData.width !== "") {
                                            let unit = "";
                                            switch (formData.unit1) {
                                                case "mm":
                                                    unit = "mm";
                                                    break;
                                                case "in":
                                                    unit = "inches";
                                                    break;
                                                case "cm":
                                                    unit = "cm";
                                                    break;
                                                case "yd":
                                                    unit = "yard";
                                                    break;
                                                case "ft":
                                                    unit = "feet";
                                                    break;
                                                case "m":
                                                    unit = "meter";
                                                    break;
                                                case "sqm":
                                                    unit = "squareMeter";
                                                    break;
                                                case "syd":
                                                    unit = "squareYard";
                                                    break;
                                                default:
                                                    unit = "";
                                            }

                                            let widthInch = convertUnit(
                                                formData.width,
                                                unit,
                                                "inches"
                                            );
                                            let noPanels: number = Math.ceil(
                                                widthInch / 20
                                            );
                                            setFormData({
                                                ...formData,
                                                noOfPanels: noPanels,
                                            });
                                        }
                                    }}
                                    onChange={(e) => handleInputChange(e)}
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter number of panels"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="modelOfStitching"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Model of Stitching
                                </label>
                                <input
                                    type="text"
                                    id="modelOfStitching"
                                    name="modelOfStitching"
                                    value={formData.modelOfStitching}
                                    onChange={(e) => handleInputChange(e)}
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter width of fabric"
                                    list="stitching"
                                />
                                <datalist id="stitching">
                                    <option value="1 pleat"></option>
                                    <option value="2 pleat"></option>
                                    <option value="3 pleat"></option>
                                    <option value="ring model"></option>
                                    <option value="ripple fold"></option>
                                    <option value="tailored pleat"></option>
                                    <option value="inverted pleat"></option>
                                    <option value="goblet"></option>
                                    <option value="cubicle"></option>
                                    <option value="rod pocket"></option>
                                </datalist>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="hookType"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Motor Type
                                </label>
                                <select
                                    id="motorType"
                                    name="motorType"
                                    value={formData.motorType}
                                    onChange={(e) => handleInputChange(e)}
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                    {" "}
                                    <option value="None">
                                        None
                                    </option>
                                    <option value="Battery motor">
                                        Battery motor
                                    </option>
                                    <option value="Wired motor">
                                        Wired motor
                                    </option>
                                    <option value="Tubular motor">
                                        Tubular motor
                                    </option>
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="hookType"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Hook
                                </label>
                                <select
                                    id="hookType"
                                    name="hookType"
                                    value={formData.hookType}
                                    onChange={(e) => handleInputChange(e)}
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                    <option value="Track Hook">
                                        Track Hook
                                    </option>
                                    <option value="Rod Hook">Rod Hook</option>
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="trackType"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Track
                                </label>
                                <input
                                    className=" bg-sky-50 border border-slate-400 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    list="tracksLists"
                                    name="trackType"
                                    type="text"
                                    value={formData.trackType}
                                    onChange={(e) => handleInputChange(e)}
                                />
                                <datalist id="tracksLists">
                                    <option value="SS Rod">SS Rod</option>
                                    <option value="M Track">M Track</option>
                                    <option value="I Track">I Track</option>
                                    <option value="Hospital Track">
                                        Hospital Track
                                    </option>
                                    <option value="Silent Track">
                                        Silent Track
                                    </option>
                                </datalist>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2">
                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="fabricName"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Fabric Name
                                </label>
                                <input
                                    type="text"
                                    id="fabricName"
                                    name="fabricName"
                                    value={formData.fabricName}
                                    onChange={(e) => handleInputChange(e)}
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter fabric name"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="fabricCode"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Fabric Code
                                </label>
                                <input
                                    type="text"
                                    id="fabricCode"
                                    name="fabricCode"
                                    value={formData.fabricCode}
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter fabric code"
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="tieOption"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Tie Option
                                </label>
                                <select
                                    id="tieOption"
                                    name="tieOption"
                                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    onChange={(e: any) => handleInputChange(e)}
                                    value={formData.tieOption}>
                                    <option value="No Tie">No Tie</option>
                                    <option value="Attached">
                                        Attached in curtain
                                    </option>
                                    <option value="Separate">
                                        Separate with tie back holder
                                    </option>
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label
                                    htmlFor="remarks"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Remarks
                                </label>
                                <textarea
                                    id="remarks"
                                    name="remarks"
                                    rows={4}
                                    className="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Add any additional remarks here"
                                    value={formData.remarks}
                                    onChange={(e) =>
                                        handleInputChange(e)
                                    }></textarea>
                            </div>

                            <div className="col-span-2 ">
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

export default EditCurtainsForm;

