import { Exercise } from "./exercise";
import { Plan } from "./plan";

export interface RequestedPlan{
    coachId:number;
    coachName:string,
    coachLastName:string,
    nickName:string,
    planName:string,
    description:string
    planId:string,
    exercises:Exercise[]
}