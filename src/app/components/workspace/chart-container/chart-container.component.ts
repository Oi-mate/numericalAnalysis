import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    HostListener,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { WorkspaceService } from '../../../services/workspace.service';
import {combineLatest, pipe, Subscription} from 'rxjs';
import { xAxisTickLabelFormatterFn } from '../../../utils/highcharts-formatters';
import { screenSizeOption } from '../../../utils/highcharts-option-samples';
import {debounceTime} from 'rxjs/operators';
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
            // type: 'scatter',
            zoomType: 'xy',
            height: this.screenHeight,
        },
        title: {
            text: '',
        },
        credits: {
            enabled: false,
        },
        tooltip: {
            formatter: function () {
                return `(${this.x}; ${this.y})`;
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
                data: [],
                lineColor: Highcharts.getOptions().colors[0],
                marker: {
                    enabled: true,
                    radius: 0,
                },
                threshold: null,
            },
            {
                name: 'Iterations',
                turboThreshold: 500000,
                data: [],
                lineColor: Highcharts.getOptions().colors[1],
                lineWidth: 0,
                marker: {
                    enabled: true,
                    radius: 2,
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
          combineLatest([
              this.workspaceService.originLine$,
              this.workspaceService.interpolatedLine$
          ]).pipe(debounceTime(20))
            .subscribe(([origin, interpolated]) => {
              // console.log(origin, interpolated);
              this.options.series[0]['data'] = origin;
              this.options.series[1]['data'] = interpolated;
              Highcharts.chart('container', this.options);
          })
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
