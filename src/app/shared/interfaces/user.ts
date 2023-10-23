import { Exercise } from "./exercise";
import { Plan } from "./plan";

export interface User{
    name:string,
    lastname:string,
    email:string,
    phoneNumber:string,
    age:string,
    password:string,
    id?:number,
    plans?:Plan[],
    likedPlans?: Plan[];
    status?:string

}