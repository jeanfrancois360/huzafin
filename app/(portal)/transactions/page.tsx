"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableThree from "@/components/Tables/TableThree";
import axios from 'axios';

import { Metadata } from "next";
import { useEffect, useState } from 'react';


const ViewTransactions = () => {
  const [transactions, setTransactions] = useState<any | undefined>([]);

  useEffect(() => {
    axios.get('http://localhost:8001/api/invoices').then((response) => {
      console.log({ response })
      setTransactions(response.data.data)

    }).catch((error) => {

      console.error('Fetching while fetching transactions', error);
    })
  }, [])

  return (
    <>
      <Breadcrumb pageName="Transactions" />

      <div className="flex flex-col gap-10">
        <TableThree transactions={transactions} />
      </div>
    </>
  );
};

export default ViewTransactions;
