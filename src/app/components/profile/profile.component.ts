import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, NavigationStart, RouterLink } from '@angular/router';
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
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    MatInputModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
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

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
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

            const uid = userData.uid; // ใช้ข้อมูลผู้ใช้ที่ได้รับมาเพื่อดึง UID
            
            const bigBikeUrl = `https://project-backend-retb.onrender.com/user/bigbike/${uid}`;
            this.http
              .get<APIBIG[]>(bigBikeUrl)
              .subscribe((bigBikeData: APIBIG[]) => {
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

  file?: File;

  onFileSelected(event: Event) {
    if ((event.target as HTMLInputElement).files) {
      this.file = (event.target as HTMLInputElement).files![0];
    }
  }

  uploadImage() {
    // ตรวจสอบว่าข้อมูลที่จำเป็นสำหรับการอัพโหลดรูปภาพถูกกรอกครบหรือไม่
    if (!this.uid || !this.file || !this.imageName) {
      console.log('Please fill in all required fields');
      return; // ไม่ทำงานต่อหากข้อมูลไม่ครบถ้วน
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.spinner.hide(); // ซ่อน spinner เมื่อการนำทางเสร็จสมบูรณ์
      }
    });

    // ตรวจสอบจำนวนรูปภาพที่มีในฐานข้อมูลสำหรับผู้ใช้นี้
    this.http
      .get<any>(
        `https://project-backend-retb.onrender.com/upload/image-count/${this.uid}`
      )
      .toPromise()
      .then((countResponse) => {
        const imageCount = countResponse.image_count;
        if (imageCount >= 5) {
          console.log('Maximum image count reached for this user');
          alert('อัพโหลดรูปได้ไม่เกิน 5 รูป');
        } else {
          // ดำเนินการอัพโหลดรูปภาพ
          if (!this.file) return;

          // เริ่มต้นแสดง spinner
          this.spinner.show();

          const formData = new FormData();
          formData.append('file', this.file);

          this.http
            .post<any>(
              'https://project-backend-retb.onrender.com/upload',
              formData
            )
            .toPromise()
            .then((response) => {
              console.log('Image uploaded. Firebase URL:', response.file);

              // ส่งข้อมูลไปยัง Express Route เพื่อเพิ่มข้อมูลลงใน MySQL
              const uploadData = {
                bname: this.imageName,
                bimg: response.file,
                uid_fk: this.uid,
              };
              return this.http
                .post<any>(
                  'https://project-backend-retb.onrender.com/upload/insert',
                  uploadData
                )
                .toPromise();
            })
            .then(() => {
              console.log('Data added to MySQL successfully.');

              // หากอัพโหลดสำเร็จ ให้ปิด popup
              this.closePopup();
              window.location.reload();
            })
            .catch((error) => {
              console.error('Error uploading image:', error);
            });
        }
      })
      .catch((error) => {});
  }

  deleteimg(bid: number) {
    if (confirm('คุณต้องการลบรูปภาพนี้ใช่หรือไม่?')) {
      this.http
        .delete<any>(
          `https://project-backend-retb.onrender.com/upload/deleteimg/${bid}`
        )
        .toPromise()
        .then(() => {
          console.log('Image deleted successfully.');
          // ทำการรีเฟรชหน้าหลังจากลบรูปภาพเสร็จสมบูรณ์
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error deleting image:', error);
        });
    }
  }

  onFileSelectedBig(event: Event) {
    if ((event.target as HTMLInputElement).files) {
      this.file = (event.target as HTMLInputElement).files![0];
    }
  }

  onImageClick(imageUrl: string) {
    console.log(imageUrl);
    this.selectedImageUrl = imageUrl;
    // ปิด popup เมื่อคลิกที่รูปภาพ
    this.closePopupAvatar();
    this.file = undefined; // รีเซ็ตค่า file เมื่อคลิกที่รูปภาพ
  }

  updateImageBigbike(bid: number) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.spinner.hide(); // ซ่อน spinner เมื่อการนำทางเสร็จสมบูรณ์
      }
    });
    // ดำเนินการอัพโหลดรูปภาพ
    if (this.file) {
      this.http
        .delete<any>(
          `https://project-backend-retb.onrender.com/upload/deleteimg/${bid}`
        )
        .toPromise()
        .then(() => {
          console.log('Image deleted successfully.');
        })
        .catch((error) => {
          console.error('Error deleting image:', error);
        });

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
            bname: this.imageName,
            bimg: response.file,
            uid_fk: this.uid,
          };
          return this.http
            .post<any>(
              `https://project-backend-retb.onrender.com/upload/insert`,
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
    if (this.password !== this.confirmPassword) {
      alert('Password and Confirm Password do not match!');
      return;
    }

    // ส่งข้อมูลไปยัง Express Route เพื่อเพิ่มข้อมูลลงใน MySQL
    const updateData = {
      email: this.email,
      password: this.password,
    };
    this.http
      .put<any>(
        `https://project-backend-retb.onrender.com/user/updatesafety/${this.uid}`,
        updateData
      )
      .toPromise()
      .then(() => {
        console.log('Data added to MySQL successfully.');

        // ล้างข้อมูลรหัสผ่านและอีเมล์หลังจากอัพเดตเรียบร้อยแล้ว
        this.email = '';
        this.password = '';
        this.confirmPassword = ''; // เพิ่มการล้างรหัสผ่านยืนยัน

        // ไม่ต้องรีเซ็ต token หรือลบ localStorage ให้ใช้งานต่อไปได้โดยไม่ต้องเข้าสู่ระบบใหม่
        this.uploadSuccess = true; // กำหนดค่า uploadSuccess เป็น true เมื่ออัพโหลดสำเร็จ
        alert('Update Success');
        // หากอัพเดตสำเร็จ ให้ปิด popup
        this.closePopupEdit();
      })
      .catch((error) => {
        console.error('Error update :', error);
      });
    return;
  }

  openPopup() {
    let popup = document.getElementById('popup');
    if (popup) {
      popup.classList.add('open-popup');
      this.popupVisible = true;
    }
  }

  closePopup() {
    let popup = document.getElementById('popup');
    if (popup) {
      popup.classList.remove('open-popup');
      this.popupVisible = false;
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

  openPopupBig(bid: number) {
    let popupBig = document.getElementById('popupBig');
    if (popupBig) {
      popupBig.classList.add('open-popupBig');
      this.popupVisibleBig = true;
      // สร้าง URL โดยเพิ่ม bid เข้าไปใน URL

      const url = `https://project-backend-retb.onrender.com/imgrandom/getBB/${bid}`;
      this.http.get(url).subscribe((data: any) => {
        if (data) {
          this.userbefore = data;
          console.log(this.userbefore);
        } else {
          console.log('No data found');
        }
      });
    }
  }

  closePopupBig() {
    let popupBig = document.getElementById('popupBig');
    if (popupBig) {
      popupBig.classList.remove('open-popupBig');
      this.popupVisibleBig = false; // เพิ่มบรรทัดนี้เพื่อเปลี่ยนค่าตัวแปรเมื่อปิด popup
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

  ngAfterViewInit(): void {
    // เรียกใช้งานฟังก์ชัน openPopup() และ closePopup()
    this.openPopup();
    this.closePopup();
  }

  closeSuccessBox() {
    this.uploadSuccess = false; // ปิด success box
  }
  tryAgain() {
    this.uploadError = false; // กำหนดค่า uploadError เป็น false เพื่อปิด error box
  }
}
