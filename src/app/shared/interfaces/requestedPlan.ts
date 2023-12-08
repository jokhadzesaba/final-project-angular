import { Exercise } from "./exercise";
import { Plan } from "./plan";

export interface RequestedPlan{
    coachId:number;
    coachName:string,
    nickName:string,
    planName:string,
    description:string
    planId:string,
    exercises:Exercise[]
}