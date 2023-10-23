import { Exercise } from "./exercise";
import { Plan } from "./plan";
import { User } from "./user";

export interface Coach {
    name: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    age: string;
    password: string;
    id?: number;
    salary?: string;
    description?: string;
    plans?: Plan[];
    status?:string
  }
  
  
  
  
  
  
  