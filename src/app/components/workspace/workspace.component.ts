import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'na-workspace',
    templateUrl: './workspace.component.html',
    styleUrls: ['./workspace.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
