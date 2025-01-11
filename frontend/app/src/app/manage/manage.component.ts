import { Component } from '@angular/core';
import { EspDataService } from '../esp-data.service';
import { CommonModule } from '@angular/common';
import { EditAddComponent } from '../edit-add/edit-add.component';

@Component({
  selector: 'app-manage',
  imports: [CommonModule, EditAddComponent],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent {
  espData: any[] = [];
  isLoading = true;
  error: string | null = null;
  isEditing = false;
  selectedStation: any = null;

  constructor(private espDataService: EspDataService) {}

  ngOnInit(): void {
    this.fetchEspData();
  }

  fetchEspData(): void {
    this.isLoading = true;
    this.error = null; // Clear previous errors
    this.espDataService.getEspData().subscribe(
      (data: any) => {
        this.espData = data;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        this.error =
          err.type === 'Unauthorized'
            ? 'You are not authorized to access this data. Please log in.'
            : 'Failed to load ESP data';
        console.error(err);
      }
    );
  }

  addStation(): void {
    this.isEditing = true;
    this.selectedStation = null;
    this.error = null; // Clear previous errors
  }

  editStation(station: any): void {
    this.isEditing = true;
    this.selectedStation = station;
    this.error = null; // Clear previous errors
  }

  saveStation(station: any, isAdding: boolean): void {
    if (this.error || this.isLoading) return; // Prevent saving on error or loading
    station.id = this.selectedStation ? this.selectedStation.id : null;
    this.isLoading = true;
    this.error = null; // Clear previous errors
  
    this.espDataService.postEspData(station, isAdding).subscribe(
      (response) => {
        if (isAdding) {
          this.espData.push(response);
        } else {
          const index = this.espData.findIndex(
            (s) => s.mac === this.selectedStation.mac
          );
          if (index > -1) this.espData[index] = station;
        }
        this.isEditing = false;
        this.selectedStation = null;
        this.isLoading = false;
      },
      (err) => {
        console.log(err.message)
        this.error = err.message || 'Failed to save station data';
        this.isLoading = false;
        console.error(err);
      }
    );
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedStation = null;
    this.error = null; // Clear previous errors
  }

  deleteStation(station: any): void {
    if (this.isLoading) return; // Prevent deletion while loading
    this.isLoading = true;
    this.error = null; // Clear previous errors

    this.espDataService.deleteEspData(station.id).subscribe(
      () => {
        this.espData = this.espData.filter((s) => s.mac !== station.mac);
        this.isLoading = false;
      },
      (err) => {
        this.error = err.message || 'Failed to delete station';
        this.isLoading = false;
        console.error(err);
      }
    );
  }
}
