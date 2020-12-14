import React from 'react'
{/*Creamos un componente de casilla para verificacion*/ }
export const CheckBox = React.forwardRef(({ indeterminate,...rest },ref)=>{
    const defaultRef=React.useRef()
    const resolvedRef=ref || defaultRef

    React.useEffect(()=>{
        resolvedRef.current.indeterminate=indeterminate
    },[resolvedRef,indeterminate])

    return(
        <>
            <input type="checkbox" ref={resolvedRef} {...rest}/>
        </>
    )
} )