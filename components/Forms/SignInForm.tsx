/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { Formik } from 'formik'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MsgText } from '../MsgText/MsgText'
import { ILogin } from '@/interfaces'
import axios from '../../axios'
import { redirect, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import * as Yup from 'yup';
import { Audio, InfinitySpin } from 'react-loader-spinner'

const SignInForm = () => {
    const router = useRouter()
    let initialValues: ILogin = {
        email: '',
        password: ''
    }

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

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

    const FormValidationSchema = Yup.object().shape({
        email: Yup.string().trim().required().email().label("Email"),
        password: Yup.string().trim().required().label("Password")
    })


    const handleLogin = async (payload: ILogin) => {
        const data = {
            email: payload.email,
            password: payload.password,
        }

        if (isLoading) {
            return
        }

        setIsLoading(true);
        setErrorMsg("")
        return await axios.post('/api/login', data).then((res) => {
            setIsLoading(false)
            if (res.data.status == true) {
                localStorage.setItem('access_token', JSON.stringify(res.data.data.token))
                localStorage.setItem('user', JSON.stringify(res.data.data.user))
                router.push('/invoice/generate-invoice')
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
            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleLogin}
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
                    <form onSubmit={handleSubmit} method="post">
                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    autoComplete={`${true}`}
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full py-4 pl-6 pr-10 bg-transparent border rounded-lg outline-none border-stroke focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />

                                <span className="absolute right-4 top-4">
                                    <svg
                                        className="fill-current"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g opacity="0.5">
                                            <path
                                                d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                                                fill=""
                                            />
                                        </g>
                                    </svg>
                                </span>
                            </div>
                            {touched.email && errors.email && (
                                <MsgText
                                    text={errors.email}
                                    textColor="danger"
                                />
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    autoComplete={`${true}`}
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full py-4 pl-6 pr-10 bg-transparent border rounded-lg outline-none border-stroke focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />

                                <span className="absolute right-4 top-4">
                                    <svg
                                        className="fill-current"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g opacity="0.5">
                                            <path
                                                d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                                                fill=""
                                            />
                                            <path
                                                d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                                                fill=""
                                            />
                                        </g>
                                    </svg>
                                </span>
                            </div>
                            {touched.password && errors.password && (
                                <MsgText
                                    text={errors.password}
                                    textColor="danger"
                                />
                            )}
                        </div>
                        <div className="mb-5">
                            <button
                                type="submit"
                                disabled={isLoading ? true : false}
                                className="flex justify-center w-full text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90"
                            >
                                {!isLoading ? (<div className='p-4'>Sign In</div>) : (
                                    <div className='ml-[-8%]'>
                                        <InfinitySpin
                                            width="110"
                                            color="#fff"
                                        />
                                    </div>
                                )}
                            </button>
                        </div>
                        <div className="mt-6 text-center">
                            <p>
                                Don’t have any account?{" "}
                                <Link href="/signup" className="text-primary">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </form>)}</Formik>
        </>
    )
}

export default SignInForm