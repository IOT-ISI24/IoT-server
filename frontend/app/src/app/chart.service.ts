import { Injectable, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private charts: { [key: string]: Chart } = {}; // Store multiple charts by key

  private mapData(data: any[], type: string): any {
    if (type === 'temperature') {
      return data.map((measurement: any) => measurement.temperature);
    } else if (type === 'humidity') {
      return data.map((measurement: any) => measurement.humidity);
    } else if (type === 'pressure') {
      return data.map((measurement: any) => measurement.pressure);
    } else if (type === 'pm25_concentration') {
      return data.map((measurement: any) => measurement.pm25_concentration);
    }
  }

  createChart(
    elementRef: ElementRef,
    data: any[],
    type: string,
    label: string,
    labelWithUnit: string
  ): void {
    // Destroy the existing chart with the same key if it exists
    if (this.charts[type]) {
      this.charts[type].destroy();
    }

    const measurementData = this.mapData(data, type);
    const timestamps = data.map((measurement: any) => measurement.date.slice(11, 19));

    this.charts[type] = new Chart(elementRef.nativeElement, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [
          {
            label: label,
            data: measurementData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 0,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'date',
            },
          },
          y: {
            title: {
              display: true,
              text: labelWithUnit,
            },
          },
        },
      },
    });
  }

  getChart(key: string): Chart | undefined {
    return this.charts[key];
  }

  destroyChart(key: string): void {
    if (this.charts[key]) {
      this.charts[key].destroy();
      delete this.charts[key];
    }
  }

  destroyAllCharts(): void {
    Object.keys(this.charts).forEach((key) => {
      this.charts[key].destroy();
      delete this.charts[key];
    });
  }
}
