import React from 'react'
import { BiInfoCircle } from 'react-icons/bi';

export const MsgText = ({ text, textColor }: { text: string, textColor: string }) => {
    let dangerStyle = ""
    return (
        <>
            <small className={`flex items-center my-2 ${textColor === 'danger' ? 'text-[#ff416c]' : 'text-[#22c55e]'} `}>
                <BiInfoCircle className='mr-2' size={15} />
                <i>{text}</i>
            </small>
        </>
    );
};