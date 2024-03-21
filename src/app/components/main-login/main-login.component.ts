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
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-main-login',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    HttpClientModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './main-login.component.html',
  styleUrl: './main-login.component.scss',
})
export class MainLoginComponent implements OnInit {
  user: API[] = [];
  uid: any;
  imageName: any;
  ฃuploadStatus: string = '';
  

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    setTimeout(()=>{
      this.spinner.hide();
    },1000)

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

  openPopup() {
    let popup = document.getElementById('popup');
    if (popup) {
      popup.classList.add('open-popup');
    }
  }

  closePopup() {
    let popup = document.getElementById('popup');
    if (popup) {
      popup.classList.remove('open-popup');
    }
  }

  ngAfterViewInit(): void {
    // เรียกใช้งานฟังก์ชัน openPopup() และ closePopup()
    this.openPopup();
    this.closePopup();
  }

  file?: File;

  onFileSelected(event: Event) {
    if ((event.target as HTMLInputElement).files) {
      this.file = (event.target as HTMLInputElement).files![0];
    }
  }

  uploadImage() {
    // ตรวจสอบจำนวนรูปภาพที่มีในฐานข้อมูลสำหรับผู้ใช้นี้
    this.http.get<any>(`https://project-backend-retb.onrender.com/upload/image-count/${this.uid}`)
      .toPromise()
      .then((countResponse) => {
        const imageCount = countResponse.image_count;
        if (imageCount >= 5) {
          console.log('Maximum image count reached for this user');
          alert('ไม่สามารถอัพโหลดได้');
        } else {
          // ดำเนินการอัพโหลดรูปภาพ
          if (!this.file) return;
  
          const formData = new FormData();
          formData.append('file', this.file);
  
          this.http.post<any>('https://project-backend-retb.onrender.com/upload', formData)
            .toPromise()
            .then((response) => {
              console.log('Image uploaded. Firebase URL:', response.file);
  
              // ส่งข้อมูลไปยัง Express Route เพื่อเพิ่มข้อมูลลงใน MySQL
              const uploadData = {
                bname: this.imageName,
                bimg: response.file,
                uid_fk: this.uid
              };
              return this.http.post<any>('https://project-backend-retb.onrender.com/upload/insert', uploadData)
                .toPromise();
            })
            .then(() => {
              console.log('Data added to MySQL successfully.');
              
              // หากอัพโหลดสำเร็จ ให้ปิด popup
              this.closePopup();
            })
            .catch((error) => {
              console.error('Error uploading image:', error);
            });
        }
      })
      .catch((error) => {});
  }
}



