import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MeasurementsComponent } from './measurements/measurements.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink, 
    RouterLinkActive, LoginComponent, MeasurementsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app';
}
