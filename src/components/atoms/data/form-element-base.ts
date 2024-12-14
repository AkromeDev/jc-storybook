import { Directive, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';

@Directive()
export abstract class FormElementBase implements OnInit{

    @Input() formControlElement: AbstractControl  | null = null;
    @Input() header = "";
    @Input() errorText = "";
    @Input() popupError = true;
    @Input() coloredErrorLabel = false;
    protected isRequiredControl = false;

    ngOnInit(): void {
        this.isRequiredControl = this.formControlElement?.hasValidator(Validators.required) || false;
        this.prefillValue(this.control);
    }

    protected prefillValue(control: FormControl){

    }

    get control(): FormControl {
        if (!this.formControlElement || !(this.formControlElement instanceof FormControl))
            throw new Error(this.constructor.name + " '" + this.header + "' is null or not a FormControl instance");
        return this.formControlElement;
    }
}
