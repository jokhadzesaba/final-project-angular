import { Plan } from './plan';
import { Request } from './request';

export interface Coach {
  nickName: string;
  email: string;
  password: string;
  id:string;
  profileImgUrl:string;
  description?: string;
  status?: string;
  bmi?: string;
  orm?: string;
  bmr?: string;
  totalLikes?:number;
  registrationDate:Date
  plans?: Plan[];
  requests?: Request[]; 
}
