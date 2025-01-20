import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-add',
  templateUrl: './edit-add.component.html',
  styleUrls: ['./edit-add.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class EditAddComponent {
  @Input() station: any = null; // Passed from ManageComponent (null for new station)
  @Output() saveStation = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  stationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.stationForm = this.fb.group({
      name: ['', Validators.required],
      mac: ['', Validators.required],
      frequency: [0, [Validators.required, Validators.min(0)]],
      pm25_alarm_threshold: [0, [Validators.required, Validators.min(0)]],
      is_temp_enabled: [true],
      is_hum_enabled: [true],
      is_press_enabled: [true],
      is_pm25_enabled: [true],
      is_screen_enabled: [true],
    });
  }

  ngOnChanges(): void {
    if (this.station) {
      this.stationForm.patchValue(this.station);
    }
  }

  onSubmit(): void {
    if (this.stationForm.valid) {
      this.saveStation.emit(this.stationForm.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
