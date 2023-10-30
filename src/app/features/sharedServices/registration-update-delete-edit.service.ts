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
  public userAdded = new BehaviorSubject<User[]>([]);
  public coachAdded = new BehaviorSubject<Coach[]>([]);
  public users: User[] = [];
  public coaches: Coach[] = [];
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
    password: '',
    id: 0,
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
    return this.http.get<User[]>(`http://localhost:3000/users`);
  }

  loadCoaches(): Observable<Coach[]> {
    return this.http.get<Coach[]>(`http://localhost:3000/coaches`);
  }

  addUserOrCoaches(
    data: User | Coach,
    usersOrCoaches: 'users' | 'coaches'
  ): Observable<User | Coach> {
    return this.http
      .post<User | Coach>(`http://localhost:3000/${usersOrCoaches}`, data)
      .pipe(
        tap((newUserOrCoach: User | Coach) => {
          if (usersOrCoaches === 'users') {
            this.userAdded.next([
              ...this.userAdded.value,
              newUserOrCoach as User,
            ]);
          } else if (usersOrCoaches === 'coaches') {
            this.coachAdded.next([
              ...this.coachAdded.value,
              newUserOrCoach as Coach,
            ]);
          }
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  addPlan(
    data: Exercise[],
    userIdorCoach: number,
    planName: string,
    planDescription: string,
    planId: string,
    toWho: 'users' | 'coaches'
  ) {
    this.http
      .get<User>(`http://localhost:3000/${toWho}/${userIdorCoach}`)
      .subscribe({
        next: (user: User) => {
          const update = [
            ...user.plans!,
            {
              name: planName,
              description: planDescription,
              creatorId: userIdorCoach,
              exercises: data,
              planId: planId,
            },
          ];
          this.http
            .patch(`http://localhost:3000/${toWho}/${userIdorCoach}`, {
              plans: update,
            })
            .subscribe();
        },
        error: (error) => {
          return this.handleError(error);
        },
      });
  }
  getUserOrCoach(userId: number, who: 'users' | 'coaches'): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/${who}/${userId}`);
  }

  deletePlan(plan: Plan, userId: number, from: 'users' | 'coaches') {
    return this.http
      .get<User | Coach>(`http://localhost:3000/${from}/${userId}`)
      .pipe(
        switchMap((userOrCoach: User | Coach) => {
          const updatedPlans = userOrCoach.plans?.filter(
            (p) => p.planId !== plan.planId
          );
          return this.http
            .patch(`http://localhost:3000/${from}/${userId}`, {
              plans: updatedPlans,
            })
            .pipe(
              tap(() => {
                this.userAdded.next(
                  this.userAdded.value.map((user) => {
                    if (user.id === userId) {
                      return { ...user, plans: updatedPlans };
                    }
                    return user;
                  })
                );
              }),
              catchError((error) => {
                return this.handleError(error);
              })
            );
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

  deleteExercise(
    plan: Plan,
    exercise: Exercise,
    userId: number,
    from: 'users' | 'coaches'
  ) {
    return this.getUserOrCoach(userId, from).pipe(
      take(1),
      switchMap((user: User) => {
        const userPlan = user.plans?.find((p) => p.planId === plan.planId);
        if (userPlan) {
          userPlan.exercises = userPlan.exercises.filter(
            (e) => e.id !== exercise.id
          );
          return this.http
            .patch<User>(`http://localhost:3000/${from}/${userId}`, user);
        }
        return of(null);
      })
    );
  }

  deleteUserRequest(coachId: number, id: string) {
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

  deleteRequestedPlan(plan: RequestedPlan, userId: number, coachId: number) {
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
        this.users = users;
        this.coaches = coaches;
        const findUser = this.users.find(
          (user) => user.email === email && user.password === password
        );
        const findCoach = this.coaches.find(
          (coach) => coach.email === email && coach.password === password
        );
        if (findUser) {
          this.status.next('user');
          this.logged.next(true);
          this.loggedUser.next(findUser);
          return true;
        } else if (findCoach) {
          this.loggedUser.next(findCoach);
          this.status.next('coach');
          this.logged.next(true);
          return true;
        } else {
          this.status.next('still guest');
          return false;
        }
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  likePlan(plan: Plan, id: number) {
    return this.getUserOrCoach(id, 'users').pipe(
      take(1),
      tap((user: User) => {
        const ifAlredyLiked = user.likedPlans?.some(
          (e) => e.planId === plan.planId
        );
        if (user.likedPlans) {
          const updated = [...user.likedPlans!, plan];
          this.http
            .patch(`http://localhost:3000/users/${id}`, {
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

  unlikePlan(plan: Plan, id: number) {
    return this.getUserOrCoach(id, 'users').pipe(
      take(1),
      tap((user: User) => {
        const ifAlredyLiked = user.likedPlans?.some(
          (e) => e.planId === plan.planId
        );
        if (user.likedPlans) {
          const updated = user.likedPlans.filter(
            (likedPlan) => likedPlan.planId !== plan.planId
          );
          this.http
            .patch(`http://localhost:3000/users/${id}`, {
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
  updateOrder(user: User): Observable<User> {
    console.log(user.id);
    return this.http.put<User>(`http://localhost:3000/users/${user.id}`, user);
  }
  sendPlanRequest(
    userId: number,
    coachId: number,
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
    userId: number,
    coachId: number,
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
  searchLikedPlan(plan: Plan, userId: number) {
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
