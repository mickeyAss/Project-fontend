import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { APIBIG } from '../../../../model/responeImg';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { MatCardModule } from '@angular/material/card';
import { APISCORE } from '../../../../model/responeScore';
import { API } from '../../../../model/respone';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-admingrap',
  standalone: true,
  imports: [      MatToolbarModule,
    MatButtonModule,
    RouterLink,
    HttpClientModule,
    CommonModule,
    MatCardModule,
    NgxSpinnerModule,
    MatIconModule],
  templateUrl: './admingrap.component.html',
  styleUrl: './admingrap.component.scss'
})
export class AdmingrapComponent implements OnInit{
  bid: any;
  user: API[] = [];
  bidData: APIBIG[] = [];
  bidGrap: APISCORE[] = [];
  bidUid:any;
  uid: API[]=[];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
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
        this.bid = params['bid'];
        // เรียกใช้งานเมทอดเพื่อดึงข้อมูลของ bid
        this.getBidData(this.bid);
        this.getBidGrap(this.bid);
      });
    } else {
      console.log('No token found in localStorage');
    }
  }

  getBidGrap(bid: number): void {
    const url = `https://project-backend-retb.onrender.com/imgrandom/totalScore/${bid}`;
    this.http.get(url).subscribe(
      (data: any) => {
        this.bidGrap = data;
      
        console.log('Bid Grap:', this.bidGrap);
        this.renderChart();
      },
      (error) => {
        console.error('Error fetching bid data:', error);
      }
    );
  }

  renderChart() {
    const labels = this.get7DaysLabels().reverse();
    const scores = this.bidGrap.map((entry) => entry.total_score).reverse();

    new Chart('myChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'สถิติคะแนนขึ้นลงภายใน 7 วัน มีคะแนน',
            data: scores,
            backgroundColor: '#233449', // สีพื้นหลังเป็นสีเขียว
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            reverse: true, // เริ่มจากขวาสุด
          },
        },
      },
    });
  }
  get7DaysLabels(): string[] {
    const today = new Date(); // วันที่ปัจจุบัน
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString()); // แปลงวันที่เป็นรูปแบบของวันเดือนปี
    }
    return labels;
  }
  

  // เมทอดสำหรับดึงข้อมูลของ bid
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

  // goToSeeProfile() {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     // นำ Token ไปยังหน้า Vote โดยส่งผ่าน Query Parameters
  //     this.router.navigate(['/see-profile'], { queryParams: { token: token } });
  //   } else {
  //     console.log('No token found in localStorage');
  //   }
  // }
}
