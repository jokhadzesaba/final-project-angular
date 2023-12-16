import { Exercise } from "./exercise";
import { Plan } from "./plan";

export interface RequestedPlan{
    coachId:string;
    planName:string,
    description:string
    planId:string,
    exercises:Exercise[]
}