import { Plan } from './plan';
import { Request } from './request';

export interface Coach {

  nickName: string;
  email: string;
  password: string;
  id:string;
  description?: string;
  plans?: Plan[];
  status?: string;
  bmi?: string;
  orm?: string;
  bmr?: string;
  requests?: Request[];
  profileImgUrl:string
}
