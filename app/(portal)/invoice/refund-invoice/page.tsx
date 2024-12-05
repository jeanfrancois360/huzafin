'use client';
import React from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import GenerateInvoiceForm from '@/components/Forms/GenerateInvoiceForm';
import { useSearchParams } from 'next/navigation';

const Apps = () => {
    const searchParams = useSearchParams();
    const transaction = searchParams.get('transaction')
        ? JSON.parse(searchParams.get('transaction') as string)
        : null;
    return (
        <>
            <Breadcrumb pageName="Refund Invoice" />
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    {/* <!-- Input Fields --> */}
                    <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Invoice details
                            </h3>
                        </div>
                        <GenerateInvoiceForm transaction={transaction} transaction_type={'R'} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Apps;
