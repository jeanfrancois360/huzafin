"use client"
import { Formik, FieldArray } from 'formik'
import * as Yup from 'yup';
import React, { useEffect, useId, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { ISettings } from '@/interfaces'
import axios from '../../../axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { ApiUrl } from '@/constants';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { MsgText } from '@/components/MsgText/MsgText';
import { InfinitySpin } from 'react-loader-spinner';


const Settings = () => {
  let initialValues: ISettings = {
    tin: "",
    mrc: "",
    branch_id: "00",
    address: ""
  }

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  // const [settings, setSettings] = useState<ISettings>(initialValues)
  const [formValue, setFormValue] = useState<ISettings>(initialValues)



  const notify = (msg_type: string) => {
    if (msg_type === 'success')
      toast.success(successMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
    if (msg_type === 'error')
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
  }


  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    if (formValue) {
      console.log({ formValue })
    }
  }, [formValue])


  useEffect(() => {
    if (successMsg) {
      notify('success')
    }
  }, [successMsg])

  useEffect(() => {
    if (errorMsg) {
      notify('error')
    }
  }, [errorMsg])


  const FormValidationSchema = Yup.object().shape({
    tin: Yup.string().trim().required().label("TIN Number"),
    mrc: Yup.string().trim().required().label("MRC Number"),
    branch_id: Yup.string().trim().required().label("Branch ID"),
    address: Yup.string().trim().required().label("Address"),
  })

  const handleSettingsSubmit = async (payload: ISettings) => {
    console.log({ payload })
    const data = {
      tin: payload.tin,
      mrc: payload.mrc,
      branch_id: payload.branch_id,
      address: payload.address
    }
    if (isLoading) {
      return
    }

    setIsLoading(true);
    setErrorMsg("")
    return await axios.post(`/api/system-settings`, data, {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('access_token') || ''),
      },
    }).then((res) => {
      setIsLoading(false)
      if (res.data.status == true) {
        setSuccessMsg(res.data.message);
        fetchSettings()
      }
    }).catch((error: { response: { data: { message: any; }; }; message: any; }) => {
      setIsLoading(false);
      console.error(error.response?.data?.message);
      const errorMessage = error.response?.data?.message;
      setErrorMsg(errorMessage || error.message);
    })

  }
  const fetchSettings = async () => {
    return await axios.get(`/api/system-settings`, {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('access_token') || ''),
      },
    }).then((res) => {
      setFormValue({
        tin: res.data.data.tin,
        mrc: res.data.data.mrc,
        branch_id: res.data.data.branch_id,
        address: res.data.data.address,
      })
    }).catch((error: { response: { data: { message: any; }; }; message: any; }) => {
      console.error(error.response?.data?.message);
      const errorMessage = error.response?.data?.message;
      setErrorMsg(errorMessage || error.message);
    })
  }


  return (
    <>
      <ToastContainer />
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 xl:col-span-12">
            <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="py-4 border-b border-stroke px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  System Settings
                </h3>
              </div>
              <div className="p-7">
                <Formik
                  enableReinitialize
                  initialValues={formValue}
                  onSubmit={handleSettingsSubmit}
                  validationSchema={FormValidationSchema}
                >
                  {({
                    values,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    touched,
                    handleBlur,
                    errors,
                  }) => (
                    <form className="" onSubmit={handleSubmit} method="post">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="block">
                          <label
                            className="block mb-3 text-sm font-medium text-black dark:text-white"
                            htmlFor="fullName"
                          >
                            TIN Number
                          </label>
                          <div className="relative">
                            <input
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              type="text"
                              placeholder="Enter TIN Number"
                              name="tin"
                              value={values.tin}
                              onChange={handleChange('tin')}
                              onBlur={handleBlur('tin')}
                              autoComplete={`${true}`}
                            />
                            {touched.tin && errors.tin && (
                              <MsgText text={errors.tin} textColor="danger" />
                            )}
                          </div>
                        </div>

                        <div className="block">
                          <label
                            className="block mb-3 text-sm font-medium text-black dark:text-white"
                            htmlFor="address"
                          >
                            Address
                          </label>
                          <div className="relative">
                            <input
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              type="address"
                              id="address"
                              name="text"
                              placeholder='Enter address'
                              value={values.address}
                              onChange={handleChange('address')}
                              onBlur={handleBlur('address')}
                              autoComplete={`${true}`}
                            />
                            {touched.address && errors.address && (
                              <MsgText text={errors.address} textColor="danger" />
                            )}
                          </div>
                        </div>
                        <div className="block">
                          <label
                            className="block mb-3 text-sm font-medium text-black dark:text-white"
                            htmlFor="address"
                          >
                            MRC Number
                          </label>
                          <div className="relative">
                            <input
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              type="mrc"
                              id="mrc"
                              name="text"
                              placeholder='Enter MRC'
                              value={values.mrc}
                              onChange={handleChange('mrc')}
                              onBlur={handleBlur('mrc')}
                              autoComplete={`${true}`}
                            />
                            {touched.mrc && errors.mrc && (
                              <MsgText text={errors.mrc} textColor="danger" />
                            )}
                          </div>
                        </div>
                        <div className="block">
                          <label
                            className="block mb-3 text-sm font-medium text-black dark:text-white"
                            htmlFor="address"
                          >
                            Branch ID
                          </label>
                          <div className="relative">
                            <input
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              type="branch_id"
                              id="branch_id"
                              name="text"
                              placeholder='Enter Branch ID'
                              value={values.branch_id}
                              onChange={handleChange('branch_id')}
                              onBlur={handleBlur('branch_id')}
                              autoComplete={`${true}`}
                            />
                            {touched.branch_id && errors.branch_id && (
                              <MsgText text={errors.branch_id} textColor="danger" />
                            )}
                          </div>
                        </div>
                      </div>


                      <button
                        type="submit"
                        disabled={isLoading ? true : false}
                        className="flex justify-center w-full mt-6 font-medium rounded bg-primary text-gray"
                      >
                        {!isLoading ? (<div className='p-4'> Save</div>) : (
                          <div className='ml-[-5%]'>
                            <InfinitySpin
                              width="110"
                              color="#fff"
                            />
                          </div>
                        )}
                      </button>

                    </form>
                  )}</Formik>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
export default Settings;