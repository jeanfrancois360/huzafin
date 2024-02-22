import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InvoiceList from '@/components/Tables/InvoiceList';

import { Metadata } from "next";
export const metadata: Metadata = {
    title: "View endpoints",
    description: "View endpoints",
};

const ViewEndpoints = () => {
    return (
        <>
            <Breadcrumb pageName="Endpoints" />

            <div className="flex flex-col gap-10">
                <InvoiceList />
            </div>
        </>
    );
};

export default ViewEndpoints;
