import { Component, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
//#region "Global Variables."
@Input() accessLevel: boolean = false;
menuOpen: boolean = false;
currentRoute: string = '';
showPopup: boolean = false;
username: string | null = null;
//#endregion.

constructor(private router: Router, private authService: AuthService) {}

ngOnInit(): void {
  this.currentRoute = this.router.url;

  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe((event: NavigationEnd) => {
    this.currentRoute = event.urlAfterRedirects;
  });

  this.authService.username$.subscribe(username => {
    this.username = username;
  });

  const access = localStorage.getItem('access');
  this.accessLevel = access === '1';
}

//Burger Menu Selection.
toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

//Home Page
onHome() {
  this.menuOpen = false;
  this.router.navigate(['/home']);
}

//About Page
onAbout() {
  this.menuOpen = false;
  this.router.navigate(['/about-us']);
}

//Contact Us Page
onContact() {
  this.menuOpen = false;
  this.router.navigate(['/contact-us']);
}

//Different Navigation based on the route the nav comes from.
handleNavigation(sectionId: string): void {
  this.menuOpen = false;
  if (sectionId === 'about-us' || sectionId === 'contact-us') {
    if (this.router.url === '/home' || this.router.url === '/') {
      this.scrollToSection(sectionId);
    } else {
      this.router.navigate([`/${sectionId}`]);
    }
  }
}

handleReview(sectionId: string): void {
  this.menuOpen = false;
  if (sectionId === 'review') {
    if (this.router.url === '/shop' || this.router.url === '/') {
      this.scrollToSection(sectionId);
    } else {
      this.router.navigate([`/${sectionId}`]);
    }
  }
}

//Scroll to the section if the section is in the current page.
scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

//Help & Support Page.
onHelp() {
  this.menuOpen = false;
  this.router.navigate(['/support']);
}

//Terms & Conditions Page.
onTerms() {
  this.menuOpen = false;
  this.router.navigate(['/terms']);
}

//Shop
onShop() {
  this.menuOpen = false;
  this.router.navigate(['/shop']);
}

//Review
onReview() {
  this.menuOpen = false;
  this.router.navigate(['/review']);
}

//Workouts & Coaching Page.
onPrograms() {
  this.menuOpen = false;
  this.router.navigate(['/workout']);
}

//Sign Up / Sign In Page.
onLog() {   
  this.menuOpen = false; 
  localStorage.removeItem('token');
  localStorage.removeItem('access');
  localStorage.removeItem('email');
  this.authService.clearUser();
  this.router.navigate(['/login']);
}

//Order tracking Page. (Admin use only.)
onOrders() {
  this.menuOpen = false;
  this.router.navigate(['/orders']);
}
}