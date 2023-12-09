import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  tap,
  switchMap,
  catchError,
  throwError,
  take,
  of,
} from 'rxjs';
import { Coach } from 'src/app/shared/interfaces/coach';
import { User } from 'src/app/shared/interfaces/user';
import { Exercise } from 'src/app/shared/interfaces/exercise';
import { map } from 'rxjs';
import { forkJoin } from 'rxjs';
import { Plan } from 'src/app/shared/interfaces/plan';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/shared/sharedComponent/error-page/service/error.service';
import { RequestedPlan } from 'src/app/shared/interfaces/requestedPlan';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrationUpdateDeleteEditService {
  public url = 'https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app';
  public userAdded = new BehaviorSubject<User[]>([]);
  public coachAdded = new BehaviorSubject<Coach[]>([]);
  public firebaseId: string = '';
  public status: BehaviorSubject<string> = new BehaviorSubject('guest');
  public logged: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public selectedPlan: Plan | null = null;
  public loggedUser: BehaviorSubject<User> = new BehaviorSubject<User | Coach>({
    name: '',
    nickName: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    age: '',
    id:'',
    password: '',
    plans: [],
    status: 'guest',
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorService: ErrorService,
    private shared: SharedService
  ) {}
  addExercisesToPlan(
    exercises: Exercise[],
    toWho: 'coaches' | 'users',
    Id: number
  ) {
    if (this.selectedPlan) {
      this.http.get<User>(`http://localhost:3000/${toWho}/${Id}`).subscribe({
        next: (userOrCoach: User | Coach) => {
          const planToUpdate = userOrCoach.plans!.find(
            (plan) => plan.planId === this.selectedPlan!.planId
          );
          if (planToUpdate) {
            planToUpdate.exercises = [...planToUpdate.exercises!, ...exercises];
            this.http
              .patch(`http://localhost:3000/${toWho}/${Id}`, {
                plans: userOrCoach.plans!,
              })
              .subscribe();
          } else {
            console.log(`Plan with id ${this.selectedPlan!.planId} not found.`);
          }
        },
        error: (error) => {
          return this.handleError(error);
        },
      });
    }
  }

  loadUsers(): Observable<User[]> {
    return this.http.get<User[]>(
      `https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app/users.json`
    );
  }

  loadCoaches(): Observable<Coach[]> {
    return this.http.get<Coach[]>(
      `https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app/coaches.json`
    );
  }

  addUserOrCoaches(data: User | Coach, usersOrCoaches: 'users' | 'coaches') {
    this.http
      .post(
        `https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app/${usersOrCoaches}.json`,
        data
      )
      .subscribe();
  }

  addPlan(
    data: Exercise[],
    planName: string,
    planDescription: string,
    planId: string,
    toWho: 'users' | 'coaches'
  ) {
    this.http.get<User>(`${this.url}/${toWho}/${this.firebaseId}.json`).subscribe({
      next: (user: User | Coach) => {
        const update = [
          ...user.plans!,
          {
            name: planName,
            description: planDescription,
            creatorId: user.id,
            exercises: data,
            planId: planId,
          },
        ];
        this.http
          .patch(`${this.url}/${toWho}/${this.firebaseId}.json`, {
            plans: update,
          })
          .subscribe();
      },
      error: (error) => {
        return this.handleError(error);
      },
    });
  }
  getUserOrCoach(userId: string, who: 'users' | 'coaches'): Observable<User> {
    return this.http.get<User>(
      `https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json`
    );
  }

  deletePlan(
    plan: Plan,
    from: 'users' | 'coaches',
    planType: 'liked' | 'personal'
  ) {
    return this.http
      .get<User | Coach>(`${this.url}/${from}/${this.firebaseId}.json`)
      .pipe(
        switchMap((userOrCoach: User | Coach) => {
          if (planType === 'personal') {
            const updatedPlans = Object.values(userOrCoach.plans!).filter(
              (p) => p.planId !== plan.planId
            );
              return this.http.patch(`${this.url}/${from}/${this.firebaseId}.json`, {
              plans: updatedPlans,
            });
          } else {
            const updatedPlans = Object.values((userOrCoach as User).likedPlans!).filter(
              (p) => p.planId !== plan.planId
            );
            return this.http.patch(`${this.url}/${from}/${this.firebaseId}.json`, {
              likedPlans: updatedPlans,
            });
          }
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }
  handleError(error: Error) {
    console.log(error);
    this.errorService.changeMessage(error.message);
    this.router.navigate(['/error']);
    return throwError(error);
  }

  deleteExercise(plan: Plan, exercise: Exercise, from: 'users' | 'coaches') {
    return this.getUserOrCoach(this.firebaseId, from).pipe(
      take(1),
      switchMap((user: User) => {
        const userPlan = Object.values(user.plans!).find(
          (p) => p.planId === plan.planId
        );
        if (userPlan) {
          userPlan.exercises = Object.values(userPlan.exercises).filter(
            (e) => e.id !== exercise.id
          );
          return this.http.patch<User>(
            `${this.url}/${from}/${this.firebaseId}.json`,
            user
          );
        }
        return of(null);
      })
    );
  }

  deleteUserRequest(coachId: string, id: string) {
    return this.getUserOrCoach(coachId, 'coaches').pipe(
      take(1),
      tap((coach: Coach) => {
        const updateRequest = coach.requests?.filter((req) => req.id !== id);
        this.http
          .patch(`http://localhost:3000/coaches/${coachId}`, {
            requests: updateRequest,
          })
          .subscribe();
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  deleteRequestedPlan(plan: RequestedPlan, userId: string, coachId: number) {
    this.getUserOrCoach(userId, 'users').subscribe(
      (user: User) => {
        const updatedPlans = user.requestedPlans?.filter(
          (p) => p.planId !== plan.planId
        );
        this.http
          .patch(`http://localhost:3000/users/${userId}`, {
            requestedPlans: updatedPlans,
          })
          .subscribe();
      },
      (error) => {
        return this.handleError(error);
      }
    );
  }

  getInfo(email: string, password: string): Observable<boolean> {
    return forkJoin([this.loadUsers(), this.loadCoaches()]).pipe(
      map(([users, coaches]) => {
        const foundUser = Object.entries(users).find(
          ([key, user]) => user.email === email && user.password === password
        );
        const foundCoach = Object.entries(coaches).find(
          ([key, coach]) => coach.email === email && coach.password === password
        );
        if (foundUser) {
          const [userKey, userData] = foundUser;
          this.status.next('user');
          this.logged.next(true);
          this.loggedUser.next(userData);
          this.firebaseId = userKey;
          return true;
        } else if (foundCoach) {
          const [coachKey, coachData] = foundCoach;
          this.status.next('coach');
          this.logged.next(true);
          this.loggedUser.next(coachData);
          this.firebaseId = coachKey;
          return true;
        }
        return false;
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  likePlan(plan: Plan) {
    return this.getUserOrCoach(this.firebaseId, 'users').pipe(
      take(1),
      tap((user: User) => {
        if (user.likedPlans) {
          const updated = [...Object.values(user.likedPlans), plan];
          this.http
            .patch(`${this.url}/users/${this.firebaseId}.json`, {
              likedPlans: updated,
            })
            .subscribe();
        }
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  unlikePlan(plan: Plan) {
    return this.getUserOrCoach(this.firebaseId, 'users').pipe(
      take(1),
      tap((user: User) => {
        if (user.likedPlans) {
          console.log(user.likedPlans);

          const updated = Object.values(user.likedPlans).filter(
            (likedPlan) => likedPlan.planId !== plan.planId
          );
          this.http
            .patch(`${this.url}/users/${this.firebaseId}.json`, {
              likedPlans: updated,
            })
            .subscribe();
        }
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }
  // updateOrder(user: User): Observable<User> {
  //   return this.http.put<User>(`http://localhost:3000/users/${user.id}`, user);
  // }
  sendPlanRequest(
    userId: string,
    coachId: string,
    description: string,
    id: string
  ) {
    this.getUserOrCoach(coachId, 'coaches').subscribe((res: Coach) => {
      const updatedRequests = [
        ...res.requests!,
        { userId: userId, description: description, id: id },
      ];
      this.http
        .patch(`http://localhost:3000/coaches/${coachId}`, {
          requests: updatedRequests,
        })
        .subscribe();
    });
  }
  sendPlanToUser(
    userId: string,
    coachId: string,
    coachName: string,
    coachLastName: string,
    nickName: string,
    planName: string,
    requestId: string,
    description: string,
    exercises: Exercise[]
  ) {
    this.getUserOrCoach(userId, 'users').subscribe((res: User) => {
      const updatedRequestedPlans = [
        ...res.requestedPlans!,
        {
          coachId: coachId,
          coachName: coachName,
          coachLastName: coachLastName,
          exercises: exercises,
          nickName: nickName,
          planName: planName,
          description: description,
          planId: requestId,
        },
      ];
      this.http
        .patch(`http://localhost:3000/users/${userId}`, {
          requestedPlans: updatedRequestedPlans,
        })
        .subscribe();
    });
  }
  searchLikedPlan(plan: Plan, userId: string) {
    return this.getUserOrCoach(userId, 'users').pipe(
      map((user: User) => {
        const ifLiked = user.likedPlans?.find((e) => e.planId === plan.planId);
        if (ifLiked) {
          return true;
        }
        return false;
      })
    );
  }
}
