import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { DisplayExercisesService } from './exercisesService/display-exercises.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RegistrationUpdateDeleteEditService } from '../sharedServices/registration-update-delete-edit.service';
import { Exercise } from 'src/app/shared/interfaces/exercise';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesComponent implements OnInit {
  bodyParts = [
    'waist',
    'upper legs',
    'back',
    'lower legs',
    'chest',
    'upper arms',
    'cardio',
    'shoulders',
    'lower arms',
    'neck',
  ];
  status = '';
  id = 0;
  planName: string = '';
  creatingPlan: boolean = false;
  updatingPlan: boolean = false;
  sortBodyPart: string = '';

  public exercises: { [key: string]: Exercise[] } = {};
  constructor(
    private exerciseService: DisplayExercisesService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private router: Router,
    public service: RegistrationUpdateDeleteEditService
  ) {}
  ngOnInit(): void {
    this.service.loggedUser.subscribe((res) => {
      this.status = res.status!;
      this.id = res.id!;
    });
  }
  showExercises() {
    this.bodyParts.forEach((bodyPart) => {
      this.exerciseService.getExercises(bodyPart).subscribe((data: any) => {
        this.exercises = { ...this.exercises, [bodyPart]: data };
        this.sortExercises(); 
        this.cd.detectChanges();
      });
    });
  }

  sortExercises() {
    if (this.sortBodyPart) {
      const filteredExercises: { [key: string]: Exercise[] } = {};
      filteredExercises[this.sortBodyPart] = this.exercises[this.sortBodyPart];
      this.exercises = filteredExercises;
    } else {
      this.bodyParts.forEach((bodyPart) => {
        if (this.exercises[bodyPart]) {
          this.exercises[bodyPart].sort((a, b) => a.name.localeCompare(b.name));
        }
      });
    }
  }

  startCreatingPlan(): void {
    this.creatingPlan = !this.creatingPlan;
  }
  getSelectedExercises() {
    const selectedExercises: Exercise[] = [];
    this.bodyParts.forEach((bodyPart) => {
      const exercises = this.exercises[bodyPart];
      exercises.forEach((exercise) => {
        if (exercise.selected) {
          exercise.selected = false;
          selectedExercises.push(exercise);
        }
      });
    });
    return selectedExercises;
  }
  createPlan() {
    const selectedExercises = this.getSelectedExercises();
    if (this.status === 'user') {
      this.service.addPlan(selectedExercises, this.id, this.planName, 'users');
    } else if (this.status === 'coach') {
      this.service.addPlan(
        selectedExercises,
        this.id,
        this.planName,
        'coaches'
      );
    }
    this.creatingPlan = false;
    this.planName = '';
  }
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  confirm() {
    const selectedExercises: Exercise[] = this.getSelectedExercises();
    this.service.addExercisesToPlan(selectedExercises, 'users', this.id);
    this.router.navigate(['/user-info']);
  }
}
