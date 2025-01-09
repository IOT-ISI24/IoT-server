import { Component } from '@angular/core';
import { EspDataService } from '../esp-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage',
  imports: [CommonModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent {
  espData: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private espDataService: EspDataService) {}

    ngOnInit(): void {
      this.fetchEspData();
    }

    fetchEspData(): void {
      this.espDataService.getEspData().subscribe(
        (data: any) => {
          this.espData = data;
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          if (err.type === 'Unauthorized') {
            this.error = 'You are not authorized to access this data. Please log in.';
          }
          else{
          this.error = 'Failed to load ESP data';
          console.error(err);}
        }
      );
    }

}
