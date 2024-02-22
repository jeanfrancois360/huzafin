import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InvoiceList from '@/components/Tables/InvoiceList';

import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Dashboard-View-Roles",
    description: "View roles",
    // other metadata
};

const ViewRoles = () => {
    return (
        <>
            <Breadcrumb pageName="Roles" />

            <div className="flex flex-col gap-10">
                <InvoiceList />
            </div>
        </>
    );
};

export default ViewRoles;
