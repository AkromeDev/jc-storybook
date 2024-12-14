import {
    Component,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
    Renderer2,
    ElementRef,
    ContentChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OCI18NModule } from '@oc-core/i18n';

export type DropdownType = 'default' | 'native';
export type DropdownSize = 'sm' | 'md' | 'lg';

@Component({
    standalone: true,
    imports: [CommonModule, OCI18NModule],
    selector: 'oc-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent<T> {
    private activeDropdown: HTMLElement | null = null;
    private _data: T[] = [];

    @Output() selectionChange: EventEmitter<T> = new EventEmitter<T>();
    @Output() clearSelection: EventEmitter<T> = new EventEmitter<T>();

    @Input() maxVisibleItems = 5;
    @Input() hasClearButton = false;
    @Input() selection!: T;
    @Input() itemsTemplate?: TemplateRef<any>;
    @Input() selectionTemplate?: TemplateRef<any>;
    @Input() buttonTemplate?: TemplateRef<any>;
    @Input() type: DropdownType = 'default';
    @Input() size: DropdownSize = 'md';
    @Input() label?: string;
    @Input() variant: string = '';
    @Input() placeholder: string = 'Wählen Sie eine Option';
    @Input() useSelectionAsButton: boolean = true;

    @Input()
    set data(value: T[]) {
        this._data = value;
        // Warten auf den nächsten Change Detection Cycle
        setTimeout(() => {
            this.updateDropdownMaxHeight();
        });
    }

    get data(): T[] {
        return this._data;
    }

    @ContentChild('customMenuContent') customMenuContent?: TemplateRef<any>;

    protected getDisplayValue(item: T): string {
        if (item === null || item === undefined) {
            return '';
        }

        // Wenn item ein primitiver Wert ist
        if (typeof item !== 'object') {
            return String(item);
        }

        // Wenn item ein Objekt ist
        const possibleProps = [
            'descr',
            'description',
            'name',
            'label',
            'title',
            'value',
        ];
        for (const prop of possibleProps) {
            if (
                prop in item &&
                item[prop as keyof T] !== null &&
                item[prop as keyof T] !== undefined
            ) {
                const value = item[prop as keyof T];

                // Rekursiver Aufruf, falls der Wert selbst ein Objekt ist
                if (typeof value === 'object') {
                    return this.getDisplayValue(value as T);
                }

                return String(value);
            }
        }

        // Fallback: Prüfe auf toString-Methode
        if (
            typeof (item as any).toString === 'function' &&
            (item as any).toString !== Object.prototype.toString
        ) {
            return (item as any).toString();
        }

        // Wenn nichts gefunden wurde
        return '';
    }

    constructor(private renderer: Renderer2, private el: ElementRef) {}

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.setupDropdowns();
            this.updateDropdownMaxHeight();
            this.observeContentChanges();
        });
    }

    selectItem(item: T): void {
        this.selectionChange.emit(item);
    }

    onClearSelection(event: Event): void {
        event.stopPropagation();
        this.clearSelection.emit(this.selection);
    }

    private updateDropdownMaxHeight(): void {
        const dropdownMenus =
            this.el.nativeElement.querySelectorAll('.dropdown-menu');

        dropdownMenus.forEach((menu: HTMLElement) => {
            // Ersten dropdown-item finden und Höhe messen
            const firstItem = menu.querySelector('.dropdown-item') as HTMLElement;
            if (firstItem) {
                // Temporär sichtbar machen für korrekte Höhenmessung
                const originalDisplay = firstItem.style.display;
                firstItem.style.visibility = 'hidden';
                firstItem.style.display = 'flex';

                // Tatsächliche Höhe messen (inkl. padding und border)
                const itemHeight = firstItem.getBoundingClientRect().height;

                // Zurücksetzen
                firstItem.style.visibility = '';
                firstItem.style.display = originalDisplay;

                // CSS-Variablen setzen
                this.renderer.setStyle(
                    menu,
                    '--bs-dropdown-item-height',
                    `${itemHeight}px`
                );

                this.renderer.setStyle(
                    menu,
                    '--dropdown-max-items',
                    `${this.maxVisibleItems}`
                );

                // Gesamthöhe berechnen
                const itemCount = menu.querySelectorAll('.dropdown-item').length;
                const visibleItems = Math.min(itemCount, this.maxVisibleItems);
                const totalHeight = itemHeight * visibleItems;

                this.renderer.setStyle(
                    menu,
                    '--dropdown-total-height',
                    `${totalHeight}px`
                );
            }
        });
    }

    private setupDropdowns(): void {
        const dropdowns = this.el.nativeElement.querySelectorAll('[oc-dropdown]');
        dropdowns.forEach((dropdown: HTMLElement) => {
            const button = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            const items = dropdown.querySelectorAll('.dropdown-item');

            if (button instanceof HTMLElement && menu instanceof HTMLElement) {
                this.initializeDropdownValue(dropdown);

                this.renderer.listen(button, 'click', (event: Event) => {
                    event.stopPropagation();
                    this.toggleDropdown(dropdown, menu);
                });

                items.forEach((item: Element) => {
                    if (item instanceof HTMLElement) {
                        this.renderer.listen(item, 'click', (event: Event) => {
                            event.stopPropagation();
                            // Extrahiere das Item-Objekt aus dem data-item Attribut
                            const itemData = item.getAttribute('data-item');
                            if (itemData) {
                                try {
                                    const parsedItem = JSON.parse(itemData);
                                    this.selectItem(parsedItem);
                                } catch (e) {
                                    this.selectItem(itemData as unknown as T);
                                }
                            }
                            this.selectDropdownItem(dropdown, item);
                        });
                    }
                });
            }
        });

        this.renderer.listen('window', 'click', () => {
            if (this.activeDropdown) {
                this.closeDropdown(this.activeDropdown);
            }
        });
    }

    private initializeDropdownValue(dropdown: HTMLElement): void {
        const activeItem = dropdown.querySelector('.dropdown-item.active');
        const button = dropdown.querySelector('.dropdown-toggle');
        const valueSpan = button?.querySelector('.dropdown-value');
        if (activeItem instanceof HTMLElement && valueSpan instanceof HTMLElement) {
            valueSpan.textContent = activeItem.textContent;
        }
    }

    private toggleDropdown(dropdown: HTMLElement, menu: HTMLElement): void {
        if (this.activeDropdown && this.activeDropdown !== dropdown) {
            this.closeDropdown(this.activeDropdown);
        }

        const isOpen = menu.classList.contains('show');
        if (isOpen) {
            this.closeDropdown(dropdown);
        } else {
            this.openDropdown(dropdown, menu);
        }
    }

    private openDropdown(dropdown: HTMLElement, menu: HTMLElement): void {
        this.renderer.addClass(menu, 'show');
        this.renderer.setAttribute(
            dropdown.querySelector('.dropdown-toggle'),
            'aria-expanded',
            'true'
        );
        this.activeDropdown = dropdown;
    }

    private closeDropdown(dropdown: HTMLElement): void {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu instanceof HTMLElement) {
            this.renderer.removeClass(menu, 'show');
            this.renderer.setAttribute(
                dropdown.querySelector('.dropdown-toggle'),
                'aria-expanded',
                'false'
            );
        }
        if (this.activeDropdown === dropdown) {
            this.activeDropdown = null;
        }
    }

    private selectDropdownItem(dropdown: HTMLElement, item: HTMLElement): void {
        const button = dropdown.querySelector('.dropdown-toggle');
        const valueSpan = button?.querySelector('.dropdown-value');
        if (valueSpan instanceof HTMLElement) {
            valueSpan.textContent = item.textContent;
        }

        dropdown
            .querySelectorAll('.dropdown-item')
            .forEach((dropdownItem: Element) => {
                this.renderer.removeClass(dropdownItem, 'active');
            });

        this.renderer.addClass(item, 'active');

        this.closeDropdown(dropdown);
    }

    private observeContentChanges(): void {
        const config = { childList: true, subtree: true, characterData: true };
        const observer = new MutationObserver(() => {
            this.updateDropdownMaxHeight();
        });

        const dropdownMenus =
            this.el.nativeElement.querySelectorAll('.dropdown-menu');
        dropdownMenus.forEach((menu: HTMLElement) => {
            observer.observe(menu, config);
        });
    }
}
