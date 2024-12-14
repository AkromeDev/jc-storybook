import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OCI18NModule } from '@oc-core/i18n';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {FormElementBase} from "../../data/form-element-base";

@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        OCI18NModule,
        ReactiveFormsModule,
        NgbTooltip
    ],
    providers: [],
    selector: 'oc-header-form',
    templateUrl: './header-form.component.html',
    styleUrls: ['./header-form.component.scss'],
})
export class HeaderFormComponent extends FormElementBase{

}
