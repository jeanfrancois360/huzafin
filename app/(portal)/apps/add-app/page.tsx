import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CheckboxFive from "@/components/Checkboxes/CheckboxFive";
import CheckboxFour from "@/components/Checkboxes/CheckboxFour";
import CheckboxOne from "@/components/Checkboxes/CheckboxOne";
import CheckboxThree from "@/components/Checkboxes/CheckboxThree";
import CheckboxTwo from "@/components/Checkboxes/CheckboxTwo";
import SwitcherFour from "@/components/Switchers/SwitcherFour";
import SwitcherOne from "@/components/Switchers/SwitcherOne";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import SwitcherTwo from "@/components/Switchers/SwitcherTwo";

import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Form Elements Page | Next.js E-commerce Dashboard Template",
    description: "This is Form Elements page for TailAdmin Next.js",
    // other metadata
};

const Apps = () => {
    return (
        <>
            <Breadcrumb pageName="Apps" />
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    {/* <!-- Input Fields --> */}
                    <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Add new app
                            </h3>
                        </div>
                        <div className="flex flex-col gap-5.5 p-6.5">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter name"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>

                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Logo
                                    </label>
                                    <input
                                        type="file"
                                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                    />
                                </div>
                            </div>


                            <div>
                                <label className="block mb-3 text-black dark:text-white">
                                    Description
                                </label>
                                <textarea
                                    rows={6}
                                    placeholder="Enter description"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                ></textarea>
                            </div>
                            <button className="flex justify-center w-full p-3 font-medium rounded bg-primary text-gray">
                                Submit
                            </button>
                        </div>
                    </div>


                </div>


            </div>
        </>
    );
};

export default Apps;
