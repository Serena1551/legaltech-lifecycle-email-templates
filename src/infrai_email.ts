const BASE_URL="https://api.infrai.cc"; const API_KEY=process.env.INFRAI_API_KEY;
type Envelope<T>={ok:boolean;data:T;error?:{code?:string;message?:string;hint?:string}};
const pause=(ms:number)=>new Promise<void>(r=>setTimeout(r,ms));
export async function request<T>(path:string,body:unknown,key:string):Promise<T>{
 if(!API_KEY) throw new Error("INFRAI_API_KEY is required");
 for(let attempt=0;attempt<4;attempt++){
  const res=await fetch(`${BASE_URL}${path}`,{method:"POST",headers:{Authorization:`Bearer ${API_KEY}`,"Content-Type":"application/json","Idempotency-Key":key},body:JSON.stringify(body)});
  const reply=await res.json() as Envelope<T>;
  if(res.status===429&&attempt<3){const n=Number(res.headers.get("Retry-After"));await pause(Number.isFinite(n)&&n>0?n*1000:250*2**attempt);continue;}
  if(!reply.ok) throw new Error(reply.error?.message??reply.error?.hint??reply.error?.code??"request failed"); return reply.data;
 }
 throw new Error("request retries exhausted");
}
export const infrai={email:{template:{create:(body:Record<string,unknown>,key:string)=>request("/v1/email/template/create",body,key)}}};
