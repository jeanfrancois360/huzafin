import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InvoiceList from '@/components/Tables/InvoiceList';


import { Metadata } from "next";
export const metadata: Metadata = {
    title: "View apps",
    description: "View apps",
};

const ViewApps = () => {
    return (
        <>
            <Breadcrumb pageName="Apps" />

            <div className="flex flex-col gap-10">
                <InvoiceList />
            </div>
        </>
    );
};

export default ViewApps;
