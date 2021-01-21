import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'na-about',
    template: `<span class="greek about">Выполнил Колбёшин М.И ИВТ-42</span>`,
    styleUrls: ['./about.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
