"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InvoiceList from '@/components/Tables/InvoiceList';
import axios from 'axios';
import { useEffect, useState } from 'react';


const ViewTransactions = () => {
  const [transactions, setTransactions] = useState<any | undefined>([]);

  useEffect(() => {
    axios.get('/api/invoices', {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('access_token') || ''),
      },
    }).then((response) => {
      console.log({ response })
      setTransactions(response.data.data)

    }).catch((error) => {
      console.error('Error while fetching transactions', error);
    })
  }, [])

  return (
    <>
      <Breadcrumb pageName="Transactions" />

      <div className="flex flex-col gap-10">
        <InvoiceList transactions={transactions} />
      </div>
    </>
  );
};

export default ViewTransactions;
