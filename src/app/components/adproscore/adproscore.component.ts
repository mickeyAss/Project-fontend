import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, NavigationEnd, NavigationStart, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { API } from '../../../../model/respone';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { APIBIG } from '../../../../model/responeImg';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-adproscore',
  standalone: true,
  imports: [MatToolbarModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    MatInputModule],
  templateUrl: './adproscore.component.html',
  styleUrl: './adproscore.component.scss'
})
export class AdproscoreComponent implements OnInit{
  user: API[] = [];
  bigBikes: APIBIG[] = [];
  imageName: any;
  uploadStatus: string = '';
  uid: any;
  popupVisible: boolean = false;
  popupVisibleEdit: boolean = false;
  popupVisibleBig: boolean = false;
  popupVisibleAvatar: boolean = false;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;
  avatar: API[] = [];
  username: any;
  email: any;
  password: any;
  accountname: any;
  showUsernameAccountname: boolean = true; // ตัวแปรสำหรับการแสดง/ซ่อนส่วนที่เป็น Username/Accountname
  showEmailPassword: boolean = false; // ตัวแปรสำหรับการแสดง/ซ่อนส่วนที่เป็น Email/Password
  confirmPassword: any;
  userbefore: APIBIG[] = [];
  selectedImageUrl: string = '';
  uidres: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token:', token);

      try {
        const url = `https://project-backend-retb.onrender.com/user/${token}`;
        this.http.get<API>(url).subscribe((userData: API) => {
          if (userData) {
            this.user.push(userData);
            this.uid = userData.uid;
            console.log('User data:', this.user);
            this.getBidData(this.uidres)
          } else {
            console.log('No user data found');
          }
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
       // รับค่า bid จาก URL
       this.route.params.subscribe((params) => {
        this.uidres = params['uid'];
        this.getBidData(this.uidres);
      });
    } else {
      console.log('No token found in localStorage');
    }
  }
      // เมทอดสำหรับดึงข้อมูลของ bid
      getBidData(uid:number): void {
        const url = `https://project-backend-retb.onrender.com/user/bigbike/${uid}`;
        this.http.get(url).subscribe(
          (data: any) => {
            this.bigBikes = data;
            
            console.log('Bid data:', this.bigBikes);
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
