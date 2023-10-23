export interface Exercise {
    bodyPart: string;
    equipment: string;
    gifUrl: string;
    id: number;
    name: string;
    target: string;
    selected?: boolean;
    planName?:string
  }