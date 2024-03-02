import React, { useState, useEffect } from "react";
import axios from "axios";
import AddCustomer from "./AddCustomer";
import { Link } from "react-router-dom";

axios.defaults.baseURL = "https://cors-h05i.onrender.com";

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

function ViewCustomers({ filterValue }: any) {
    const [clients, setClients] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [showModal, setShowModal] = useState(false);
    const [editedClient, setEditedClient] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [formData, setFormData] = useState({
        cid: "",
        salutation: "",
        clientName: "",
        clientType: "",
        purpose: "",
        address: "",
        phone: "",
        emailAddress: "",
    });

    useEffect(() => {
        getClients();
    }, []);

    //for serach bar
    useEffect(() => {
        const searchRegex = new RegExp(`^${filterValue}`, "i"); // 'i' flag for case-insensitive

        const filtered = clients.filter(
            (client: any) =>
                searchRegex.test(client.clientName) ||
                searchRegex.test(client.emailAddress)
        );

        // Update filteredData state
        setFilteredData(filtered);
    }, [filterValue]);

    const getClients = () => {
        axios
            .get("/api/customer", getHeaders())
            .then((response) => {
                setClients(response.data);
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch((error) => {
                console.error("Error fetching clients:", error);
            });
    };

    const deleteClient = (clientId: number) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            axios
                .delete(`/api/customer/${clientId}`, getHeaders())
                .then(() => {
                    console.log("Client deleted");
                    setToastMessage("Client Deleted successfully.");
                    setShowToast(true);
                    getClients();
                })
                .catch((error) => {
                    console.error("Error deleting client:", error);
                });
        }
    };

    const editClient = (client: any) => {
        setEditedClient(client);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const saveEditedClient = (editedData: any) => {
        axios
            .put(`/api/customer/${editedData.id}`, editedData, getHeaders())
            .then((response) => {
                console.log("Edited client data:", editedData);
                setClients((prevClients: any) =>
                    prevClients.map((client: any) => {
                        if (client.id === editedData.id) {
                            return editedData;
                        }
                        return client;
                    })
                );
                setShowModal(false);
                setToastMessage("Client Edited successfully.");
                setShowToast(true);
            })
            .catch((error) => {
                console.error("Error saving edited client:", error);
            });
    };

    useEffect(() => {
        let timer: any;
        if (showToast) {
            timer = setTimeout(() => {
                setShowToast(false);
                setToastMessage("");
            }, 3500);
        }
        return () => clearTimeout(timer);
    }, [showToast]);

    return (
        <div className="max-w-screen overflow-x-auto">
            <div className="max-w-screen mx-auto overflow-x-hidden p-4">
                {loading ? ( // Show skeleton loading when data is loading
                    <SkeletonTable />
                ) : clients.length ? ( // Show table if data exists
                    <div className="overflow-y-auto overflow-x-auto max-h-screen rounded-xl">
                        <table className="w-full rounded-lg text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-gray-900 dark:bg-gray-800">
                            <thead className="text-sm text-blue-900 uppercase rounded-lg bg-blue-100 dark:bg-slate-900 dark:text-slate-300">
                                <tr>
                                    <th scope="col" className="px-3 py-4">
                                        ID
                                    </th>
                                    <th scope="col" className="px-3 py-4">
                                        Salutation
                                    </th>
                                    <th scope="col" className="px-4 py-4">
                                        Client Name
                                    </th>
                                    <th scope="col" className="px-4 py-4">
                                        Client Type
                                    </th>
                                    <th scope="col" className="px-4 py-4">
                                        Purpose
                                    </th>
                                    <th scope="col" className="px-4 py-4">
                                        Address
                                    </th>
                                    <th scope="col" className="px-4 py-4">
                                        Phone
                                    </th>
                                    <th scope="col" className="px-4 py-4">
                                        Email Address
                                    </th>
                                    <th scope="col" className="px-4 py-4">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterValue === ""
                                    ? clients.map((client: any) => (
                                          <tr
                                              key={client.id}
                                              className="bg-white border-b border-zinc-200 dark:bg-slate-800 dark:border-slate-700">
                                              <td className="py-2 text-gray-900 whitespace-nowrap text-center dark:text-white">
                                                  {client.cid}
                                              </td>
                                              <td className="py-2 text-gray-900 whitespace-nowrap text-center dark:text-white">
                                                  {client.salutation}
                                              </td>
                                              <td className="px-4 py-2">
                                                  {client.clientName}
                                              </td>
                                              <td className="px-4 py-2">
                                                  {client.clientType}
                                              </td>
                                              <td className="px-4 py-2">
                                                  {client.purpose}
                                              </td>
                                              <td className="px-4 py-2">
                                                  {client.address}
                                              </td>
                                              <td className="px-4 py-2">
                                                  {client.phone}
                                              </td>
                                              <td className="px-4 py-2">
                                                  {client.emailAddress}
                                              </td>
                                              <td className="px-4 py-2">
                                                  <button
                                                      onClick={() =>
                                                          editClient(client)
                                                      }
                                                      className="font-medium text-yTeal dark:text-blue-500 hover:underline">
                                                      Edit
                                                  </button>
                                                  <button
                                                      onClick={() =>
                                                          deleteClient(
                                                              client.id
                                                          )
                                                      }
                                                      className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                                      Delete
                                                  </button>
                                              </td>
                                          </tr>
                                      ))
                                    : filteredData.map((client: any) => (
                                          <tr
                                              key={client.id}
                                              className="bg-white border-b border-zinc-200 dark:bg-slate-800 dark:border-slate-700">
                                              <td className="py-2 text-gray-900 whitespace-nowrap text-center dark:text-white">
                                                  {client.cid}
                                              </td>
                                              <td className="py-2 text-gray-900 whitespace-nowrap text-center dark:text-white">
                                                  {client.salutation}
                                              </td>
                                              <td className="px-4 py-2">
                                                  {client.clientName}
                                              </td>
                                              <td className="px-4 py-2">
                                                  {client.clientType}
                                              </td>
                                              <td className="px-4 py-2">
                                                  {client.purpose}
                                              </td>
                                              <td className="px-4 py-2">
                                                  {client.address}
                                              </td>
                                              <td className="px-4 py-2">
                                                  {client.phone}
                                              </td>
                                              <td className="px-4 py-2">
                                                  {client.emailAddress}
                                              </td>
                                              <td className="px-4 py-2">
                                                  <button
                                                      onClick={() =>
                                                          editClient(client)
                                                      }
                                                      className="font-medium text-yTeal dark:text-blue-500 hover:underline">
                                                      Edit
                                                  </button>
                                                  <button
                                                      onClick={() =>
                                                          deleteClient(
                                                              client.id
                                                          )
                                                      }
                                                      className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                                      Delete
                                                  </button>
                                              </td>
                                          </tr>
                                      ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Show message if no data exists
                    <div className="text-center mt-8">
                        <p className="text-2xl text-center text-neutral-900 dark:text-gray-400 dark:text-slate-100">
                            <span className="py-10 my-100">
                                Oops! Data Not Found.
                            </span>
                            <img
                                src="https://ik.imagekit.io/tealcdn2023/assets/undraw_landscape_photographer_blv1.svg?updatedAt=1709287801082"
                                className="flex justify-center h-100 mx-auto"
                                alt="Illustration"
                            />
                            <span className="text-lime-700 dark:text-sky-300 text-md">
                                Go Ahead and Add Customer Details{" "}
                            </span>
                        </p>
                        <div className="mt-10">
                            <Link
                                className="mt-4 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600"
                                to="/customer/new">
                                Add Customer
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            {showModal && (
                <div className="absolute top-2 z-9999 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-slate-200 w-full lg:max-w-md  rounded-xl p- dark:bg-slate-900">
                        {/*<h2 className="text-3xl text-center my-1">Edit Client</h2>*/}
                        <EditClientModal
                            client={editedClient}
                            saveEditedClient={saveEditedClient}
                            closeModal={closeModal}
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>
                </div>
            )}
            {showToast && (
                <div
                    id="toast-success"
                    className="lg:top-32 lg:right-10 top-10  flex items-center w-full max-w-xs p-2 mb-4 text-gray-500 rounded-lg shadow
          fixed right-2 z-99999 translate-y-10 text-gray-500 bg-gradient-to-br from-green-100 via-green-200"
                    role="alert">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-700 bg-green-300 rounded-lg">
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 0a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8 14a2 2 0 1 1 4 0H8zm1-6a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0V8z"
                            />
                        </svg>
                    </div>
                    <p className="ml-2 text-slate-800 font-normal capitalize">
                        {toastMessage}
                    </p>
                </div>
            )}
        </div>
    );
}

function EditClientModal({
    client,
    saveEditedClient,
    closeModal,
    formData,
    setFormData,
}: any) {
    // State variables for edited client data
    const [editedSalutation, setEditedSalutation] = useState(
        client?.salutation || ""
    );
    const [editedClientName, setEditedClientName] = useState(
        client?.clientName || ""
    );
    const [editedClientType, setEditedClientType] = useState(
        client?.clientType || ""
    );
    const [editedPurpose, setEditedPurpose] = useState(client?.purpose || "");
    const [editedAddress, setEditedAddress] = useState(client?.address || "");
    const [editedPhone, setEditedPhone] = useState(client?.phone || "");
    const [editedEmailAddress, setEditedEmailAddress] = useState(
        client?.emailAddress || ""
    );

    // Function to handle saving the edited client data
    const handleSave = () => {
        if (
            editedSalutation &&
            editedClientName &&
            editedClientType &&
            editedPurpose &&
            editedAddress &&
            editedPhone &&
            editedEmailAddress
        ) {
            // Collect edited data
            const editedData = {
                id: client.id,
                cid: client.cid,
                salutation: editedSalutation,
                clientName: editedClientName,
                clientType: editedClientType,
                purpose: editedPurpose,
                address: editedAddress,
                phone: editedPhone,
                emailAddress: editedEmailAddress,
            };
            saveEditedClient(editedData);
        } else {
            alert("Please fill in all fields.");
        }
    };

    return (
        <div className="p-8 sm:px-4 bg-slate-200 dark:bg-slate-900 rounded-lg">
            <div className="overflow-auto sm:max-h-49 lg:min-h-125 ">
                <h2 className="text-3xl text-center my-1">Edit Client</h2>
                <div className="mb-2 sm:mb-4 dark:text-slate-50">
                    <label
                        htmlFor="salutation"
                        className="block text-sm font-medium text-slate-800 dark:text-slate-300">
                        Salutation
                    </label>
                    <select
                        id="clientType"
                        value={editedSalutation}
                        onChange={(e) => setEditedSalutation(e.target.value)}
                        className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-slate-950">
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                    </select>
                </div>
                <div className="mb-2 sm:mb-4">
                    <label
                        htmlFor="clientName"
                        className="block text-sm font-medium text-slate-800 dark:text-slate-50">
                        Client Name
                    </label>
                    <input
                        type="text"
                        id="clientName"
                        value={editedClientName}
                        onChange={(e) => setEditedClientName(e.target.value)}
                        className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-slate-950"
                    />
                </div>
                <div className="mb-2 sm:mb-4">
                    <label
                        htmlFor="clientType"
                        className="block text-sm font-medium text-slate-800 dark:text-slate-50">
                        Client Type
                    </label>
                    <select
                        id="clientType"
                        value={editedClientType}
                        onChange={(e) => setEditedClientType(e.target.value)}
                        className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-slate-950">
                        <option value="Architect">Architect</option>
                        <option value="Client">Client</option>
                        <option value="Interior Designer">
                            Interior Designer
                        </option>
                    </select>
                </div>
                <div className="mb-2 sm:mb-4">
                    <label
                        htmlFor="purpose"
                        className="block text-sm font-medium text-slate-800 dark:text-slate-100">
                        Purpose
                    </label>
                    <input
                        type="text"
                        id="purpose"
                        value={editedPurpose}
                        onChange={(e) => setEditedPurpose(e.target.value)}
                        className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-slate-950"
                    />
                </div>
                <div className="mb-2 sm:mb-4">
                    <label
                        htmlFor="address"
                        className="block text-sm font-medium text-slate-800 dark:text-slate-50">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        value={editedAddress}
                        onChange={(e) => setEditedAddress(e.target.value)}
                        className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-slate-950"
                    />
                </div>
                <div className="mb-2 sm:mb-4">
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-slate-800 dark:text-slate-50">
                        Phone
                    </label>
                    <input
                        type="text"
                        id="phone"
                        value={editedPhone}
                        onChange={(e) => setEditedPhone(e.target.value)}
                        className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-slate-950"
                    />
                </div>
                <div className="mb-2 sm:mb-4">
                    <label
                        htmlFor="emailAddress"
                        className="block text-sm font-medium text-slate-800 dark:text-slate-50">
                        Email Address
                    </label>
                    <input
                        type="text"
                        id="emailAddress"
                        value={editedEmailAddress}
                        onChange={(e) => setEditedEmailAddress(e.target.value)}
                        className="mt-1 py-2 px-3 sm:px-4 focus:ring-red-600 focus:border-red-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:text-slate-950"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="mr-2 px-3 py-1 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 sm:px-4 dark:text-slate-100">
                        Save
                    </button>
                    <button
                        onClick={closeModal}
                        className="px-3 py-1 bg-red-700 text-white rounded-2xl hover:bg-red-800 sm:px-4">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// SkeletonTable component to render skeleton loading effect
const SkeletonTable = () => {
    return (
        <div className="animate-pulse">
            <table className="border-separate border-spacing-2 w-full rounded-lg text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-gray-900 dark:bg-gray-800">
                <thead className="text-sm text-blue-900 uppercase rounded-lg bg-blue-100 dark:bg-slate-900 dark:text-slate-300">
                    <tr>
                        <th
                            scope="col"
                            className="px-3 py-4 bg-gray-400 dark:bg-slate-800"></th>
                        <th
                            scope="col"
                            className="px-3 py-4 bg-gray-300 dark:bg-slate-800"></th>
                        <th
                            scope="col"
                            className="px-4 py-4 bg-gray-300 dark:bg-slate-800"></th>
                        <th
                            scope="col"
                            className="px-4 py-4 bg-gray-300 dark:bg-slate-800"></th>
                        <th
                            scope="col"
                            className="px-4 py-4 bg-gray-300 dark:bg-slate-800"></th>
                        <th
                            scope="col"
                            className="px-4 py-4 bg-gray-300 dark:bg-slate-800"></th>
                        <th
                            scope="col"
                            className="px-4 py-4 bg-gray-300 dark:bg-slate-800"></th>
                        <th
                            scope="col"
                            className="px-4 py-4 bg-gray-400 dark:bg-slate-800"></th>
                        <th
                            scope="col"
                            className="px-4 py-4 bg-gray-400 dark:bg-slate-800"></th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(10)].map((_, index) => (
                        <tr
                            key={index}
                            className=" text-sm text-blue-900 uppercase rounded-lg bg-blue-100 dark:bg-slate-900 dark:text-slate-300 my-2">
                            <td className="py-2 bg-gray-300 dark:bg-slate-800"></td>
                            <td className="py-2 bg-gray-300 dark:bg-slate-800"></td>
                            <td className="px-4 py-2 bg-gray-300 dark:bg-slate-800"></td>
                            <td className="px-4 py-2 bg-gray-300 dark:bg-slate-800"></td>
                            <td className="px-4 py-2 bg-gray-300 dark:bg-slate-800"></td>
                            <td className="px-4 py-2 bg-gray-300 dark:bg-slate-800"></td>
                            <td className="px-4 py-2 bg-gray-300 dark:bg-slate-800"></td>
                            <td className="px-4 py-2 bg-gray-300 dark:bg-slate-800"></td>
                            <td className="px-4 py-2 bg-gray-300 dark:bg-slate-800"></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewCustomers;
