import { Exercise } from "./exercise";
import { Plan } from "./plan";

export interface RequestedPlan{
    coachId:string;
    name:string,
    description:string
    planId:string,
    exercises:Exercise[]
}