import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { API } from '../../../../model/respone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APIBIG } from '../../../../model/responeImg';
import { MatInputModule } from '@angular/material/input';

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
    NgxSpinnerModule,
    MatInputModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  user: API[] = [];
  uid: any;
  bidData: APIBIG[] = [];
  bigBikes: APIBIG[] = [];
  imageName: any;
  uploadStatus: string = '';

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
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
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

  file?: File;

  onImageClick(imageUrl: string) {
    console.log(imageUrl);
    this.selectedImageUrl = imageUrl;
    // ปิด popup เมื่อคลิกที่รูปภาพ
    this.closePopupAvatar();
    this.file = undefined; // รีเซ็ตค่า file เมื่อคลิกที่รูปภาพ
  }

  onFileUser(event: Event) {
    // เลือกไฟล์รูปภาพ
    if ((event.target as HTMLInputElement).files) {
      this.file = (event.target as HTMLInputElement).files![0];
    }
  }

  updateImageuser(selectedImageUrl: string) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.spinner.hide(); // ซ่อน spinner เมื่อการนำทางเสร็จสมบูรณ์
      }
    });

    // ดำเนินการอัพโหลดรูปภาพ
    if (!this.file) {
      // ส่งข้อมูลไปยัง Express Route เพื่อเพิ่มข้อมูลลงใน MySQL
      const updateData = {
        username: this.username,
        accountname: this.accountname,
        img: this.selectedImageUrl,
      };
      this.http
        .put<any>(
          `https://project-backend-retb.onrender.com/user/update/${this.uid}`,
          updateData
        )
        .toPromise()
        .then(() => {
          console.log('Data added to MySQL successfully.');

          // หากอัพโหลดสำเร็จ ให้ปิด popup

          this.closePopupEdit();
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error update image:', error);
        });
      return;
    }
    // เริ่มต้นแสดง spinner
    this.spinner.show();

    const formData = new FormData();
    formData.append('file', this.file);

    this.http
      .post<any>(
        'https://project-backend-retb.onrender.com/user/upuser',
        formData
      )
      .toPromise()
      .then((response) => {
        console.log('Image uploaded. Firebase URL:', response.file);

        // ส่งข้อมูลไปยัง Express Route เพื่อเพิ่มข้อมูลลงใน MySQL
        const updateData = {
          username: this.username,
          accountname: this.accountname,
          img: response.file,
        };
        return this.http
          .put<any>(
            `https://project-backend-retb.onrender.com/user/update/${this.uid}`,
            updateData
          )
          .toPromise();
      })
      .then(() => {
        console.log('Data added to MySQL successfully.');

        // หากอัพโหลดสำเร็จ ให้ปิด popup
        this.closePopupEdit();

        window.location.reload();
      })
      .catch((error) => {
        console.error('Error update image:', error);
      });
  }

  getImageUrl() {
    return this.file ? URL.createObjectURL(this.file) : '';
  }

  updateSafety() {
    // เช็คว่ามีการกรอกอีเมลหรือไม่
    if (this.email && this.email.trim() !== '') {
      // ตรวจสอบรูปแบบของอีเมล์
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(this.email)) {
        alert('โปรดกรอกอีเมลให้ถูกต้อง');
        return;
      }
  
      // ดำเนินการอัพเดตอีเมล์
      const updateEmailData = {
        email: this.email,
      };
  
      this.http
        .put<any>(
          `https://project-backend-retb.onrender.com/user/updatesafety/${this.uid}`,
          updateEmailData
        )
        .toPromise()
        .then(() => {
         
          console.log('Email updated successfully.');
  
          // ล้างข้อมูลอีเมล์หลังจากอัพเดตเรียบร้อยแล้ว
          this.email = '';
          this.logout();
          alert('Email Updated Successfully');
          if (this.password !== '') {
            
              this.logout();
            
          } else {
            // หากมีการเปลี่ยนแปลงเพียงอีเมล์เท่านั้นให้ปิด popup เมื่อทำการอัพเดตเรียบร้อยแล้ว
            this.closePopupEdit();
          }
        })
        .catch((error) => {
          console.error('Error updating email:', error);
        });
    }
  
    if (this.password !== '') {
      if (this.password !== this.confirmPassword) {
        alert('Password and Confirm Password do not match!');
        return;
      }
      // ดำเนินการอัพเดตรหัสผ่าน
      const updatePasswordData = {
        password: this.password,
      };
  
      this.http
        .put<any>(
          `https://project-backend-retb.onrender.com/user/updatesafety/${this.uid}`,
          updatePasswordData
        )
        .toPromise()
        .then(() => {
          console.log('Password updated successfully.');
  
          // ล้างข้อมูลรหัสผ่านและรหัสยืนยันหลังจากอัพเดตเรียบร้อยแล้ว
          this.password = '';
          this.confirmPassword = '';
  
          alert('Password Updated Successfully');
          if (this.email === '') {
            // หากมีการเปลี่ยนแปลงเพียงรหัสผ่านเท่านั้นให้ปิด popup เมื่อทำการอัพเดตเรียบร้อยแล้ว
            this.closePopupEdit();
          }
        })
        .catch((error) => {
          console.error('Error updating password:', error);
        });
    } else {
      // หากไม่มีการเปลี่ยนแปลงใด ๆ ให้ปิด popup เมื่อทำการอัพเดตเรียบร้อยแล้ว
      this.closePopupEdit();
    }
  }
  openPopupAvatar() {
    let popupAvatar = document.getElementById('popupAvatar');
    if (popupAvatar) {
      popupAvatar.classList.add('open-popupAvatar');
      this.popupVisibleAvatar = true;

      const url = 'https://project-backend-retb.onrender.com/user/avatar';
      this.http.get(url).subscribe((data: any) => {
        if (data) {
          this.avatar = data;
          console.log(this.avatar);
        } else {
          console.log('No data found');
        }
      });
    }
  }

  closePopupAvatar() {
    let popupAvatar = document.getElementById('popupAvatar');
    if (popupAvatar) {
      popupAvatar.classList.remove('open-popupAvatar');
      this.popupVisibleAvatar = false;
    }
  }

  showUsernameAccountnameSection() {
    this.showUsernameAccountname = true;
    this.showEmailPassword = false; // ซ่อนส่วนที่เป็น Email/Password เมื่อแสดงส่วนที่เป็น Username/Accountname
  }

  showEmailPasswordSection() {
    this.showUsernameAccountname = false; // ซ่อนส่วนที่เป็น Username/Accountname เมื่อแสดงส่วนที่เป็น Email/Password
    this.showEmailPassword = true;
  }

  closeSuccessBox() {
    this.uploadSuccess = false; // ปิด success box
  }
  tryAgain() {
    this.uploadError = false; // กำหนดค่า uploadError เป็น false เพื่อปิด error box
  }

  openPopupEdit() {
    let popupEdit = document.getElementById('popupEdit');
    if (popupEdit) {
      popupEdit.classList.add('open-popupEdit');
      this.popupVisible = true;
    }
  }

  closePopupEdit() {
    let popupEdit = document.getElementById('popupEdit');
    if (popupEdit) {
      popupEdit.classList.remove('open-popupEdit');
      this.popupVisible = false; // เพิ่มบรรทัดนี้เพื่อเปลี่ยนค่าตัวแปรเมื่อปิด popup
    }
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
}
