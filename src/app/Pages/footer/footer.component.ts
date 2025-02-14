import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  onInsta(){
    window.open('https://www.instagram.com/ephesians_fitness/#', '_blank');
  }
}
