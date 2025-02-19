import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PopupMessageComponent } from '../popup-message/popup-message.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule, PopupMessageComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
    //#region "Global Variables."
showPopup: boolean = false;
emailFocused = false;
displayHeaderFooter: boolean = true;
allowedPreviousRoutes: string[] = ['/products', '/about', '/support', '/home'];

// serverHost: string = 'http://localhost:3000';
serverHost: string = 'https://ephesians-fitness-server.onrender.com';

@ViewChild(PopupMessageComponent) popup!: PopupMessageComponent;
//#endregion.

constructor(private http: HttpClient) {}

onEmailFocus() {
  this.emailFocused = true;
}

//#region "Emails."
sendEmail(form: NgForm) {
  if (form.valid) {
    const {
      name,
      email,
      phone = 'Not provided',
      subject,
      message,
    } = form.value;

    if (!this.validateEmail(email)) {
      this.popup.show(
        'Invalid email format. Please enter a valid email address.'
      );
      return;
    }

    const formData = { name, email, phone, subject, message };

    this.http
      .post<{ message: string }>(`${this.serverHost}/send-email`, formData)
      .subscribe({
        next: (response) => {
          this.popup.show('Contact Us request sent successfully!');
          form.reset();
        },
        error: (error) => {
          this.popup.show('Failed to send Contact Us request. Error:');
          if (error.error && error.error.message) {
            alert(error.error.message);
          } else {
            this.popup.show(
              'There was an error sending your request. Please try again later.'
            );
          }
        },
      });
  } else {
    this.popup.show('Please fill in all required fields.');
  }
}
//#endregion.

//#region "Validation."
validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
//#endregion
}
