import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent implements OnInit {
  public urls: string[] = [
    'assets/exer1.jpg',
    'assets/exer2.jpg',
    'assets/exer3.jpg',
    'assets/welcomePagePhoto.jpg',
  ];
  public currentItem = 'assets/exer1.jpg';
  constructor(private cd: ChangeDetectorRef) {}
  ngOnInit() {
    this.displayItems();
  }
  displayItems() {
    let index = 0;
    const itemsInterval = interval(2500);

    itemsInterval.subscribe(() => {
      this.currentItem = this.urls[index];
      index = (index + 1) % this.urls.length;
      console.log(this.urls[index]);

      this.cd.detectChanges();
    });
  }
}
