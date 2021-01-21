import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    HostListener,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { WorkspaceService } from '../../../services/workspace.service';
import { Subscription } from 'rxjs';
import { xAxisTickLabelFormatterFn } from '../../../utils/highcharts-formatters';
import { screenSizeOption } from '../../../utils/highcharts-option-samples';
declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

@Component({
    selector: 'na-chart-container',
    templateUrl: './chart-container.component.html',
    styleUrls: ['./chart-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartContainerComponent implements OnInit {
    private updateAllowed = false;
    private screenHeight;

    public options: any = {
        chart: {
            type: 'spline',
            zoomType: 'xy',
            height: this.screenHeight,
        },
        title: {
            text: 'Sample Scatter Plot',
        },
        credits: {
            enabled: false,
        },
        tooltip: {
            formatter: function () {
                return `(${this.x.toFixed(2)}; ${this.y})`;
            },
        },
        xAxis: {
            type: 'linear',
            tickInterval: Math.PI / 2,
            // tickPositions: [] TODO
            labels: {
                formatter: xAxisTickLabelFormatterFn,
            },
        },
        plotOptions: {
            series: {
                lineWidth: 1,
                states: {
                    hover: {
                        enabled: false,
                    },
                },
            },
        },
        series: [
            {
                name: 'Origin',
                turboThreshold: 500000,
                data: [[new Date('2018-01-25 18:38:31').getTime(), 2]],
                // lineColor: Highcharts.getOptions().colors[1],
                marker: {
                    enabled: true,
                    radius: 0,
                },
                threshold: null,
            },
        ],
    };

    masterSub = new Subscription();

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
      this.screenHeight = window.innerHeight;
      this.updateChart(screenSizeOption(this.screenHeight));
    }

    constructor(private workspaceService: WorkspaceService) {
        this.getScreenSize();
    }

    ngOnInit(): void {
        Highcharts.chart('container', this.options);
        this.masterSub.add(
            this.workspaceService.res$.subscribe(x => {
                this.options.series[0]['data'] = x;
                Highcharts.chart('container', this.options);
            }),
        );
        this.updateAllowed = true;
    }

    private updateChart(optUpdate) {
        if (this.updateAllowed) {
            Highcharts.chart(
                'container',
                Object.assign(this.options, optUpdate),
            );
        }
    }
}
