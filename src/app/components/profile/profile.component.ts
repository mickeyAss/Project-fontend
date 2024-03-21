import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { API } from '../../../../model/respone';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { APIBIG } from '../../../../model/responeImg';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatToolbarModule,MatButtonModule,RouterLink,CommonModule,MatIconModule,HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  user: API[] = [];
  bigBikes: APIBIG[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token:', token);

      try {
        const url = `https://project-backend-retb.onrender.com/user/${token}`;
        this.http.get<API>(url).subscribe((userData: API) => {
          if (userData) {
            this.user.push(userData);
            console.log('User data:', this.user);

            const uid = userData.uid; // ใช้ข้อมูลผู้ใช้ที่ได้รับมาเพื่อดึง UID
            const bigBikeUrl = `https://project-backend-retb.onrender.com/user/bigbike/${uid}`;
            this.http.get<APIBIG[]>(bigBikeUrl).subscribe((bigBikeData: APIBIG[]) => {
              if (bigBikeData && bigBikeData.length > 0) {
                this.bigBikes = bigBikeData;
                console.log('Big Bikes data:', this.bigBikes);
              } else {
                console.log('No big bikes found for this user.');
              }
            });
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
