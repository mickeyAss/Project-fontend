import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    CommonModule,
    RouterLink,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  public signupForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: [''],
      email: [''],
      password: [''],
    });
  }

  register() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // รูปแบบของอีเมล
  
    if (!Object.values(this.signupForm.value).every(value => !!value)) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
  
    if (!emailPattern.test(this.signupForm.value.email)) {
      alert('กรุณากรอกอีเมลให้ถูกต้อง');
      return;
    }
  
    this.http
      .post<any>('https://project-backend-retb.onrender.com/user/register', this.signupForm.value)
      .subscribe(res => {
          alert('ลงทะเบียนสำเร็จ');
          this.signupForm.reset();
          this.router.navigate(['/']);
        }, err => {
          alert('เกิดข้อผิดพลาด');
        }
      );
  }
}
