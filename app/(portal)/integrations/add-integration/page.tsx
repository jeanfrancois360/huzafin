import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";


import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Add integration",
    description: "Add integration",
};

const Integrations = () => {
    return (
        <>
            <Breadcrumb pageName="Integrations" />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    {/* <!-- Input Fields --> */}
                    <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Add new company
                            </h3>
                        </div>
                        <div className="flex flex-col gap-5.5 p-6.5">

                            <div className="grid grid-cols-2 gap-6">
                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Source Endpoint
                                    </label>
                                    <select className="relative z-20 w-full px-12 py-3 transition bg-transparent border rounded outline-none appearance-none border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                        <option selected disabled value="">--Select Endpoint--</option>
                                        <option value="">Option 1</option>
                                        <option value="">Option 2</option>
                                    </select>
                                </div>
                                <div className="block">
                                    <label className="block mb-3 text-black dark:text-white">
                                        Destination Endpoint
                                    </label>

                                    <select className="relative z-20 w-full px-12 py-3 transition bg-transparent border rounded outline-none appearance-none border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                        <option selected disabled value="">--Select Endpoint--</option>
                                        <option value="">Option 1</option>
                                        <option value="">Option 2</option>
                                    </select>
                                </div>
                            </div>
                            <div className="block">
                                <label className="block mb-3 text-black dark:text-white">
                                    Path(From-To)
                                </label>
                                <input
                                    disabled={true}
                                    type="text"
                                    placeholder="---"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
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

export default Integrations;
