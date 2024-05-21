import React from 'react'
import UserInfo from '@/components/UserInfo';

const page = (props) => {
    const currentId = props.params.symbol;
    return(
        <>
        <UserInfo symbol={currentId}/>
        </>
    )
}
export default page;

