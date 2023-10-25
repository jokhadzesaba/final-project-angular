import { Exercise } from "./exercise";
import { Plan } from "./plan";
import { RequestedPlan } from "./requestedPlan";

export interface User{
    name:string,
    lastname:string,
    nickName:string,
    email:string,
    phoneNumber:string,
    age:string,
    password:string,
    id?:number,
    plans?:Plan[],
    likedPlans?: Plan[];
    status?:string
    requestedPlans?:RequestedPlan[]

}