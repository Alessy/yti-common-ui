import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-information-symbol',
  template: `<i *ngIf="infoText" class="fa fa-info-circle" [ngbTooltip]="infoText | translate"></i>`
})
export class InformationSymbolComponent {
  @Input() infoText: string;
}
