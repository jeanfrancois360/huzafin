"use client"
import { Formik, FieldArray } from 'formik'
import * as Yup from 'yup';
import React, { useEffect, useId, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { IInvoice, IPassword, IProfile } from '@/interfaces'
import axios from '../../../axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { ApiUrl } from '@/constants';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { MsgText } from '@/components/MsgText/MsgText';


const Profile = () => {
  let initialPasswordValues: IPassword = {
    old_password: "",
    new_password: "",
  }

  let initialProfileValues: IProfile = {
    name: "",
    email: "",
  }

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const user = typeof window !== "undefined" && window.JSON.parse(localStorage.getItem("user") || "");


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
    if (successMsg) {
      notify('success')
    }
  }, [successMsg])

  useEffect(() => {
    if (errorMsg) {
      notify('error')
    }
  }, [errorMsg])


  const PasswordFormValidationSchema = Yup.object().shape({
    old_password: Yup.string().trim().required().label("Old Password"),
    new_password: Yup.string().trim().required().label("New Password"),
  })

  const ProfileFormValidationSchema = Yup.object().shape({
    name: Yup.string().trim().required().label("Full Name"),
    email: Yup.string().trim().required().label("Email"),
  })


  const handleProfileUpdate = async (payload: IProfile) => {
    console.log({ payload })
    const data = {
      name: payload.name,
      email: payload.email,
    }

    if (isLoading) {
      return
    }

    setIsLoading(true);
    setErrorMsg("")
    return await axios.patch(`/api/user/update-profile/${user.id}`, data, {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('access_token') || ''),
      },
    }).then((res) => {
      setIsLoading(false)
      console.log({ res })

    }).catch((error: { response: { data: { message: any; }; }; message: any; }) => {
      setIsLoading(false);
      console.error(error.response?.data?.message);
      const errorMessage = error.response?.data?.message;
      setErrorMsg(errorMessage || error.message);
    })

  }

  const handlePasswordUpdate = async (payload: IPassword) => {
    console.log({ payload })
    const data = {
      old_password: payload.old_password,
      new_password: payload.new_password,
    }

    if (isLoading) {
      return
    }

    setIsLoading(true);
    setErrorMsg("")
    return await axios.patch(`/api/user/change-password/${user.id}`, data, {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('access_token') || ''),
      },
    }).then((res) => {
      setIsLoading(false)
      console.log({ res })

      if (res.data.data.includes("Password updated Successfully")) {
        setSuccessMsg(res.data.data)
        console.log(res.data.data)
      }
      else {
        console.log("Here")
      }
    }).catch((error) => {
      setIsLoading(false);
      console.error(error.response?.data?.message);
      const errorMessage = error.response?.data?.message;
      setErrorMsg(errorMessage || error.message);
    })

  }


  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Profile" />

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 xl:col-span-12">
            <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="py-4 border-b border-stroke px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <Formik
                  enableReinitialize
                  initialValues={initialProfileValues}
                  onSubmit={handleProfileUpdate}
                  validationSchema={ProfileFormValidationSchema}
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
                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                          <label
                            className="block mb-3 text-sm font-medium text-black dark:text-white"
                            htmlFor="fullName"
                          >
                            Full Name
                          </label>
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <svg
                                className="fill-current"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g opacity="0.8">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                    fill=""
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                    fill=""
                                  />
                                </g>
                              </svg>
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              placeholder="Enter your name"
                              name="name"
                              value={values.name = user.name || ""}
                              onChange={handleChange('name')}
                              onBlur={handleBlur('name')}
                              autoComplete={`${true}`}
                            />
                            {touched.name && errors.name && (
                              <MsgText text={errors.name} textColor="danger" />
                            )}
                          </div>
                        </div>

                        <div className="w-full sm:w-1/2">
                          <label
                            className="block mb-3 text-sm font-medium text-black dark:text-white"
                            htmlFor="emailAddress"
                          >
                            Email Address
                          </label>
                          <div className="relative">
                            <span className="absolute left-4.5 top-4">
                              <svg
                                className="fill-current"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g opacity="0.8">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                                    fill=""
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                                    fill=""
                                  />
                                </g>
                              </svg>
                            </span>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="email"
                              id="emailAddress"
                              name="email"
                              value={values.email = user.email || ""}
                              onChange={handleChange('email')}
                              onBlur={handleBlur('email')}
                              autoComplete={`${true}`}
                            />
                            {touched.email && errors.email && (
                              <MsgText text={errors.email} textColor="danger" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-4.5">

                        <button
                          className="flex justify-center px-6 py-2 font-medium rounded bg-primary text-gray hover:bg-opacity-95"
                          type="submit"
                          disabled={isLoading ? true : false}
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  )}</Formik>
              </div>
            </div>
          </div>
          <div className="col-span-12 xl:col-span-12">
            <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="py-4 border-b border-stroke px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Change Password
                </h3>
              </div>
              <div className="p-7">
                <Formik
                  enableReinitialize
                  initialValues={initialPasswordValues}
                  onSubmit={handlePasswordUpdate}
                  validationSchema={PasswordFormValidationSchema}
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
                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                          <label
                            className="block mb-3 text-sm font-medium text-black dark:text-white"
                            htmlFor="fullName"
                          >
                            Old Password
                          </label>
                          <div className="relative">
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="password"
                              id="old_password"
                              name="old_password"
                              value={values.old_password || ""}
                              onChange={handleChange('old_password')}
                              onBlur={handleBlur('old_password')}
                              autoComplete={`${true}`}
                            />
                            {touched.old_password && errors.old_password && (
                              <MsgText text={errors.old_password} textColor="danger" />
                            )}
                          </div>
                        </div>

                        <div className="w-full sm:w-1/2">
                          <label
                            className="block mb-3 text-sm font-medium text-black dark:text-white"
                            htmlFor="fullName"
                          >
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="password"
                              id="ne"
                              name="new_password"
                              value={values.new_password || ""}
                              onChange={handleChange('new_password')}
                              onBlur={handleBlur('new_password')}
                              autoComplete={`${true}`}
                            />
                            {touched.new_password && errors.new_password && (
                              <MsgText text={errors.new_password} textColor="danger" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-4.5">

                        <button
                          className="flex justify-center px-6 py-2 font-medium rounded bg-primary text-gray hover:bg-opacity-95"
                          type="submit"
                          disabled={isLoading ? true : false}
                        >
                          Save
                        </button>
                      </div>
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
export default Profile;