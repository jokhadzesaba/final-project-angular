import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ErrorService } from './service/error.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorPageComponent implements OnInit, OnChanges {
  public errorMessage?: string;

  constructor(private errorService: ErrorService) { }

  ngOnInit() {
    this.errorService.currentMessage.subscribe((message:string) => this.errorMessage = message);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['errorMessage']) {
      this.errorMessage = changes['errorMessage'].currentValue;
    }
  }
}
