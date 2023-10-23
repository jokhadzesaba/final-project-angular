import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, tap, switchMap } from 'rxjs';
import { Coach } from 'src/app/shared/interfaces/coach';
import { User } from 'src/app/shared/interfaces/user';
import { Exercise } from 'src/app/shared/interfaces/exercise';
import { map } from 'rxjs';
import { forkJoin } from 'rxjs';
import { Plan } from 'src/app/shared/interfaces/plan';
import { mergeMap } from 'rxjs';

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
  public selectedPlan:Plan | null = null
  public loggedUser: BehaviorSubject<User> = new BehaviorSubject<User|Coach>({
    name: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    age: '',
    password: '',
    id: 0,
    plans: [],
    status: '',
  });
  

  constructor(private http: HttpClient) {}
  addExercisesToPlan(exercises: Exercise[], toWho:'coaches'|'users', Id:number) {
    if (this.selectedPlan) {
      this.http.get<User>(`http://localhost:3000/${toWho}/${Id}`).subscribe({
        next: (userOrCoach: User|Coach) => {
          const planToUpdate = userOrCoach.plans!.find(plan => plan.name === this.selectedPlan!.name);
          if (planToUpdate) {
            planToUpdate.exercises = [...planToUpdate.exercises!, ...exercises];
            this.http.patch(`http://localhost:3000/${toWho}/${Id}`, { plans: userOrCoach.plans! }).subscribe();
          } else {
            console.log(`Plan with name ${this.selectedPlan!.name} not found.`);
          }
        },
        error: (error) => {
          console.log(error);     
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
        })
      );
  }
  addPlan(data: Exercise[], userId: number, planName: string, toWho:"users"|"coaches") {
    this.http.get<User>(`http://localhost:3000/${toWho}/${userId}`).subscribe({
      next: (user: User) => {
        const planExists = user.plans!.some(plan => plan.name === planName);
        if (!planExists){
        const update = [...user.plans!, { name: planName, plans: data }];
        this.http
          .patch(`http://localhost:3000/${toWho}/${userId}`, { plans: update })
          .subscribe();
      }else{
        alert("planName with this name already exists")
      }
    },
      error: (error) => {
        console.log(error);
        alert("something went wrong")
      },
    });
  }
  getUserOrCoach(userId: number, who:'users'|'coaches'): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/${who}/${userId}`);
  }


  deletePlan(plan: Plan, userId: number, from: 'users' | 'coaches'): Observable<any> {
    return this.http.get<User | Coach>(`http://localhost:3000/${from}/${userId}`).pipe(
      switchMap((userOrCoach: User | Coach) => {
        const updatedPlans = userOrCoach.plans?.filter((p) => p.name !== plan.name);
        return this.http.patch(`http://localhost:3000/${from}/${userId}`, { plans: updatedPlans }).pipe(
          tap(() => {
            this.userAdded.next(this.userAdded.value.map(user => {
              if (user.id === userId) {
                return {...user, plans: updatedPlans};
              }
              return user;
            }));
          })
        );
      })
    );
  }
  
  deleteExercise(plan: Plan, exercise: Exercise, userId: number, from: 'users' | 'coaches'): Observable<Object> {
    return this.http.get<User | Coach>(`http://localhost:3000/${from}/${userId}`).pipe(
      switchMap((userOrCoach: User | Coach) => {
        const updatedPlans = userOrCoach.plans?.map((p) => {
          if (p.name === plan.name) {
            const updatedExercises = p.exercises.filter((ex) => ex.id !== exercise.id);
            return { ...p, plans: updatedExercises };
          }
          return p;
        });
        return this.http.patch(`http://localhost:3000/${from}/${userId}`, { plans: updatedPlans }).pipe(
          tap(() => {
            this.userAdded.next(this.userAdded.value.map(user => {
              if (user.id === userId) {
                return {...user, plans: updatedPlans};
              }
              return user;
            }));
          })
        );
      })
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
      })
    );
  }
  likePlan(plan: Plan, id: number) {
    this.getUserOrCoach(id, 'users').subscribe((res: User) => {
      if (res.likedPlans) {
        const updated = [...res.likedPlans!, plan];
        this.http.patch(`http://localhost:3000/users/${id}`, { likedPlans: updated }).subscribe(()=>{

            this.loggedUser.next({...res, likedPlans: updated});
        this.loadCoaches().subscribe((coaches: Coach[]) => {
          coaches.forEach(coach => {
            const foundedPlan = coach.plans?.find(coachPlan => coachPlan.name === plan.name);
            if (foundedPlan) {
              const coachId = coach.id!;
              foundedPlan.likes = (foundedPlan.likes || 0) + 1;
              this.http.patch(`http://localhost:3000/coaches/${coachId}`, coach).subscribe();
            }
          });
        });
      });
    }
    });
  }
  
  unlikePlan(plan: Plan, id: number) {
    this.getUserOrCoach(id, 'users').subscribe((res: User) => {
      if (res.likedPlans) {
        const updated = res.likedPlans.filter(likedPlan => likedPlan.name !== plan.name);
        this.http.patch(`http://localhost:3000/users/${id}`, { likedPlans: updated }).subscribe(()=>{
          this.loggedUser.next({...res, likedPlans: updated});
        })
        
      }
      // .subscribe(() => {
      //   this.loggedUser.next({...res, likedPlans: updated});
        // this.loadCoaches().subscribe((coaches: Coach[]) => {
        //   coaches.forEach(coach => {
        //     const foundedPlan = coach.plans?.find(coachPlan => coachPlan.name === plan.name);
        //     if (foundedPlan && foundedPlan.likes! > 0) {
        //       const coachId = coach.id!;
        //       foundedPlan.likes -= 1;
        //       this.http.patch(`http://localhost:3000/coaches/${coachId}`, coach).subscribe();
        //     }
        //   });
        // });
      // });
    });
  }
  updateOrder(user: User): Observable<User> {
    console.log(user.id);
    
    return this.http.put<User>(`http://localhost:3000/users/${user.id}`, user);
  }
  
  
}


