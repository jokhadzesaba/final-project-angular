import { Exercise } from "./exercise";
import { User } from "./user";

export interface Plan{
    name:string,
    description:string
    planId:string,
    creatorId?:string,
    exercises:Exercise[],
    likes?:number,
    creationDate:Date,
    planImg:string,
}