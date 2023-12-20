import { Plan } from './plan';
import { RequestedPlan } from './requestedPlan';

export interface User {
  nickName: string;
  email: string;
  password: string;
  id:string;
  plans?: Plan[];
  likedPlans?: Plan[];
  status?: string;
  bmi?: string;
  orm?: string;
  bmr?: string;
  requestedPlans?: RequestedPlan[];
  profileImgUrl:string
  registrationDate:Date
}
