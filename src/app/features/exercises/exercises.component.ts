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
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../sharedServices/shared.service';
import { Observable } from 'rxjs';
import { Coach } from 'src/app/shared/interfaces/coach';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesComponent implements OnInit {
  bodyParts = [
    'waist',
    'upperLegs',
    'back',
    'lowerLegs',
    'chest',
    'upperArms',
    'cardio',
    'shoulders',
    'lowerArms',
    'neck',
  ];
  status = '';
  id?: number;
  planName: string = '';
  planDescription: string = '';
  creatingPlan: boolean = false;
  makingPlanForUser: boolean = false;
  sortBodyPart: string = '';
  loggedObservable?: Observable<User | Coach>;
  public addingExercise?: boolean;

  public exercises: { [key: string]: Exercise[] } = {};
  constructor(
    private exerciseService: DisplayExercisesService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private router: Router,
    public service: RegistrationUpdateDeleteEditService,
    public sharedService: SharedService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.loggedObservable = this.service.loggedUser;
    this.showExercises();
    this.service.loggedUser.subscribe((res) => {
      this.status = res.status!;
    });
    this.sharedService.creatingPlan$.subscribe((value) => {
      this.creatingPlan = value;
    });
    this.sharedService.addingExercise$.subscribe((value) => {
      this.addingExercise = value;
    });
    this.sharedService.makingPlanForUser$.subscribe((value) => {
      this.makingPlanForUser = value;
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
    this.makingPlanForUser = false;
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
    const planId = this.sharedService.generateUniqueId(5);
    if (this.status === 'user') {
      this.service.addPlan(
        selectedExercises,
        this.planName,
        this.planDescription,
        planId,
        'users'
      );
    } else if (this.status === 'coach') {
      this.service.addPlan(
        selectedExercises,
        this.planName,
        this.planDescription,
        planId,
        'coaches'
      );
    }
    this.creatingPlan = false;
    this.planName = '';
    this.planDescription = '';
  }
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  confirm() {
    const selectedExercises: Exercise[] = this.getSelectedExercises();
    this.service.addExercisesToPlan(selectedExercises, 'users', this.id!);
    this.sharedService.ifchanged(true);
    this.router.navigate(['/user-info']);
    this.sharedService.addexercise(false);
  }
  creatingPlanForCertainUser() {
    const selectedExercises: Exercise[] = this.getSelectedExercises();
    this.route.queryParams.subscribe((params) => {
      const userId = String(params['userId']);
      const coachId = String(params['coachId']);
      const nickName = params['nickName'];
      const requestId = params['requestId'];
      this.service.sendPlanToUser(
        userId,
        coachId,
        nickName,
        this.planName,
        requestId,
        this.planDescription,
        selectedExercises
      );
      
      this.sharedService.setCreatingPlan(false);
      this.sharedService.makingplanForUser(false);
      this.router.navigate([`/single-coach-info/${this.service.firebaseId}`]);
    });
  }
}
