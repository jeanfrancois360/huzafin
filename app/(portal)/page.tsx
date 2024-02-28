import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "HuzAccounts",
  description: "HuzAccounts",
  // other metadata
};

export default function Home() {
  redirect("/invoice/generate-invoice");
  return (
    <>
      <ECommerce />
    </>
  );
}
