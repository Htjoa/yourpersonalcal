import React from 'react';
export function Button({variant,size,iconOnly,start,children,...props}:any){return <button className={'local-button '+(variant||'')} {...props}>{start}{children}</button>}
export function Input({label,description,...props}:any){return <label className="local-field"><span>{label}</span><input {...props}/>{description&&<small>{description}</small>}</label>}
export function Textarea({label,description,...props}:any){return <label className="local-field"><span>{label}</span><textarea {...props}/>{description&&<small>{description}</small>}</label>}
export function Icon({as:Component,size,...props}:any){return <Component size={size==='sm'?16:20} {...props}/>}
