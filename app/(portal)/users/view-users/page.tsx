import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InvoiceList from '@/components/Tables/InvoiceList';

import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Dashboard-View-Users",
    description: "View users",
    // other metadata
};

const ViewUsers = () => {
    return (
        <>
            <Breadcrumb pageName="Users" />

            <div className="flex flex-col gap-10">
                <InvoiceList />
            </div>
        </>
    );
};

export default ViewUsers;
