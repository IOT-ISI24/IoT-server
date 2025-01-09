import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { EspDataService } from '../esp-data.service';
import { AuthService } from '../login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  

  constructor(private espDataService: EspDataService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.fetchEspData();
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
    this.espDataService.getMeasurements(espId).subscribe({
      next: (data) => {
        this.selectedEspData = data;
        this.errorMessage = '';
        console.log(this.selectedEspData);
        this.loaded = true;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.selectedEspData = null;
        this.loaded = false; 
      },
    });
  }
 

}