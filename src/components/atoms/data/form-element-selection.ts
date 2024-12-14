
import { FormElementBase } from './form-element-base';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive()
export abstract class FormElementSelection<T> extends FormElementBase{

    @Input() permissions: string[] = [];

    @Input() onSelectionChangedCustom?: (value: T, control: FormControl) => void;
    @Input() onFormValueChangedCustom?: (value: T, pool: T[]) => T;
    @Input() selection : T | undefined;

    @Output() selectionChange: EventEmitter<T> = new EventEmitter<T>();

    protected abstract getData(): T[];

    override ngOnInit() {
        super.ngOnInit();
        this.control.valueChanges.subscribe((newValue) => { this.onFormInputChanged(newValue)});
    }

    protected onFormInputChanged(value: T): void {
        if(this.onFormValueChangedCustom){
            this.selection = this.onFormValueChangedCustom(value, this.getData());
        }else
            this.selection = value;
    }

    protected onInputChanged(value: T){
        this.selection = value;
        if(this.onSelectionChangedCustom){
            this.onSelectionChangedCustom(value, this.control);
        }else {
            this.control.patchValue(value);
        }
        this.selectionChange.emit(value);
    }
}
