import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MeasurementsComponent } from './measurements/measurements.component';
import { AuthService } from './login.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink, 
    RouterLinkActive, LoginComponent, MeasurementsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(public loginService: AuthService, private router: Router) {}
  title = 'app';

  logout() {
    this.loginService.logout();
    this.router.navigate(['/home']);
  }
}
