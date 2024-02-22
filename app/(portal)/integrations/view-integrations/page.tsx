import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InvoiceList from '@/components/Tables/InvoiceList';

import { Metadata } from "next";
export const metadata: Metadata = {
    title: "View integrations",
    description: "View Integrations",
};

const ViewIntegrations = () => {
    return (
        <>
            <Breadcrumb pageName="Integrations" />

            <div className="flex flex-col gap-10">
                <InvoiceList />
            </div>
        </>
    );
};

export default ViewIntegrations;
