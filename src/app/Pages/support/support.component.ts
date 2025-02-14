import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TermsAndConditionsComponent } from "../terms-and-conditions/terms-and-conditions.component";

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [TermsAndConditionsComponent],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent {
  constructor(private router: Router){}

  onHome(): void{
    this.router.navigate(['/home-page']);
}
}
