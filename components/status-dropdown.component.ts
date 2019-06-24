import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Placement as NgbPlacement } from '@ng-bootstrap/ng-bootstrap';
import {Status, selectableStatuses, restrictedStatuses} from '../entities/status';

export type Placement = NgbPlacement;

@Component({
  selector: 'app-status-dropdown',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StatusDropdownComponent),
    multi: true
  }],
  template: `
    <div ngbDropdown [placement]="placement">
      <button [id]="'selected_' + id" class="btn btn-dropdown" ngbDropdownToggle>
        <span>{{selection | translate}}</span>
      </button>

      <div ngbDropdownMenu>
        <button *ngFor="let option of options"
                [id]="option + '_' + id"
                (click)="select(option)"
                class="dropdown-item"
                [class.active]="isSelected(option)">
          {{option | translate}}
        </button>
      </div>
    </div>
  `
})
export class StatusDropdownComponent implements ControlValueAccessor {

  @Input() id: string;
  @Input() placement: Placement = 'bottom-left';
  @Input() restrict = false;
  @Input() isSuperUser = false;

  selection: Status;

  private propagateChange: (fn: any) => void = () => {};
  private propagateTouched: (fn: any) => void = () => {};

  allowedTargetStatusesFrom_INCOMPLETE = ['DRAFT'] as Status[];
  allowedTargetStatusesFrom_DRAFT = ['INCOMPLETE', 'VALID'] as Status[];
  allowedTargetStatusesFrom_VALID = ['RETIRED', 'INVALID'] as Status[];
  allowedTargetStatusesFrom_RETIRED = ['VALID', 'INVALID'] as Status[];
  allowedTargetStatusesFrom_INVALID = ['VALID', 'RETIRED'] as Status[];

  get options(): Status[] {

    if (this.restrict) {
      return restrictedStatuses;
    } else if (!this.isSuperUser) {
      if (this.selection === 'INCOMPLETE') {
        return this.allowedTargetStatusesFrom_INCOMPLETE;
      } else if (this.selection === 'DRAFT') {
        return this.allowedTargetStatusesFrom_DRAFT;
      } else if (this.selection === 'VALID') {
        return this.allowedTargetStatusesFrom_VALID;
      } else if (this.selection === 'RETIRED') {
        return this.allowedTargetStatusesFrom_RETIRED;
      } else if (this.selection === 'INVALID') {
        return this.allowedTargetStatusesFrom_INVALID;
      } else {
        return selectableStatuses; // should never come here anymore
      }
    } else {
      return selectableStatuses;
    }
  }

  isSelected(option: Status) {
    return this.selection === option;
  }

  select(option: Status) {
    this.selection = option;
    this.propagateChange(option);
  }

  writeValue(obj: any): void {
    this.selection = obj;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }
}
