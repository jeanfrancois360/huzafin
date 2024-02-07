'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CheckboxFive from "@/components/Checkboxes/CheckboxFive";
import CheckboxFour from "@/components/Checkboxes/CheckboxFour";
import CheckboxOne from "@/components/Checkboxes/CheckboxOne";
import CheckboxThree from "@/components/Checkboxes/CheckboxThree";
import CheckboxTwo from "@/components/Checkboxes/CheckboxTwo";
import SwitcherFour from "@/components/Switchers/SwitcherFour";
import SwitcherOne from "@/components/Switchers/SwitcherOne";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import SwitcherTwo from "@/components/Switchers/SwitcherTwo";
import { FieldArray, Formik } from 'formik'
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { MsgText } from '@/components/MsgText/MsgText';
import axios from 'axios';



const Apps = () => {
    let initialValues = {
        invoice_number: '',
        sender: '',
        recipient: '',
        date: '',
        due_date: '',
        notes: '',
        terms: '',
        subtotal: 0,
        total: 0,
        tax: 18,
        discount: 0,
        amount_paid: 0,
        balance_due: 0,
        items: [{
            name: "",
            quantity: 0,
            uom: "",
            rate: 0,
            amount: 0
        }]
    }
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedFile, setSelectedFile] = useState("");

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


    const FormValidationSchema = Yup.object().shape({
        invoice_number: Yup.string().trim().required().label("Invoice Number"),
        sender: Yup.string().trim().required().label("Sender"),
        recipient: Yup.string().trim().required().label("Recipient"),
        date: Yup.date().required('Date is required').nullable(),
        due_date: Yup.date()
            .required('Due date is required')
            .nullable()
            .when(
                'date',
                (date, schema) => date && schema.min(date, 'Due date must be greater than or equal to Date')
            ),
    })

    const handleFileChange = (e: any) => {
        setSelectedFile(e.target.files)
    }

    const handleInvoice = (payload: any) => {
        try {
            const formData: FormData = new FormData();
            for (const key in payload) {
                if (key === "items") {
                    // Special handling for the 'items' array
                    payload[key].forEach((item: any, index: number) => {
                        for (const itemKey in item) {
                            formData.append(`${key}[${index}][${itemKey}]`, item[itemKey]);
                        }
                    });
                } else {
                    formData.append(key, payload[key]);
                }
            }
            formData.append("logo", selectedFile[0]);
            axios.post('https://backend.huzaccounts.com/api/invoices', formData).then((response) => {
                console.log({ response })
                setSuccessMsg(response.data.data.message)
                window != undefined && window.open("https://backend.huzaccounts.com" + response.data.data.file_path, "_blank");
            }).catch((error) => {
                setErrorMsg(error.response.data.message)
                console.error('Error generating PDF:', error);
            })
        } catch (error) {
            console.error("Something went wrong");
        }
    }
    return (
        <>
            <ToastContainer />
            <Breadcrumb pageName="Invoice" />
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    {/* <!-- Input Fields --> */}
                    <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Generate an invoice
                            </h3>
                        </div>
                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            onSubmit={handleInvoice}
                            validationSchema={FormValidationSchema}
                        >
                            {({
                                values,
                                handleChange,
                                handleSubmit,
                                setFieldValue,
                                touched,
                                handleBlur,
                                errors,
                            }) => (
                                <form className="" onSubmit={handleSubmit} method="post">
                                    <div className="flex flex-col gap-5.5 p-6.5">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="block">
                                                <label className="block mb-3 text-black dark:text-white">
                                                    Logo
                                                </label>
                                                <input
                                                    id="logo"
                                                    name="logo"
                                                    type="file"
                                                    accept='image/png, image/jpg'
                                                    onChange={handleFileChange}
                                                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <hr className='text-[#E2E8F0] dark:text-[#3C4D5F]' />
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="block">
                                                <label className="block mb-3 text-black dark:text-white">
                                                    Sender
                                                </label>
                                                <input
                                                    type="text"
                                                    name="sender"
                                                    value={values.sender}
                                                    onChange={handleChange('sender')}
                                                    onBlur={handleBlur('sender')}
                                                    autoComplete={`${true}`}
                                                    placeholder="Who is this invoice from?"
                                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                />
                                                {touched.sender && errors.sender && (
                                                    <MsgText
                                                        text={errors.sender}
                                                        textColor="danger"
                                                    />
                                                )}
                                            </div>
                                            <div className="block">
                                                <label className="block mb-3 text-black dark:text-white">
                                                    Invoice Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="invoice_number"
                                                    value={values.invoice_number}
                                                    onChange={handleChange('invoice_number')}
                                                    onBlur={handleBlur('invoice_number')}
                                                    autoComplete={`${true}`}
                                                    placeholder="Invoice Number"
                                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                />
                                                {touched.invoice_number && errors.invoice_number && (
                                                    <MsgText
                                                        text={errors.invoice_number}
                                                        textColor="danger"
                                                    />
                                                )}
                                            </div>

                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="block">
                                                <label className="block mb-3 text-black dark:text-white">
                                                    Recipient
                                                </label>
                                                <input
                                                    type="text"
                                                    name="recipient"
                                                    value={values.recipient}
                                                    onChange={handleChange('recipient')}
                                                    onBlur={handleBlur('recipient')}
                                                    autoComplete={`${true}`}
                                                    placeholder="Who is this invoice to?"
                                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                />
                                                {touched.recipient && errors.recipient && (
                                                    <MsgText
                                                        text={errors.recipient}
                                                        textColor="danger"
                                                    />
                                                )}
                                            </div>
                                            <div className="block col-start-2">
                                                <label className="block mb-3 text-black dark:text-white">
                                                    Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={values.date}
                                                    onChange={handleChange('date')}
                                                    onBlur={handleBlur('date')}
                                                    autoComplete={`${true}`}
                                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                />
                                                {touched.date && errors.date && (
                                                    <MsgText
                                                        text={errors.date}
                                                        textColor="danger"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="block col-start-2">
                                                <label className="block mb-3 text-black dark:text-white">
                                                    Due  Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="due_date"
                                                    value={values.due_date}
                                                    onChange={handleChange('due_date')}
                                                    onBlur={handleBlur('due_date')}
                                                    autoComplete={`${true}`}
                                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                />
                                                {touched.due_date && errors.due_date && (
                                                    <MsgText
                                                        text={errors.due_date}
                                                        textColor="danger"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <hr className='text-[#E2E8F0] dark:text-[#3C4D5F]' />
                                        <h3 className="font-medium text-black dark:text-white">
                                            Items
                                        </h3>
                                        <div className="grid grid-cols-6 gap-3">
                                            <div className="block">
                                                <label className="block mb-1 text-black dark:text-white">
                                                    Item
                                                </label>
                                            </div>
                                            <div className="block">
                                                <label className="block mb-1 text-black dark:text-white">
                                                    Quantity
                                                </label>
                                            </div>
                                            <div className="block">
                                                <label className="block mb-1 text-black dark:text-white">
                                                    UOM
                                                </label>
                                            </div>
                                            <div className="block">
                                                <label className="block mb-1 text-black dark:text-white">
                                                    Rate/RWF
                                                </label>
                                            </div>
                                            <div className="block">
                                                <label className="block mb-1 text-black dark:text-white">
                                                    Amount/RWF
                                                </label>
                                            </div>
                                            <div className="block">
                                                <label className="block mb-1 text-black dark:text-white">
                                                    Action
                                                </label>
                                            </div>
                                        </div>
                                        <FieldArray name="items">
                                            {({ insert, remove, push }) => (
                                                <React.Fragment>
                                                    {values.items.map((item, index) => (
                                                        <div className="grid grid-cols-6 gap-3" key={index}>
                                                            <div className="block">

                                                                <input
                                                                    type="text"
                                                                    id={`items.${index}.name`}
                                                                    name={`items.${index}.name`}
                                                                    value={
                                                                        values.items[index].name
                                                                    }
                                                                    onChange={handleChange(
                                                                        `items.${index}.name`
                                                                    )}
                                                                    onBlur={handleBlur(
                                                                        `items.${index}.name`
                                                                    )}
                                                                    placeholder="Enter item name"
                                                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                />
                                                            </div>
                                                            <div className="block">

                                                                <input
                                                                    type="number"
                                                                    id={`items.${index}.quantity`}
                                                                    name={`items.${index}.quantity`}
                                                                    value={
                                                                        values.items[index].quantity
                                                                    }
                                                                    onChange={handleChange(
                                                                        `items.${index}.quantity`
                                                                    )}
                                                                    onBlur={handleBlur(
                                                                        `items.${index}.quantity`
                                                                    )}
                                                                    min={0}
                                                                    placeholder="0"
                                                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                />
                                                            </div>
                                                            <div className="block">

                                                                <input
                                                                    type="text"
                                                                    id={`items.${index}.uom`}
                                                                    name={`items.${index}.uom`}
                                                                    value={
                                                                        values.items[index].uom
                                                                    }
                                                                    onChange={handleChange(
                                                                        `items.${index}.uom`
                                                                    )}
                                                                    onBlur={handleBlur(
                                                                        `items.${index}.uom`
                                                                    )}
                                                                    placeholder="Enter UOM"
                                                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                />
                                                            </div>
                                                            <div className="block">

                                                                <input
                                                                    type="number"
                                                                    min={0}
                                                                    id={`items.${index}.rate`}
                                                                    name={`items.${index}.rate`}
                                                                    value={
                                                                        values.items[index].rate
                                                                    }
                                                                    onChange={handleChange(
                                                                        `items.${index}.rate`
                                                                    )}
                                                                    onBlur={handleBlur(
                                                                        `items.${index}.rate`
                                                                    )}
                                                                    placeholder="0"
                                                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                />
                                                            </div>
                                                            <div className="block">

                                                                <input
                                                                    type="number"
                                                                    id={`items.${index}.amount`}
                                                                    name={`items.${index}.amount`}
                                                                    value={
                                                                        values.items[index].amount = values.items[index].quantity * values.items[index].rate
                                                                    }
                                                                    onChange={handleChange(
                                                                        `items.${index}.amount`
                                                                    )}
                                                                    onBlur={handleBlur(
                                                                        `items.${index}.amount`
                                                                    )}
                                                                    disabled
                                                                    placeholder="0"
                                                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                                />
                                                            </div>
                                                            <div className="block">

                                                                <div className='flex'>
                                                                    {index > 0 && (<button className="flex justify-center w-10 p-3 m-1 font-medium rounded-full bg-danger text-gray" type="button"
                                                                        onClick={() => {
                                                                            console.log("removing..." + index)
                                                                            remove(
                                                                                index
                                                                            )
                                                                        }}>
                                                                        <FiMinus />
                                                                    </button>)}
                                                                    <button className="flex justify-center w-10 p-3 m-1 font-medium rounded-full bg-primary text-gray" type="button"
                                                                        onClick={() => {
                                                                            console.log("pushing..." + index)
                                                                            push(
                                                                                {
                                                                                    name: "",
                                                                                    quantity: 0,
                                                                                    rate: 0,
                                                                                    amount: 0
                                                                                }
                                                                            )
                                                                        }}>
                                                                        <FiPlus />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>))}

                                                </React.Fragment>
                                            )}
                                        </FieldArray>
                                        <hr className='text-[#E2E8F0] dark:text-[#3C4D5F]' />
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className='block'>
                                                <div className="my-2">
                                                    <label className="block mb-3 text-black dark:text-white">
                                                        Notes
                                                    </label>
                                                    <textarea
                                                        rows={6}
                                                        name="notes"
                                                        value={values.notes}
                                                        onChange={handleChange('notes')}
                                                        onBlur={handleBlur('notes')}
                                                        autoComplete={`${true}`}
                                                        placeholder="Notes - any relevant information not already covered"
                                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    ></textarea>
                                                </div>
                                                <div className="my-2">
                                                    <label className="block mb-3 text-black dark:text-white">
                                                        Terms
                                                    </label>
                                                    <textarea
                                                        rows={6}
                                                        name="terms"
                                                        value={values.terms}
                                                        onChange={handleChange('terms')}
                                                        onBlur={handleBlur('terms')}
                                                        autoComplete={`${true}`}
                                                        placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className='block'>
                                                <div className="my-2">
                                                    <label className="block mb-3 text-black dark:text-white">
                                                        Subtotal / RWF
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        name='subtotal'
                                                        value={values.subtotal = values.items.reduce(
                                                            (accumulator, currentValue) => accumulator + currentValue.amount,
                                                            0,
                                                        )}
                                                        onChange={handleChange('subtotal')}
                                                        onBlur={handleBlur('subtotal')}
                                                        placeholder={`${values.items[0].amount}`}
                                                        disabled
                                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    />
                                                </div>
                                                <div className="my-2">
                                                    <label className="block mb-3 text-black dark:text-white">
                                                        Tax %
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        name='tax'
                                                        value={values.tax}
                                                        onChange={handleChange('tax')}
                                                        onBlur={handleBlur('tax')}
                                                        placeholder="0"
                                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    />
                                                </div>
                                                <div className="my-2">
                                                    <label className="block mb-3 text-black dark:text-white">
                                                        Discount %
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        name='discount'
                                                        value={values.discount}
                                                        onChange={handleChange('discount')}
                                                        onBlur={handleBlur('discount')}
                                                        placeholder="0"
                                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    />
                                                </div>
                                                <div className="my-2">
                                                    <label className="block mb-3 text-black dark:text-white">
                                                        Total / RWF
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        name='total'
                                                        value={values.total = values.subtotal - ((values.subtotal * values.tax) / 100) - ((values.subtotal * values.discount) / 100)}
                                                        onChange={handleChange('total')}
                                                        onBlur={handleBlur('total')}
                                                        placeholder="0"
                                                        disabled
                                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    />
                                                </div>
                                                <div className="my-2">
                                                    <label className="block mb-3 text-black dark:text-white">
                                                        Amount Paid / RWF
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        name='amount_paid'
                                                        value={values.amount_paid}
                                                        onChange={handleChange('amount_paid')}
                                                        onBlur={handleBlur('amount_paid')}
                                                        placeholder="0"
                                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    />
                                                </div>
                                                {values.amount_paid > 0 && (<div className="my-2">
                                                    <label className="block mb-3 text-black dark:text-white">
                                                        Balance Due
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        name='balance_due'
                                                        value={values.balance_due = values.total - values.amount_paid}
                                                        onChange={handleChange('balance_due')}
                                                        onBlur={handleBlur('balance_due')}
                                                        placeholder="0"
                                                        disabled
                                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    />
                                                </div>)}
                                            </div>

                                        </div>
                                        <button className="flex justify-center w-full p-3 font-medium rounded bg-primary text-gray">
                                            Generate Invoice
                                        </button>
                                    </div>
                                </form>)}</Formik>

                    </div>


                </div>


            </div>
        </>
    );
};

export default Apps;
