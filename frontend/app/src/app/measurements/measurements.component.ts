import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-measurements',
  imports: [CommonModule],
  templateUrl: './measurements.component.html',
  styleUrl: './measurements.component.css'
})
export class MeasurementsComponent {
  constructor(private http: HttpClient) {}
  measurements: {id: number, date: string, temperature: number, humidity: number,
    pressure: number, pm25_concentration: number, esp_id: number}[] = [];
    token: string | null = null;

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');
    console.log(this.token)

    const headers = new HttpHeaders({
      'Authorization': 'Token ' + this.token
    });

    this.http.get<{ 
      id: number, 
      date: string, 
      temperature: number, 
      humidity: number, 
      pressure: number, 
      pm25_concentration: number, 
      esp_id: number 
    }[]>('http://localhost:8000/measurements', { headers })
      .subscribe((data) => {
        this.measurements = data;
      });
    console.log(this.measurements);
  }

}
