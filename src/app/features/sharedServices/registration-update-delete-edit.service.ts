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
  public url =
    'https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app';
  public userAdded = new BehaviorSubject<User[]>([]);
  public coachAdded = new BehaviorSubject<Coach[]>([]);
  public firebaseId: string = '';
  public status: BehaviorSubject<string> = new BehaviorSubject('guest');
  public selectedPlan: Plan | null = null;
  public loggedUser: BehaviorSubject<User | Coach> = new BehaviorSubject<
    User | Coach
  >({
    nickName: '',
    email: '',
    id: '',
    password: '',
    plans: [],
    status: 'guest',
    profileImgUrl: '',
    registrationDate:new Date(),
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
    mainTarget:string,
    planId: string,
    toWho: 'users' | 'coaches'
  ) {
    this.http
      .get<User>(`${this.url}/${toWho}/${this.firebaseId}.json`)
      .subscribe({
        next: (user: User | Coach) => {
          const update = [
            ...user.plans!,
            {
              name: planName,
              description: planDescription,
              creatorId: user.id,
              exercises: data,
              planId: planId,
              planImg:`assets/targets/${mainTarget}.jpg`,
              likes:0,
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
      `https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app/${who}/${userId}.json`
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
            return this.http.patch(
              `${this.url}/${from}/${this.firebaseId}.json`,
              {
                plans: updatedPlans,
              }
            );
          } else {
            const updatedPlans = Object.values(
              (userOrCoach as User).likedPlans!
            ).filter((p) => p.planId !== plan.planId);
            return this.http.patch(
              `${this.url}/${from}/${this.firebaseId}.json`,
              {
                likedPlans: updatedPlans,
              }
            );
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

  deleteUserRequest(id: string) {
    return this.getUserOrCoach(this.firebaseId, 'coaches').pipe(
      take(1),
      tap((coach: Coach) => {
        const updateRequest = coach.requests?.filter(
          (req) => req.requestId !== id
        );
        this.http
          .patch(`${this.url}/coaches/${this.firebaseId}.json`, {
            requests: updateRequest,
          })
          .subscribe();
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  deleteRequestedPlan(plan: RequestedPlan) {
    return this.getUserOrCoach(this.firebaseId, 'users').pipe(
      switchMap((user: User) => {
        const updatedPlans = user.requestedPlans?.filter(
          (p) => p.planId !== plan.planId
        );
        return this.http.patch(`${this.url}/users/${this.firebaseId}.json`, {
          requestedPlans: updatedPlans,
        });
      }),
      catchError((error) => {
        return this.handleError(error);
      })
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
          this.loggedUser.next(userData);
          this.firebaseId = userKey;
          return true;
        } else if (foundCoach) {
          const [coachKey, coachData] = foundCoach;
          this.status.next('coach');
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

  likePlan(plan: Plan, coachId:string) {
    return this.getUserOrCoach(this.firebaseId, 'users').pipe(
      take(1),
      tap((user: User) => {
        if (user.likedPlans) {
          const updated = [...Object.values(user.likedPlans), plan];
          this.http
            .patch(`${this.url}/users/${this.firebaseId}.json`, {
              likedPlans: updated,
            })
            .subscribe(()=>{
              this.loadCoaches().subscribe((coaches:Coach[])=>{
                const foundCoach = Object.entries(coaches).find(
                  ([key, coach]) => coach.id === coachId
                );                
                if (foundCoach) {
                  const [firebaseId, value] = foundCoach
                  const updatedPlans = value.plans!.map((coachPlan) =>
                    coachPlan.planId === plan.planId ? { ...coachPlan, likes: coachPlan.likes! + 1 } : coachPlan
                  );
                  this.http.patch(`${this.url}/coaches/${firebaseId}.json`, {
                    plans: updatedPlans,
                  }).subscribe(()=>{
                    this.calculateTotalLikes(firebaseId)
                  }); 
                }
              })
            });     
        }
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  unlikePlan(plan: Plan,coachId:string) {
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
            .subscribe(()=>{
              this.loadCoaches().subscribe((coaches:Coach[])=>{
                const foundCoach = Object.entries(coaches).find(
                  ([key, coach]) => coach.id === coachId
                );                
                if (foundCoach) {
                  const [firebaseId, value] = foundCoach
                  const updatedPlans = value.plans!.map((coachPlan) =>
                    coachPlan.planId === plan.planId ? { ...coachPlan, likes: coachPlan.likes! - 1 } : coachPlan
                  );
                  this.http.patch(`${this.url}/coaches/${firebaseId}.json`, {
                    plans: updatedPlans,
                  }).subscribe(()=>{
                    this.calculateTotalLikes(firebaseId)
                  }); 
                }
              })
            });
        }
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }
  calculateTotalLikes(firebaseId:string){
    this.getUserOrCoach(firebaseId, "coaches").subscribe((coach:Coach)=>{
      const totalLikes = coach.plans?.reduce((accumulator,cur) =>{
        return accumulator + cur.likes!;
      }, 0)
      this.http.patch(`${this.url}/coaches/${firebaseId}.json`, {totalLikes:totalLikes}).subscribe()
    })
  }
  // updateOrder(user: User): Observable<User> {
  //   return this.http.put<User>(`http://localhost:3000/users/${user.id}`, user);  needs fix
  // }
  sendPlanRequest(
    userId: string,
    coachId: string,
    description: string,
    requestId: string
  ) {
    this.getUserOrCoach(coachId, 'coaches').subscribe((res: Coach) => {
      const updatedRequests = [
        ...res.requests!,
        { userId: userId, description: description, requestId: requestId },
      ];
      this.http
        .patch(`${this.url}/coaches/${coachId}.json`, {
          requests: updatedRequests,
        })
        .subscribe();
    });
  }
  sendPlanToUser(
    userId: string,
    coachId: string,
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
          exercises: exercises,
          nickName: nickName,
          planName: planName,
          description: description,
          planId: requestId,
        },
      ];
      this.http
        .patch(`${this.url}/users/${userId}.json`, {
          requestedPlans: updatedRequestedPlans,
        })
        .subscribe();
    });
  }
  changePrfileImg(url: string, whose: 'coaches' | 'users') {
    return this.http.patch(`${this.url}/${whose}/${this.firebaseId}.json`, {
      profileImgUrl:url,
    });
  }
}
