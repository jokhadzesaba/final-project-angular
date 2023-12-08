import { Plan } from './plan';
import { RequestedPlan } from './requestedPlan';

export interface User {
  name: string;
  lastname: string;
  nickName: string;
  email: string;
  phoneNumber: string;
  age: string;
  password: string;
  plans?: Plan[];
  likedPlans?: Plan[];
  status?: string;
  bmi?: string;
  orm?: string;
  bmr?: string;
  requestedPlans?: RequestedPlan[];
}
