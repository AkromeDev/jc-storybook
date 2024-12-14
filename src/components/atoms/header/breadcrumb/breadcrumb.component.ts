import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [
        CommonModule,
    ],
    providers: [],
    selector: 'oc-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
    @Input() breadcrumb: string[] = [];
    @Input() pageTitle = '';
}
