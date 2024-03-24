import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { APIBIG } from '../../../../model/responeImg';
import { APISCORE } from '../../../../model/responeScore';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admintop',
  standalone: true,
  imports: [    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    HttpClientModule,
    CommonModule,
    NgxSpinnerModule,
    MatIconModule],
  templateUrl: './admintop.component.html',
  styleUrl: './admintop.component.scss'
})
export class AdmintopComponent implements OnInit{
  user: APIBIG[] = [];
  userbefore: APISCORE[] = [];
  showToday: boolean = true; // ใช้เพื่อแสดงหรือซ่อนส่วนที่เป็นข้อมูล "today"
  showBefore: boolean = false; // ใช้เพื่อแสดงหรือซ่อนส่วนที่เป็นข้อมูล "before"
  uid: any;

  constructor(private router: Router, private http: HttpClient,private spinner: NgxSpinnerService) {}
  ngOnInit(): void {
    this.spinner.show();
    setTimeout(()=>{
      this.spinner.hide();
    },1000)

    const token = localStorage.getItem('token');
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
   
    // เรียกเมทอดเพื่อโหลดข้อมูล Top 10 เมื่อไม่มี Token ส่งมา
    this.loadTop10Data();
  }

  goToSeeProfile(bid: number): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/admingrap',bid], { queryParams: { token: token } });
    } else {
      // ไม่มี token ใน localStorage
      console.log('No token found in localStorage');
      alert('กรุณาเข้าสู่ระบบ')
    }
  }

  // เมทอดสำหรับโหลดข้อมูล Top 10
  loadTop10Data() {
    try {
      const url = `https://project-backend-retb.onrender.com/imgrandom`; // URL เพื่อโหลดข้อมูล Top 10
      this.http.get(url).subscribe((data: any) => {
        if (data) {
          this.userbefore = data;
          console.log('Top 10 data:', this.userbefore);
        } else {
          console.log('No data found');
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  logout() {
    localStorage.removeItem('token'); // ลบ token ออกจาก localStorage
    this.user = []; // รีเซ็ตค่าข้อมูลผู้ใช้
    this.router.navigateByUrl('/login'); // เปลี่ยนเส้นทางไปยังหน้า Login
  }

  goToVote() {
    const token = localStorage.getItem('token');
    if (token) {
      // นำ Token ไปยังหน้า Vote โดยส่งผ่าน Query Parameters
      this.router.navigate(['/vote'], { queryParams: { token: token } });
    } else {
      console.log('No token found in localStorage');
    }
  }

  goToRank() {
    const token = localStorage.getItem('token');
    if (token) {
      // นำ Token ไปยังหน้า Vote โดยส่งผ่าน Query Parameters
      this.router.navigate(['/rank'], { queryParams: { token: token } });
    } else {
      console.log('No token found in localStorage');
    }
  }
}
