import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'finalProject';
  exercise = {
    "bodyPart": "upper arms",
    "equipment": "band",
    "gifUrl": "https://zyla-marketplace.s3.amazonaws.com/api-exercise/exercise_43.gif",
    "id": 43,
    "name": "band alternating biceps curl",
    "target": "biceps"
  };
}
