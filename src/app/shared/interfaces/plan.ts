import { Exercise } from "./exercise";
import { User } from "./user";

export interface Plan{
    name:string,
    exercises:Exercise[],
}