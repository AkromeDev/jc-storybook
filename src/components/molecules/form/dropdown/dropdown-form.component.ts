import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { NgbDropdownModule, NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { OCI18NModule } from '@oc-core/i18n';
import { FormElementSelection } from '../../../atoms/data/form-element-selection';
import { HeaderFormComponent } from '../../../atoms/header/form/header-form.component';
import {DropdownComponent} from "../../../atoms/dropdown/default/dropdown.component";

@Component({
    standalone: true,
    imports: [
        CommonModule,
        OCI18NModule,
        NgbDropdownModule,
        NgbTooltipModule,
        DropdownComponent,
        HeaderFormComponent
    ],
    providers: [],
    selector: 'oc-dropdown-form',
    templateUrl: './dropdown-form.component.html',
    styleUrls: ['./dropdown-form.component.scss']
})
export class DropdownFormComponent<T> extends FormElementSelection<T> implements OnInit{

    @Output() clearSelection: EventEmitter<T> = new EventEmitter<T>();

    @Input() data: T[] = [];
    @Input() itemsTemplate!: TemplateRef<any>;
    @Input() selectionTemplate!: TemplateRef<any>;

    protected onClearSelection(item: T): void {
        this.clearSelection.emit(item);
        if (this.formControlElement) {
            this.formControlElement.setValue(null);
        }
    }

    protected override getData(): T[] {
        return this.data;
    }

    protected onSelectionChanged(item: T): void {
        this.onInputChanged(item);
    }
}
