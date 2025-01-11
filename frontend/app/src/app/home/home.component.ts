import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { EspDataService } from '../esp-data.service';
import { AuthService } from '../login.service';
import { ChartService } from '../chart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  esps: any[] = [];
  selectedEsp: any = null;
  selectedEspData: any = null;
  errorMessage: string = '';
  loaded: boolean = false;
  loading: boolean = true; // Added loading state
  measurementCount: number = 100;
  private charts: any = {};

  private measurementCountSubject = new Subject<number>();

  @ViewChild('temperatureChart', { static: false }) temperatureChartRef!: ElementRef;
  @ViewChild('pressureChart', { static: false }) pressureChartRef!: ElementRef;
  @ViewChild('humidityChart', { static: false }) humidityChartRef!: ElementRef;
  @ViewChild('airChart', { static: false }) airChartRef!: ElementRef;

  constructor(
    private espDataService: EspDataService,
    private authService: AuthService,
    private chartService: ChartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchEspData();

    this.measurementCountSubject
      .pipe(
        debounceTime(300), // Wait for the user to stop typing
        switchMap((count) => {
          if (this.selectedEsp) {
            return this.espDataService.getMeasurements(
              this.selectedEsp.id,
              count
            );
          }
          return [];
        })
      )
      .subscribe({
        next: (data) => {
          this.selectedEspData = data;
          this.errorMessage = '';
          this.loaded = true;
          this.cdr.detectChanges();
          this.createCharts();
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.selectedEspData = null;
          this.loaded = false;
        },
      });
  }

  createCharts(): void {
    this.destroyCharts();

    this.charts.temperature = this.chartService.createChart(
      this.temperatureChartRef,
      this.selectedEspData,
      'temperature',
      'Temperature',
      'Temperature (°C)'
    );
    this.charts.pressure = this.chartService.createChart(
      this.pressureChartRef,
      this.selectedEspData,
      'pressure',
      'Pressure',
      'Pressure (hPa)'
    );
    this.charts.humidity = this.chartService.createChart(
      this.humidityChartRef,
      this.selectedEspData,
      'humidity',
      'Humidity',
      'Humidity (%)'
    );
    this.charts.air = this.chartService.createChart(
      this.airChartRef,
      this.selectedEspData,
      'pm25_concentration',
      'PM2.5 Concentration',
      'PM2.5 Concentration (µg/m³)'
    );
  }

  destroyCharts(): void {
    for (const key in this.charts) {
      if (this.charts[key]) {
        this.charts[key].destroy();
        this.charts[key] = null;
      }
    }
  }

  fetchEspData(): void {
    this.espDataService.getEspData().subscribe({
      next: (data) => {
        this.esps = data;
        this.loading = false; // Loading complete
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false; // Loading complete even if error occurs
      },
    });
  }

  onEspSelect(selectedEsp: any): void {
    this.selectedEsp = selectedEsp;
    if (this.selectedEsp) {
      this.measurementCountSubject.next(this.measurementCount);
    } else {
      this.selectedEspData = null;
    }
  }

  onMeasurementCountChange(count: number): void {
    if (count === null || count < 1) {
      count = 1;
    }
    this.measurementCount = count;
    this.measurementCountSubject.next(count);
  }
}
