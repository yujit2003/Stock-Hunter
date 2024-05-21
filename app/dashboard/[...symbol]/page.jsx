import React from 'react'
import UserInfo from '@/components/UserInfo';

const page = (props) => {
    const currentId = props.params.symbol;
    return(
        <div className='bg-stone-900 h-[100vh] text-white'>
        <UserInfo symbol={currentId}/>
        </div>
    )
}
export default page;

