import { HttpClient, HttpClientModule  } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { API } from '../../../../model/respone';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APIBIG } from '../../../../model/responeImg';

@Component({
  selector: 'app-adminprofile',
  standalone: true,
  imports: [HttpClientModule,MatToolbarModule,MatButtonModule,MatIconModule,RouterLink,CommonModule,FormsModule,NgxSpinnerModule],
  templateUrl: './adminprofile.component.html',
  styleUrl: './adminprofile.component.scss'
})
export class AdminprofileComponent implements OnInit{
  bidData: APIBIG[] = [];
  user: API[] = [];
  uidData: APIBIG[] = [];
  uid:any;

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
            console.log('User data:', this.user);

          } else {
            console.log('No user data found');
          }
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
       // รับค่า bid จาก URL
       this.route.params.subscribe((params) => {
        this.uid = params['uid'];
        // เรียกใช้งานเมทอดเพื่อดึงข้อมูลของ bid
        this.getBidData(this.uid);
        this.getUidData(this.uid);
      
      });
    } else {
      console.log('No token found in localStorage');
    }
  }

  getUidData(uid:number): void {
    const url = `https://project-backend-retb.onrender.com/user/biduser/${uid}`;
    this.http.get(url).subscribe(
      (data: any) => {
        this.uidData = data;
        console.log('uiddata:', this.uidData);
      },
      (error) => {
        console.error('Error fetching bid data:', error);
      }
    );
  }

  getBidData(uid:number): void {
    const url = `https://project-backend-retb.onrender.com/user/bigbike/${uid}`;
    this.http.get(url).subscribe(
      (data: any) => {
        this.bidData = data;
        console.log('Data:', this.bidData);
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
