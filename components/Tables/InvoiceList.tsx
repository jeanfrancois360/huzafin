/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from 'react'
import axios from '../../axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { MdContentCopy } from "react-icons/md";
import { LuEye } from "react-icons/lu";
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from 'next/navigation'

const InvoiceList = ({ transactions }: any) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const notify = (msg_type: string) => {
        if (msg_type === 'success')
            toast.success(successMsg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light'
            });
        if (msg_type === 'error')
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light'
            });
    }


    useEffect(() => {
        if (successMsg) {
            notify('success')
        }
    }, [successMsg])

    useEffect(() => {
        if (errorMsg) {
            notify('error')
        }
    }, [errorMsg])

    const handleDelete = (id: any) => {
        if (isLoading) {
            return
        }

        setIsLoading(true);
        setErrorMsg("")
        axios.delete(`/api/invoices/${id}`,).then((response) => {
            setIsLoading(false)
            if (response.data.status == true) {
                setSuccessMsg("Successfully deleted!");
            }
            window != undefined && window.location.reload()
        }).catch((error) => {
            setErrorMsg("Error while deleting transaction")
            console.error('Error while deleting transaction', error);
        })
    }
    const handleDownload = (file_path: string) => {
        window != undefined && window.open(file_path, "_blank");
    }
    const handleCopy = (transaction: any) => {
        router.push(
            `/invoice/copy-invoice?transaction=${encodeURIComponent(JSON.stringify(transaction))}`
        );
    }

    const handleRefund = (transaction: any) => {
        router.push(
            `/invoice/refund-invoice?transaction=${encodeURIComponent(JSON.stringify(transaction))}`
        );
    };

    const formatInvoiceTitle = (sender: any, recipient: any, date: string | number | Date) => {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return `Invoice from ${sender} to ${recipient} - ${formattedDate}`;
    }
    return (
        <>
            <ToastContainer />
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="text-left bg-gray-2 dark:bg-meta-4">
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Invoice Number
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Invoice Title
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Invoice Total
                                </th>
                                <th className="px-4 py-4 font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            {transactions && transactions.length > 0 && transactions.map((transaction: any, key: number) => (
                                <tr key={key}>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                        <p className="font-medium text-black dark:text-white">
                                            {transaction.id}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {formatInvoiceTitle(transaction.sender, transaction.recipient, transaction.date)}
                                        </h5>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {transaction.total + " RWF"}
                                        </p>
                                    </td>

                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <button className="hover:text-primary" onClick={() => handleRefund(transaction)}>
                                                <HiOutlineReceiptRefund />
                                            </button>
                                            <button className="hover:text-primary" onClick={() => handleCopy(transaction)}>
                                                <MdContentCopy />
                                            </button>

                                            {/* <button className="hover:text-primary" onClick={() => handleDownload(transaction.file_path)}>
                                                <LuEye />
                                            </button> */}
                                            <button className="hover:text-primary" onClick={() => handleDelete(transaction.id)}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {transactions && transactions.length <= 0 && (<div className='w-full py-3 text-center'><b>No Data Found</b></div>)}
                </div>
            </div>
        </>
    );
};
export default InvoiceList