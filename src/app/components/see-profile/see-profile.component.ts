import { Component, OnInit } from '@angular/core';
import { API } from '../../../../model/respone';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APIBIG } from '../../../../model/responeImg';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-see-profile',
  standalone: true,
  imports: [
    NgxSpinnerModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './see-profile.component.html',
  styleUrl: './see-profile.component.scss',
})
export class SeeProfileComponent implements OnInit {
  user: API[] = [];
  bidData: APIBIG[] = [];
  bigData: APIBIG[] = [];
  bid: any;
  uid_fk: any;

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
        this.uid_fk = params['uid_fk'];
        this.getBigbikeData(this.uid_fk);

        this.bid = params['bid'];
        this.getBidData(this.bid);
      });
    } else {
      console.log('No token found in localStorage');
    }
  }

  getBidData(bid: number): void {
    const url = `https://project-backend-retb.onrender.com/user/biguser/${bid}`;
    this.http.get(url).subscribe(
      (data: any) => {
        this.bidData = data;
        console.log('Bid data:', this.bidData);
      },
      (error) => {
        console.error('Error fetching bid data:', error);
      }
    );
  }

  getBigbikeData(uid_fk: number): void {
    const url = `https://project-backend-retb.onrender.com/user/bigbike/${uid_fk}`;
    this.http.get(url).subscribe(
      (data: any) => {
        this.bigData = data;
        console.log('Bid data:', this.bidData);
      },
      (error) => {
        console.error('Error fetching bid data:', error);
      }
    );
  }

  


  logout() {
    if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      localStorage.removeItem('token'); // ลบ token ออกจาก localStorage
      this.user = []; // รีเซ็ตค่าข้อมูลผู้ใช้
      this.router.navigateByUrl('/'); // เปลี่ยนเส้นทางไปยังหน้า Login
    }
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
