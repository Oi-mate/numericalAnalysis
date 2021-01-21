import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import * as Highcharts from 'highcharts';
import {WorkspaceService} from '../../../services/workspace.service';
import {Subscription} from 'rxjs';
declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

@Component({
  selector: 'na-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartContainerComponent implements OnInit {

  public options: any = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      height: '100%'
    },
    title: {
      text: 'Sample Scatter Plot'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return 'x: ' + Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x) +
          'y: ' + this.y.toFixed(2);
      }
    },
    xAxis: {
      type: 'linear',
      labels: {}
    },
    series: [
      {
        name: 'Normal',
        turboThreshold: 500000,
        data: [[new Date('2018-01-25 18:38:31').getTime(), 2]],
        // lineWidth: 1,
        // lineColor: Highcharts.getOptions().colors[1],
        marker: {
          enabled: true,
          radius: 1
        },
        threshold: null
      },

    ]
  };

  masterSub = new Subscription();

  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit(): void {
    Highcharts.chart('container', this.options);
    this.masterSub.add(
      this.workspaceService.res$.subscribe(x => {
        this.options.series[0]['data'] = x;
        Highcharts.chart('container', this.options);
      })
    );
  }

  private updateChart() {
    Highcharts.chart('container', this.options);
  }

}
