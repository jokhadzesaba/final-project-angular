import { Exercise } from "./exercise";
import { User } from "./user";

export interface Plan{
    name:string,
    likes: number;
    likedBy:User[],
    exercises:Exercise[],
}