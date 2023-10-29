import { Plan } from './plan';
import { Request } from './request';

export interface Coach {
  name: string;
  lastname: string;
  nickName: string;
  email: string;
  phoneNumber: string;
  age: string;
  password: string;
  id?: number;
  salary?: string;
  description?: string;
  plans?: Plan[];
  status?: string;
  bmi?: string;
  orm?: string;
  bmr?: string;
  requests?: Request[];
}
