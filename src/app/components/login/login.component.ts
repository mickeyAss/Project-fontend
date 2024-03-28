import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { API } from '../../../../model/respone';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginObj: any = {
    email: '',
    password: '',
  };
  user:any;
  constructor(private http: HttpClient, private router: Router) {}

  onLogin(){
    // ตรวจสอบว่าข้อมูลถูกต้องและไม่ว่างเปล่าหรือไม่
    if(this.loginObj.email && this.loginObj.password){
      this.http.post('https://project-backend-retb.onrender.com/user/login', this.loginObj).subscribe((res: any) => {
        this.user = res;
        if(res.result){
          localStorage.setItem('token', res.data.token);
         
          if (res.userType === 'user') {
            this.router.navigateByUrl('/main');
          } else {
            this.router.navigateByUrl('/admin');
          }
        } else {
          alert('ข้อมูลไม่ถูกต้อง');
        }
      });
    } else {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }
}
