import { Exercise } from "./exercise";
import { Plan } from "./plan";

export interface RequestedPlan{
    coachId:number;
    coachName:string,
    coachLastName:string,
    nickName:string,
    planName:string,
    exercises:Exercise[]
}