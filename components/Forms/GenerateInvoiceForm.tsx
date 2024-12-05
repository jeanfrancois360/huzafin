/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { Formik, FieldArray } from 'formik'
import * as Yup from 'yup';
import React, { useEffect, useId, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { MsgText } from '../MsgText/MsgText'
import { IInvoice } from '@/interfaces'
import axios from '../../axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { InfinitySpin } from 'react-loader-spinner';
import { ApiUrl } from '@/constants';
import items from '../../data/json/items.json'
import packaging_units from '../../data/json/packaging_units.json'
import payment_methods from '../../data/json/payment_methods.json'
import uoms from '../../data/json/uoms.json'
import sales_types from '../../data/json/sales_types.json'
import receipt_types from '../../data/json/receipt_types.json'
import tax_types from '../../data/json/tax_types.json'
import invoice_status from '../../data/json/invoice_status.json'
import refund_reasons from '../../data/json/refund_reasons.json'
import { v4 as uuidv4 } from 'uuid';

function generateUniqueId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueId = '';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueId += characters[randomIndex];
    }
    return uniqueId;
}
const GenerateInvoiceForm = ({ transaction, transaction_type }: { transaction: any, transaction_type: any }) => {

    let initialValues: IInvoice = {
        original_invoice_number: 0,
        customer_tin: 7,
        purchase_code: 0,
        sender: '',
        recipient: '',
        recipient_phone_number: '',
        sales_type_code: '',
        receipt_type_code: '',
        payment_type_code: '',
        invoice_status_code: '01',
        validated_date: '',
        date: '',
        due_date: '',
        notes: '',
        terms: '',
        subtotal: 0,
        total: 0,
        amount_paid: 0,
        balance_due: 0,
        taxable_amount: 0,
        tax: 0, //hidden
        discount: 0,
        registrant_id: '11999',
        registrant_name: 'TestVSDC',
        modifier_id: '45678',
        modifier_name: 'TestModifier',
        report_number: new Date().valueOf(),
        cancel_requested_date: "",
        cancel_date: "",
        refund_date: "",
        refunded_reason_code: "",

        items: [{
            name: "", // visible
            item_classification_code: "", // hidden
            packaging_unit_code: "", // hidden
            package: "", // hidden
            quantity: 1, // visible
            uom: "", // visible
            rate: 0, // visible
            amount: 0, // visible
            tax_type: "", // visible
            taxable_amount: 0, // visible
            tax_rate: 0, // visible
            tax_amount: 0, // visible
            discount_rate: 0, // visible
            discount_amount: 0, // visible
            external_id: new Date().valueOf(), // hidden
        }]
    }

    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedFile, setSelectedFile] = useState("");
    const [formValue, setFormValue] = useState<IInvoice>(initialValues);




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
        if (transaction) {
            const updatedFormValues = {
                original_invoice_number: transaction.id || initialValues.original_invoice_number,
                customer_tin: transaction.customer_tin || initialValues.customer_tin,
                purchase_code: transaction.purchase_code || initialValues.purchase_code,
                sender: transaction.sender || initialValues.sender,
                recipient: transaction.recipient || initialValues.recipient,
                recipient_phone_number: transaction.recipient_phone_number || initialValues.recipient_phone_number,
                sales_type_code: transaction_type == "C" ? transaction_type : transaction.sales_type_code ? transaction.sales_type_code : initialValues.sales_type_code,
                receipt_type_code: transaction_type == "R" ? transaction_type : transaction.receipt_type_code ? transaction.receipt_type_code : initialValues.receipt_type_code,
                payment_type_code: transaction.payment_type_code || initialValues.payment_type_code,
                invoice_status_code: transaction.invoice_status_code || initialValues.invoice_status_code,
                validated_date: transaction?.validated_date?.substring(0, 10) || initialValues.validated_date,
                date: transaction?.date?.substring(0, 10) || initialValues.date,
                due_date: transaction?.due_date?.substring(0, 10) || initialValues.due_date,
                notes: transaction.notes || initialValues.notes,
                terms: transaction.terms || initialValues.terms,
                subtotal: transaction.subtotal || initialValues.subtotal,
                total: transaction.total || initialValues.total,
                amount_paid: transaction.amount_paid || initialValues.amount_paid,
                balance_due: transaction.balance_due || initialValues.balance_due,
                taxable_amount: transaction.taxable_amount || initialValues.taxable_amount,
                tax: transaction.tax || initialValues.tax,
                discount: transaction.discount || initialValues.discount,
                registrant_id: transaction.registrant_id || initialValues.registrant_id,
                registrant_name: transaction.registrant_name || initialValues.registrant_name,
                modifier_id: transaction.modifier_id || initialValues.modifier_id,
                modifier_name: transaction.modifier_name || initialValues.modifier_name,
                report_number: transaction.report_number || initialValues.report_number,
                cancel_requested_date: transaction?.date?.substring(0, 10) || initialValues.date,
                cancel_date: transaction?.cancel_date?.substring(0, 10) || initialValues.cancel_date,
                refund_date: transaction?.refund_date?.substring(0, 10) || initialValues.refund_date,
                refunded_reason_code: transaction.refunded_reason_code || initialValues.refunded_reason_code,
                items: transaction.items.map((item: any, index: number) => ({
                    name: item.name || initialValues.items[index]?.name || '',
                    item_classification_code: item.item_classification_code || initialValues.items[index]?.item_classification_code || '',
                    packaging_unit_code: item.packaging_unit_code || initialValues.items[index]?.packaging_unit_code || '',
                    package: item.package || initialValues.items[index]?.package || '',
                    quantity: item.quantity || initialValues.items[index]?.quantity || 10,
                    uom: item.uom || initialValues.items[index]?.uom || '',
                    rate: item.rate || initialValues.items[index]?.rate || 0,
                    amount: item.amount || initialValues.items[index]?.amount || 0,
                    tax_type: item.tax_type || initialValues.items[index]?.tax_type || '',
                    taxable_amount: item.taxable_amount || initialValues.items[index]?.taxable_amount || 0,
                    tax_rate: item.tax_rate || initialValues.items[index]?.tax_rate || 0,
                    tax_amount: item.tax_amount || initialValues.items[index]?.tax_amount || 0,
                    discount_rate: item.discount_rate || initialValues.items[index]?.discount_rate || 0,
                    discount_amount: item.discount_amount || initialValues.items[index]?.discount_amount || 0,
                    external_id: new Date().valueOf(),
                })),
            };

            setFormValue(updatedFormValues);
            console.log({ transaction });
            console.log({ updatedFormValues });
        }
    }, [transaction]);


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
        sender: Yup.string().trim().required().label("Sender"),
        recipient: Yup.string().trim().required().label("Recipient"),
        recipient_phone_number: Yup.string()
            .matches(/^\+250\d{9}$/, 'Phone number must start with +250 and have 12 digits')
            .required('Recipient phone number is required'),
        sales_type_code: Yup.string().trim().required().label("Sales Type"),
        receipt_type_code: Yup.string().trim().required().label("Receipt Type"),
        payment_type_code: Yup.string().trim().required().label("Payment Method"),
        invoice_status_code: Yup.string().trim().required().label("Invoice Status"),
        validated_date: Yup.string().trim().required().label("Validated Date"),
        date: Yup.date().required('Date is required'),
        due_date: Yup.date()
            .required('Due date is required')
            .when(
                'date',
                (date, schema) => date && schema.min(date, 'Due date must be greater than or equal to Date')
            ),
        customer_tin: Yup.number().max(9).required().label('TIN Number'),
    })

    const handleFileChange = (e: any) => {
        setSelectedFile(e.target.files)
    }

    const handleInvoice = (payload: any) => {
        try {
            setIsLoading(true)
            const formData: FormData = new FormData();
            for (const key in payload) {
                if (key === "items") {
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

            axios.post('/api/invoices', formData, {
                headers: {
                    Authorization:
                        'Bearer ' + JSON.parse(localStorage.getItem('access_token') || ''),
                },
            }).then((response) => {
                setIsLoading(false)
                console.log({ response })
                setSuccessMsg(response.data.data.message)
                let invoicePath = `${response.data.data.file_path}`
                if (payload.recipient_phone_number) {
                    handleSendSMS(invoicePath, payload.recipient_phone_number)
                }
                else {
                    setErrorMsg('SMS not sent due to missing recipient phone number')
                }
                window != undefined && window.open(invoicePath, "_blank");
            }).catch((error) => {
                setIsLoading(false)
                setErrorMsg(error.response.data.message)
                console.error('Error generating PDF:', error);
            })
        } catch (error) {
            setIsLoading(false)
            console.error("Something went wrong", error);
        }
    }
    const generateUniqueID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
            const random = Math.random() * 16 | 0;
            const value = char === 'x' ? random : (random & 0x3 | 0x8);
            return value.toString(16);
        });
    }

    const handleSendSMS = (path: string, phone: string) => {
        let payload = {
            "msisdn": phone,
            "message": "Click the link below to view your invoice: " + path,
            "msgRef": generateUniqueID(),
            "sender_id": "FDI"
        }
        axios.post('/api/sms/send-sms', payload, {
            headers: {
                Authorization:
                    'Bearer ' + JSON.parse(localStorage.getItem('access_token') || ''),
            },
        }).then((response) => {
            setIsLoading(false)
            console.log({ response })
            setSuccessMsg(response.data.data.message)
            window != undefined && window.open(`${ApiUrl}${response.data.data.file_path}`, "_blank");

        }).catch((error) => {
            setIsLoading(false)
            setErrorMsg(error.response.data.message)
            console.error('Error generating PDF:', error);
        })
    }
    return (
        <>
            <ToastContainer />
            <Formik
                enableReinitialize
                initialValues={formValue}
                onSubmit={handleInvoice}
                validationSchema={FormValidationSchema}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                    touched,
                    handleBlur,
                    errors,
                }) => (
                    <form className="" onSubmit={handleSubmit} method="post">
                        <div className="flex flex-col gap-5.5 p-6.5">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Receipt Type
                                    </label>
                                    <select
                                        name="receipt_type_code"
                                        value={values.receipt_type_code || ""}
                                        onChange={handleChange('receipt_type_code')}
                                        onBlur={handleBlur('receipt_type_code')}
                                        autoComplete={`${true}`}
                                        className="relative z-20 w-full px-5 py-3 transition bg-transparent border rounded outline-none appearance-none border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                        <option disabled value="">--Select receipt type--</option>
                                        {receipt_types && receipt_types.map((item, index) => (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                    {touched.receipt_type_code && errors.receipt_type_code && (
                                        <MsgText text={errors.receipt_type_code} textColor="danger" />
                                    )}
                                </div>
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
                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Original Invoice Number
                                    </label>
                                    <input
                                        type="number"
                                        name="original_invoice_number"
                                        value={values.original_invoice_number || 0}
                                        onChange={handleChange('original_invoice_number')}
                                        onBlur={handleBlur('original_invoice_number')}
                                        autoComplete={`${true}`}
                                        disabled
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                    {touched.original_invoice_number && errors.original_invoice_number && (
                                        <MsgText text={errors.original_invoice_number} textColor="danger" />
                                    )}
                                </div>
                                {transaction_type == "R" && (<><div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Cancel Requested Date
                                    </label>
                                    <input
                                        type="date"
                                        name="cancel_requested_date"
                                        value={values.cancel_requested_date || ""}
                                        onChange={handleChange('cancel_requested_date')}
                                        onBlur={handleBlur('cancel_requested_date')}
                                        autoComplete={`${true}`}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                    {touched.cancel_requested_date && errors.cancel_requested_date && (
                                        <MsgText text={errors.cancel_requested_date} textColor="danger" />
                                    )}
                                </div>
                                    <div className="block">
                                        <label className="block mb-3 text-black dark:text-white">
                                            Cancel Date
                                        </label>
                                        <input
                                            type="date"
                                            name="cancel_date"
                                            value={values.cancel_date || ""}
                                            onChange={handleChange('cancel_date')}
                                            onBlur={handleBlur('cancel_date')}
                                            autoComplete={`${true}`}
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                        {touched.cancel_date && errors.cancel_date && (
                                            <MsgText text={errors.cancel_date} textColor="danger" />
                                        )}
                                    </div>
                                    <div className="block">
                                        <label className="block mb-3 text-black dark:text-white">
                                            Refund Date
                                        </label>
                                        <input
                                            type="date"
                                            name="refund_date"
                                            value={values.refund_date || ""}
                                            onChange={handleChange('refund_date')}
                                            onBlur={handleBlur('refund_date')}
                                            autoComplete={`${true}`}
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                        {touched.refund_date && errors.refund_date && (
                                            <MsgText text={errors.refund_date} textColor="danger" />
                                        )}
                                    </div>

                                    <div className="block">
                                        <label className="block mb-3 text-black dark:text-white">
                                            Refund Reason
                                        </label>
                                        <select
                                            name="refunded_reason_code"
                                            value={values.refunded_reason_code || ""}
                                            onChange={handleChange('refunded_reason_code')}
                                            onBlur={handleBlur('refunded_reason_code')}
                                            autoComplete={`${true}`}
                                            className="relative z-20 w-full px-5 py-3 transition bg-transparent border rounded outline-none appearance-none border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                            <option disabled value="">--Select refund reason--</option>
                                            {refund_reasons && refund_reasons.map((item, index) => (
                                                <option key={index} value={item.code}>{item.name}</option>
                                            ))}
                                        </select>
                                        {touched.refunded_reason_code && errors.refunded_reason_code && (
                                            <MsgText text={errors.refunded_reason_code} textColor="danger" />
                                        )}

                                    </div>
                                </>
                                )}

                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Sender
                                    </label>
                                    <input
                                        type="text"
                                        name="sender"
                                        value={values.sender || ""}
                                        onChange={handleChange('sender')}
                                        onBlur={handleBlur('sender')}
                                        autoComplete={`${true}`}
                                        placeholder="Who is this invoice from?"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                    {touched.sender && errors.sender && (
                                        <MsgText text={errors.sender} textColor="danger" />
                                    )}
                                </div>
                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Recipient
                                    </label>
                                    <input
                                        type="text"
                                        name="recipient"
                                        value={values.recipient || ""}
                                        onChange={handleChange('recipient')}
                                        onBlur={handleBlur('recipient')}
                                        autoComplete={`${true}`}
                                        placeholder="Who is this invoice to?"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                    {touched.recipient && errors.recipient && (
                                        <MsgText text={errors.recipient} textColor="danger" />
                                    )}
                                </div>
                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Recipient TIN
                                    </label>

                                    <input
                                        type="text"
                                        name="customer_tin"
                                        value={values.customer_tin || ""}
                                        onChange={handleChange('customer_tin')}
                                        onBlur={handleBlur('customer_tin')}
                                        autoComplete={`${true}`}
                                        placeholder="Enter recipient TIN number"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Recipient Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        name="recipient_phone_number"
                                        value={values.recipient_phone_number || "+250"}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            if (!value.startsWith("+250")) {
                                                value = "+250" + value.replace(/^\+?250?/, "");
                                            }
                                            handleChange({ target: { name: 'recipient_phone_number', value } });
                                        }}
                                        onBlur={handleBlur('recipient_phone_number')}
                                        autoComplete="on"
                                        placeholder="Enter recipient phone number..."
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                    {touched.recipient_phone_number && errors.recipient_phone_number && (
                                        <MsgText text={errors.recipient_phone_number} textColor="danger" />
                                    )}
                                </div>
                                {values.customer_tin && (<div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Purchase Code
                                    </label>
                                    <input
                                        type="text"
                                        name="purchase_code"
                                        value={values.purchase_code || ""}
                                        onChange={handleChange('purchase_code')}
                                        onBlur={handleBlur('purchase_code')}
                                        autoComplete={`${true}`}
                                        placeholder="Enter purchase code"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>)}

                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={values.date || ""}
                                        onChange={handleChange('date')}
                                        onBlur={handleBlur('date')}
                                        autoComplete={`${true}`}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                    {touched.date && errors.date && (
                                        <MsgText text={errors.date} textColor="danger" />
                                    )}
                                </div>


                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        name="due_date"
                                        value={values.due_date || ""}
                                        onChange={handleChange('due_date')}
                                        onBlur={handleBlur('due_date')}
                                        autoComplete={`${true}`}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                    {touched.due_date && errors.due_date && (
                                        <MsgText text={errors.due_date} textColor="danger" />
                                    )}
                                </div>

                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Validated Date
                                    </label>
                                    <input
                                        type="date"
                                        name="validated_date"
                                        value={values.validated_date || ""}
                                        onChange={handleChange('validated_date')}
                                        onBlur={handleBlur('validated_date')}
                                        autoComplete={`${true}`}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                    {touched.validated_date && errors.validated_date && (
                                        <MsgText text={errors.validated_date} textColor="danger" />
                                    )}
                                </div>

                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Sales Type
                                    </label>
                                    <select
                                        name="sales_type_code"
                                        value={values.sales_type_code || ""}
                                        onChange={handleChange('sales_type_code')}
                                        onBlur={handleBlur('sales_type_code')}
                                        autoComplete={`${true}`}
                                        className="relative z-20 w-full px-5 py-3 transition bg-transparent border rounded outline-none appearance-none border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                        <option disabled value="">--Select sales type--</option>
                                        {sales_types && sales_types.map((item, index) => (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                    {touched.sales_type_code && errors.sales_type_code && (
                                        <MsgText text={errors.sales_type_code} textColor="danger" />
                                    )}
                                </div>
                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Invoice Status
                                    </label>
                                    <select
                                        name="invoice_status_code"
                                        value={values.invoice_status_code || ""}
                                        onChange={handleChange('invoice_status_code')}
                                        onBlur={handleBlur('invoice_status_code')}
                                        autoComplete={`${true}`}
                                        className="relative z-20 w-full px-5 py-3 transition bg-transparent border rounded outline-none appearance-none border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                        <option disabled value="">--Select receipt type--</option>
                                        {invoice_status && invoice_status.map((item, index) => (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                    {touched.invoice_status_code && errors.invoice_status_code && (
                                        <MsgText text={errors.invoice_status_code} textColor="danger" />
                                    )}
                                </div>


                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Payment Method
                                    </label>
                                    <select
                                        name="payment_type_code"
                                        value={values.payment_type_code || ""}
                                        onChange={handleChange('payment_type_code')}
                                        onBlur={handleBlur('payment_type_code')}
                                        autoComplete={`${true}`}
                                        className="relative z-20 w-full px-5 py-3 transition bg-transparent border rounded outline-none appearance-none border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                        <option disabled value="">--Select payment method--</option>
                                        {payment_methods && payment_methods.map((item, index) => (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                    {touched.payment_type_code && errors.payment_type_code && (
                                        <MsgText text={errors.payment_type_code} textColor="danger" />
                                    )}
                                </div>
                            </div>

                            <hr className='text-[#E2E8F0] dark:text-[#3C4D5F]' />
                            <h3 className="font-medium text-black dark:text-white">
                                Items
                            </h3>
                            <FieldArray name="items">
                                {({ insert, remove, push }) => (
                                    <React.Fragment>
                                        {values.items.map((item, index) => (
                                            <div className="p-6 rounded-md bg-whiter border-[#e2e8f0]" key={index}>
                                                <div className="grid grid-cols-4 gap-3 ">
                                                    <div className="block">
                                                        <label className="block mb-1 text-black dark:text-white">
                                                            Item
                                                        </label>
                                                        <select
                                                            name={`items.${index}.name`}
                                                            value={values.items[index]?.name || ""}
                                                            onChange={handleChange(`items.${index}.name`)}
                                                            onBlur={handleBlur(`items.${index}.name`)}
                                                            autoComplete={`${true}`}
                                                            className="relative z-20 w-full px-5 py-3 transition bg-transparent border rounded outline-none appearance-none border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                                            <option disabled value="">--Select an item--</option>
                                                            {items && items.map((item, index) => (
                                                                <option key={index} value={item.name}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="block">
                                                        <label className="block mb-1 text-black dark:text-white">
                                                            Quantity
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id={`items.${index}.quantity`}
                                                            name={`items.${index}.quantity`}
                                                            value={
                                                                values.items[index]?.quantity
                                                            }
                                                            onChange={handleChange(
                                                                `items.${index}.quantity`
                                                            )}
                                                            onBlur={handleBlur(
                                                                `items.${index}.quantity`
                                                            )}
                                                            min={1}
                                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="block">
                                                        <label className="block mb-1 text-black dark:text-white">
                                                            UOM
                                                        </label>
                                                        <select
                                                            name={`items.${index}.uom`}
                                                            value={values.items[index].uom = items.filter((item) => item.name == values.items[index]?.name)[0]?.uom || ""}
                                                            onChange={handleChange(`items.${index}.uom`)}
                                                            onBlur={handleBlur(`items.${index}.uom`)}
                                                            autoComplete={`${true}`}
                                                            className="relative z-20 w-full px-5 py-3 transition bg-transparent border rounded outline-none appearance-none border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                                            <option disabled value="">--Select sales type--</option>
                                                            {uoms && uoms.map((item, index) => (
                                                                <option key={index} value={item.id}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="block">
                                                        <label className="block mb-1 text-black dark:text-white">
                                                            Rate/RWF
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            id={`items.${index}.rate`}
                                                            name={`items.${index}.rate`}
                                                            value={values.items[index].rate = (transaction_type == "R" ? ((items.filter((item) => item.name == values.items[index]?.name)[0]?.rate) * -1) : (items.filter((item) => item.name == values.items[index]?.name)[0]?.rate)) || 0}
                                                            onChange={handleChange(
                                                                `items.${index}.rate`
                                                            )}
                                                            onBlur={handleBlur(
                                                                `items.${index}.rate`
                                                            )}
                                                            placeholder="0"
                                                            disabled
                                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                        />
                                                    </div>

                                                    <div className="block">
                                                        <label className="block mb-1 text-black dark:text-white">
                                                            Tax type
                                                        </label>
                                                        <select
                                                            name={`items.${index}.tax_type`}
                                                            value={values.items[index].tax_type = items.filter((item) => item.name == values.items[index]?.name)[0]?.tax_type || ""}
                                                            onChange={handleChange(`items.${index}.tax_type`)}
                                                            onBlur={handleBlur(`items.${index}.tax_type`)}
                                                            autoComplete={`${true}`}
                                                            className="relative z-20 w-full px-5 py-3 transition bg-transparent border rounded outline-none appearance-none border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                                            <option disabled value="">--Select sales type--</option>
                                                            {tax_types && tax_types.map((item, index) => (
                                                                <option key={index} value={item.id}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="block">
                                                        <label className="block mb-1 text-black dark:text-white">
                                                            Tax rate
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id={`items.${index}.tax_rate`}
                                                            name={`items.${index}.tax_rate`}
                                                            value={
                                                                values.items[index].tax_rate = items.filter((item) => item.name == values.items[index]?.name)[0]?.tax_rate || 0
                                                            }
                                                            onChange={handleChange(
                                                                `items.${index}.tax_rate`
                                                            )}
                                                            onBlur={handleBlur(
                                                                `items.${index}.tax_rate`
                                                            )}
                                                            disabled
                                                            placeholder="0"
                                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="block">
                                                        <label className="block mb-1 text-black dark:text-white">
                                                            Taxable Amount/RWF
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id={`items.${index}.taxable_amount`}
                                                            name={`items.${index}.taxable_amount`}
                                                            value={
                                                                values.items[index].taxable_amount = parseFloat(((values.items[index]?.quantity * values.items[index]?.rate)).toFixed(2)) || 0
                                                            }
                                                            onChange={handleChange(
                                                                `items.${index}.taxable_amount`
                                                            )}
                                                            onBlur={handleBlur(
                                                                `items.${index}.taxable_amount`
                                                            )}
                                                            disabled
                                                            placeholder="0"
                                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="block">
                                                        <label className="block mb-1 text-black dark:text-white">
                                                            Tax Amount/RWF
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id={`items.${index}.tax_amount`}
                                                            name={`items.${index}.tax_amount`}
                                                            value={
                                                                values.items[index].tax_amount =
                                                                values.items[index]?.tax_rate > 0
                                                                    ? parseFloat(
                                                                        (
                                                                            (values.items[index]?.taxable_amount * values.items[index]?.tax_rate) /
                                                                            (100 + values.items[index]?.tax_rate)
                                                                        ).toFixed(2)
                                                                    )
                                                                    : 0
                                                            }
                                                            onChange={handleChange(
                                                                `items.${index}.tax_amount`
                                                            )}
                                                            onBlur={handleBlur(
                                                                `items.${index}.tax_amount`
                                                            )}
                                                            disabled
                                                            placeholder="0"
                                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="block">
                                                        <label className="block mb-1 text-black dark:text-white">
                                                            Discount rate/%
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id={`items.${index}.discount_rate`}
                                                            name={`items.${index}.discount_rate`}
                                                            value={
                                                                values.items[index]?.discount_rate
                                                            }
                                                            onChange={handleChange(
                                                                `items.${index}.discount_rate`
                                                            )}
                                                            onBlur={handleBlur(
                                                                `items.${index}.discount_rate`
                                                            )}
                                                            min={0}
                                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="block">
                                                        <label className="block mb-1 text-black dark:text-white">
                                                            Discount Amount/RWF
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id={`items.${index}.discount_amount`}
                                                            name={`items.${index}.discount_amount`}
                                                            value={
                                                                values.items[index].discount_amount = parseFloat(((values.items[index]?.taxable_amount * ((values.items[index]?.discount_rate) / 100))).toFixed(2))
                                                            }
                                                            onChange={handleChange(
                                                                `items.${index}.discount_amount`
                                                            )}
                                                            onBlur={handleBlur(
                                                                `items.${index}.discount_amount`
                                                            )}
                                                            disabled
                                                            placeholder="0"
                                                            min={0}
                                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="block">
                                                        <label className="block mb-1 text-black dark:text-white">
                                                            Amount/RWF
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id={`items.${index}.amount`}
                                                            name={`items.${index}.amount`}
                                                            value={
                                                                values.items[index].amount = parseFloat(((values.items[index]?.taxable_amount - values.items[index]?.discount_amount) || values.items[index]?.taxable_amount).toFixed(2))
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
                                                        <select
                                                            name="packaging_unit_code"
                                                            value={values.items[index].packaging_unit_code = (items.filter((item) => item.name == values.items[index]?.name)[0]?.packaging_unit_code) || ""}
                                                            onChange={handleChange('packaging_unit_code')}
                                                            onBlur={handleBlur('packaging_unit_code')}
                                                            hidden
                                                            autoComplete={`${true}`}
                                                            className="relative z-20 w-full px-5 py-3 transition bg-transparent border rounded outline-none appearance-none border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                                            <option disabled value="">--Select sales type--</option>
                                                            {packaging_units && packaging_units.map((item, index) => (
                                                                <option key={index} value={item.id}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="text"
                                                            id={`items.${index}.package`}
                                                            name={`items.${index}.package`}
                                                            hidden
                                                            value={
                                                                values.items[index].package = values.items[index]?.quantity?.toString() || ""
                                                            }
                                                            onChange={handleChange(
                                                                `items.${index}.package`
                                                            )}
                                                            onBlur={handleBlur(
                                                                `items.${index}.package`
                                                            )}
                                                            disabled
                                                            placeholder="0"
                                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                        />
                                                        <input
                                                            type="text"
                                                            id={`items.${index}.item_classification_code`}
                                                            name={`items.${index}.item_classification_code`}
                                                            hidden
                                                            value={
                                                                values.items[index].item_classification_code = generateUniqueId() || ""
                                                            }
                                                            onChange={handleChange(
                                                                `items.${index}.item_classification_code`
                                                            )}
                                                            onBlur={handleBlur(
                                                                `items.${index}.item_classification_code`
                                                            )}
                                                            disabled
                                                            placeholder="0"
                                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-3">
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

                                                                        quantity: 1,
                                                                        discount_rate: 0,
                                                                        rate: 0,
                                                                        amount: 0
                                                                    }
                                                                )
                                                            }}>
                                                            <FiPlus />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </React.Fragment>
                                )}
                            </FieldArray>
                            <hr className='text-[#E2E8F0] dark:text-[#3C4D5F]' />
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                            value={values.subtotal = parseFloat(((values.items.reduce(
                                                (accumulator, currentValue) => accumulator + currentValue.amount,
                                                0,
                                            ))).toFixed(2)) || 0}
                                            onChange={handleChange('subtotal')}
                                            onBlur={handleBlur('subtotal')}
                                            placeholder={`${values.items[0].amount}`}
                                            disabled
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </div>
                                    <div className="my-2">
                                        <label className="block mb-3 text-black dark:text-white">
                                            Taxable Amount / RWF
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            name='taxable_amount'
                                            value={values.taxable_amount = parseFloat(((values.items.reduce(
                                                (accumulator, currentValue) => accumulator + currentValue.taxable_amount,
                                                0,
                                            ))).toFixed(2)) || 0}
                                            onChange={handleChange('taxable_amount')}
                                            onBlur={handleBlur('taxable_amount')}
                                            placeholder={`${values.items[0].taxable_amount}`}
                                            disabled
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </div>
                                    <div className="my-2">
                                        <label className="block mb-3 text-black dark:text-white">
                                            Tax Amount / RWF
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            name='tax'
                                            value={values.tax = parseFloat(((values.items.reduce(
                                                (accumulator, currentValue) => accumulator + currentValue.tax_amount,
                                                0,
                                            ))).toFixed(2)) || 0}
                                            onChange={handleChange('tax')}
                                            onBlur={handleBlur('tax')}
                                            placeholder={`${values.items[0].tax_amount}`}
                                            disabled
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </div>
                                    <div className="my-2">
                                        <label className="block mb-3 text-black dark:text-white">
                                            Discount Amount
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            name='discount'
                                            value={values.discount = parseFloat(((values.items.reduce(
                                                (accumulator, currentValue) => accumulator + currentValue.discount_amount,
                                                0,
                                            ))).toFixed(2)) || 0}
                                            disabled
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
                                            value={values.total = parseFloat((values.subtotal).toFixed(2))}
                                            onChange={handleChange('total')}
                                            onBlur={handleBlur('total')}
                                            placeholder="0"
                                            disabled
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </div>
                                    <div className="hidden my-2">
                                        <label className="block mb-3 text-black dark:text-white">
                                            Amount Paid / RWF
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            hidden
                                            name='amount_paid'
                                            value={values.amount_paid}
                                            onChange={handleChange('amount_paid')}
                                            onBlur={handleBlur('amount_paid')}
                                            placeholder="0"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </div>
                                    {values.amount_paid > 0 && (<div className="hidden my-2">
                                        <label className="block mb-3 text-black dark:text-white">
                                            Balance Due
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            hidden
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
                            <button
                                type="submit"
                                disabled={isLoading ? true : false}
                                className="flex justify-center w-full font-medium rounded bg-primary text-gray"
                            >
                                {!isLoading ? (<div className='p-4'> Generate Invoice</div>) : (
                                    <div className='ml-[-5%]'>
                                        <InfinitySpin
                                            width="110"
                                            color="#fff"
                                        />
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>)}</Formik >
        </>
    )
}

export default GenerateInvoiceForm