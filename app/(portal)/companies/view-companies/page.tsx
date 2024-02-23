import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InvoiceList from '@/components/Tables/InvoiceList';

import { Metadata } from "next";
export const metadata: Metadata = {
    title: "View companies",
    description: "View companies",

};

const ViewCompanies = () => {
    return (
        <>
            <Breadcrumb pageName="Companies" />

            <div className="flex flex-col gap-10">
                <InvoiceList />
            </div>
        </>
    );
};

export default ViewCompanies;
