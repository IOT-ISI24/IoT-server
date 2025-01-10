import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { EspDataService } from '../esp-data.service';
import { AuthService } from '../login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartService } from '../chart.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
  esps: any[] = [];
  selectedEsp: any = null;
  selectedEspData: any = null;
  errorMessage: string = '';
  loaded: boolean = false;

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
  }

  ngAfterViewInit(): void {
    if (this.loaded && this.selectedEspData) {
      this.createCharts();
    }
  }

  createCharts(): void {
    this.chartService.createChart(this.temperatureChartRef, this.selectedEspData, 'temperature', 'Temperature', 'Temperature (°C)');
    this.chartService.createChart(this.pressureChartRef, this.selectedEspData, 'pressure', 'Pressure', 'Pressure (hPa)');
    this.chartService.createChart(this.humidityChartRef, this.selectedEspData, 'humidity', 'Humidity', 'Humidity (%)');
    this.chartService.createChart(this.airChartRef, this.selectedEspData, 'pm25_concentration', 'PM2.5 Concentration', 'PM2.5 Concentration (µg/m³)');
  }

  fetchEspData(): void {
    this.espDataService.getEspData().subscribe({
      next: (data) => {
        this.esps = data;
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }

  onEspSelect(selectedEsp: any): void {
    this.selectedEsp = selectedEsp;
    if (this.selectedEsp) {
      this.fetchMeasurements(this.selectedEsp.id);
    } else {
      this.selectedEspData = null;
    }
  }

  fetchMeasurements(espId: number): void {
    this.espDataService.getMeasurements(espId, 100).subscribe({
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
}
