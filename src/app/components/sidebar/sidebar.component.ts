import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'na-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
