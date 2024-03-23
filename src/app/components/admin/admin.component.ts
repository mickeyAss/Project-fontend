import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { API } from '../../../../model/respone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APIBIG } from '../../../../model/responeImg';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  user: API[] = [];
  uid: any;
  bidData : APIBIG[] = [];
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    const token = localStorage.getItem('token'); //ตรวจสอบว่ามีtoken เก็บไว้ในlocalStorage มั้ย
    if (token) {
      console.log('Token:', token);

      try {
        // ส่ง token ไปยังเซิร์ฟเวอร์เพื่อขอข้อมูลผู้ใช้
        const url = `https://project-backend-retb.onrender.com/user/${token}`;
        this.http.get(url).subscribe((data: any) => {
          if (data) {
            this.user = [data];
            this.uid = data.uid;
            console.log('User data:', this.user);
            console.log('UID data:', this.uid);
            this.getBidData();

          } else {
            console.log('No user data found');
          }
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
       
    } else {
      console.log('No token found in localStorage');
    }
  }

  getBidData(): void {
    const url = `https://project-backend-retb.onrender.com/user`;
    this.http.get(url).subscribe(
      (data: any) => {
        this.bidData = data;
      
        console.log('Bid Grap:', this.bidData);

      },
      (error) => {
        console.error('Error fetching bid data:', error);
      }
    );
  }
  logout() {
    localStorage.removeItem('token'); // ลบ token ออกจาก localStorage
    this.user = []; // รีเซ็ตค่าข้อมูลผู้ใช้
    this.router.navigateByUrl('/login'); // เปลี่ยนเส้นทางไปยังหน้า Login
  }
}
