import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { convertUnit } from "../../../service/UnitConverstions";
interface CurtainsFormProps {
    onCloseModal: () => void;
    selectedCustomer: { id: string; clientName: string };
}

const CurtainsForm: React.FC<CurtainsFormProps> = ({
    onCloseModal,
    selectedCustomer,
}) => {
    const [formData, setFormData] = useState<any>({
        title: "",
        description: "",
        size: "",
        height: "",
        width: "",
        unit1: "in",
        unit2: "in",
        widthOfFabric: "",
        noOfPieces: "",
        noOfPanels: "",
        modelOfStitching: "",
        fabricName: "",
        fabricCode: "",
        hookType: "Track Hook",
        trackType: "",
        image: null,
        tieOption: "No Tie",
        remarks: "",

        motorType: "none",

        tenMtr: "",
        twenMtr: "",
    });
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>({
        image: null,
        fimg: null,
        limg: null,
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevFormData: any) => ({
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
                setSelectedImage((prevState: any) => ({
                    ...prevState,
                    [name]: URL.createObjectURL(file),
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);

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
            formDataToSend.append("customerId", selectedCustomer.id);
            formDataToSend.append("category", "Curtains");
            console.log(formDataToSend);
            const response = await axios.post(
                `/api/products/${selectedCustomer.id}/Curtains`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: "Basic " + btoa("abinesh:abi"),
                    },
                }
            );

            console.log("Form submitted successfully:", response.data);
            onCloseModal();
            toast.success("Curtains Order has been submitted successfully!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Curtains Order has been cancelled", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative  bg-gradient-to-tr from-[#DEE4EA] to-[#F9FCFF] dark:from-[#003049] from-50% dark:to-[#669bbc] rounded-lg shadow dark:bg-slate-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 mt-20">
                <h3 className="text-lg font-normal text-slate-800 dark:text-white">
                    Curtains Order Form
                </h3>
                <button
                    type="button"
                    onClick={onCloseModal}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
            <div className="overflow-auto max-h-[30rem]">
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
                        <div
                            className="col-span-2"
                            onClick={() => {
                                console.log("panel cal");
                                if (formData.height !== "") {
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

                                    let heightInch = convertUnit(
                                        formData.height,
                                        unit,
                                        "inches"
                                    );
                                    let heightTen = heightInch + 10;
                                    let heightTwen = heightInch + 20;
                                    let tenMtr = convertUnit(
                                        heightTen,
                                        "inches",
                                        "meter"
                                    );
                                    let twenMtr = convertUnit(
                                        heightTwen,
                                        "inches",
                                        "meter"
                                    );
                                    setFormData({
                                        ...formData,
                                        tenMtr: tenMtr.toFixed(3),
                                        twenMtr: twenMtr.toFixed(3),
                                    });
                                }
                            }}>
                            <label
                                htmlFor="noOfPanels"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Panel Calculations
                            </label>
                            <h1 className="">
                                Panel per Mtr(+10) :{" "}

                                <span className="text-red-900 font-bold">

                                    {formData.tenMtr}
                                </span>
                            </h1>
                            <h1 className="">
                                Panel per Mtr(+20) :{" "}

                                <span className="text-red-900 font-bold">

                                    {formData.twenMtr}
                                </span>
                            </h1>
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
                                <option value="roman blinds"></option>
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
                                htmlFor="motorType"
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
                                <option value="None">None</option>
                                <option value="Battery motor">
                                    Battery motor
                                </option>
                                <option value="Wired motor">Wired motor</option>
                                <option value="Tubular motor">
                                    Tubular motor
                                </option>
                            </select>
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
                                <option value="Battery motor">
                                    Battery motor
                                </option>
                                <option value="Wired motor">Wired motor</option>
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
                                <option value="Track Hook">Track Hook</option>
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
                                <option value="dolphinr track">
                                    dolphinr track
                                </option>
                                <option value="dooya track">dooya track</option>
                                <option value="tube track">tube track</option>
                                <option value="somfy track">somfy track</option>
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
                        className="text-white inline-flex items-center w-full  justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        disabled={loading}>
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A8 8 0 0112 20v4c-6.627 0-12-5.373-12-12h4zm14-2A8 8 0 0120 12H24c0 6.627-5.373 12-12 12v-4z"></path>
                                </svg>
                                <p>Please Wait...</p>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CurtainsForm;
