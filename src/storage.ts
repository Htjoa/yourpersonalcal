const KEY='yourpersonalcal-editable-copy-v1';
export async function listCalendarEventsFn(){return JSON.parse(localStorage.getItem(KEY)||'[]')}
export async function createCalendarEventFn({data}:any){const events=await listCalendarEventsFn();const event={...data,id:crypto.randomUUID(),createdAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify([...events,event]));return event}
export async function deleteCalendarEventFn({data}:any){const events=await listCalendarEventsFn();localStorage.setItem(KEY,JSON.stringify(events.filter((e:any)=>e.id!==data.id)))}
export async function parseCalendarRequestFn(_:any):Promise<any>{throw new Error('AI scheduling requires the hosted Higgsfield backend.')}
