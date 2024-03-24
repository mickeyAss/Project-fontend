import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { APIBIG } from '../../../../model/responeImg';
import moment from 'moment';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatIconModule } from '@angular/material/icon';
import { API } from '../../../../model/respone';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
    HttpClientModule,
    NgxSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss',
})
export class VoteComponent implements OnInit {
  img: APIBIG[] = [];
  bidWin: any;
  scoreLose: any;
  bidLose: any;
  scoreWin: any;
  Winid: any;
  uid: any;
  user: API[] = [];
  showVoteCompletePopup: boolean = false;
  selectedImage: any; // เพิ่มตัวแปร selectedImage เพื่อเก็บรูปภาพที่ถูกเลือก

  constructor(
    private http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    this.fetchRandomImages();

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
            const Userid = data.uid;
            console.log('User data:', this.user);
            console.log('User id:', Userid);
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

  fetchRandomImages(): void {
    try {
      const url =
        'https://project-backend-retb.onrender.com/imgrandom/votesomee';
      this.http.get(url).subscribe((data: any) => {
        if (data) {
          this.img = data;
          console.log(data);

          // เรียกเมทอดสุ่มและแสดงรูปภาพ
          this.displayRandomImages();
        } else {
          console.log('No user data found');
        }
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  displayRandomImages(): void {
    if (this.img.length > 1) {
      let randomIndex1 = Math.floor(Math.random() * this.img.length);
      let randomIndex2 = Math.floor(Math.random() * this.img.length);

      // ตรวจสอบว่ารูปภาพที่ถูกเลือกในการโหวตอยู่ในอาร์เรย์หรือไม่
      const selectedImageIndex1 = this.img.findIndex(
        (img) => img.bid === this.bidWin
      );
      const selectedImageIndex2 = this.img.findIndex(
        (img) => img.bid === this.bidLose
      );

      // ถ้ารูปภาพที่ถูกเลือกในการโหวตมีอยู่ในอาร์เรย์ ให้ลบออก
      if (selectedImageIndex1 !== -1) {
        this.img.splice(selectedImageIndex1, 1);
      }
      if (selectedImageIndex2 !== -1) {
        this.img.splice(selectedImageIndex2, 1);
      }

      // สลับรูปภาพที่ถูกเลือกในการโหวตให้ไม่ซ้ำกัน
      while (randomIndex2 === randomIndex1) {
        randomIndex2 = Math.floor(Math.random() * this.img.length);
      }

      // กำหนดรูปภาพที่สุ่มได้ใน img ของคอมโพเนนต์
      this.img = [this.img[randomIndex1], this.img[randomIndex2]];
    } else {
      console.log('No more images to vote on.');
    }
  }

  getRandomIndexExcluding(excludeIndex: number, arrayLength: number): number {
    let randomIndex = Math.floor(Math.random() * arrayLength);
    while (randomIndex === excludeIndex) {
      randomIndex = Math.floor(Math.random() * arrayLength);
    }
    return randomIndex;
  }

  goToSeeProfile(uid: number, bid: number): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/see-profile', uid, bid], {
        queryParams: { token: token },
      });
    } else {
      // ไม่มี token ใน localStorage
      console.log('No token found in localStorage');
      alert('กรุณาเข้าสู่ระบบ');
    }
  }

  calculateElo(
    winnerScore: any,
    loserScore: any
  ): { winnerNewScore: number; loserNewScore: number } {
    const K_FACTOR = 32;

    const winnerExpectedScore =
      1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
    const loserExpectedScore =
      1 / (1 + Math.pow(10, (winnerScore - loserScore) / 400));

    let winnerNewScore = winnerScore + K_FACTOR * (1 - winnerExpectedScore);
    let loserNewScore = loserScore + K_FACTOR * (0 - loserExpectedScore);

    // เช็คว่าคะแนนใหม่มีค่าติดลบหรือไม่
    if (winnerNewScore < 0) {
      winnerNewScore = 0; // กำหนดให้คะแนนใหม่เป็น 0 หากมีค่าติดลบ
    }
    if (loserNewScore < 0) {
      loserNewScore = 0; // กำหนดให้คะแนนใหม่เป็น 0 หากมีค่าติดลบ
    }

    return { winnerNewScore, loserNewScore };
  }

  bidTotalScoresMap: Map<number, number> = new Map<number, number>();

  vote(
    bidWin: number,
    scoreWin: number,
    bidLose: number,
    scoreLose: number
  ): void {
    // โหวตเสร็จสิ้น กำหนดให้แสดง Popup
    this.showVoteCompletePopup = true;

    console.log('Win ID:', bidWin);
    console.log('Lose ID:', bidLose);

    const { winnerNewScore, loserNewScore } = this.calculateElo(
      scoreWin,
      scoreLose
    );

    const startscoreW = winnerNewScore - scoreWin;
    const startscoreL = loserNewScore - scoreLose;

    const formattedDate = moment().format(); // รูปแบบเริ่มต้น (ISO 8601)

    // ส่ง uid และข้อมูลโหวตไปยังเซิร์ฟเวอร์
    this.http
      .post<any>('https://project-backend-retb.onrender.com/imgrandom/vote', {
        bid_fk: bidWin,
        score: startscoreW,
        date: formattedDate,
        uid_fk: this.uid, // เพิ่ม uid ลงไปในข้อมูลที่โพสต์
      })
      .subscribe({
        next: () => {
          console.log('Vote added successfully for the winner', winnerNewScore);
          // ส่งคะแนนของรูปภาพแต่ละรูปไปยัง Popup
          this.showPopupWithScore(
            this.img.find((img) => img.bid === bidWin),
            scoreWin,
            winnerNewScore,
            startscoreW
          );
          // Call API to get total score for bidWin
          this.http
            .put<any>(
              `https://project-backend-retb.onrender.com/imgrandom/updatescore/${bidWin}`,
              {
                scsum: winnerNewScore,
              }
            )
            .subscribe({
              next: (response) => {},
              error: (error) => {
                console.error('Error getting total score for bidWin:', error);
              },
            });
          this.http
            .post<any>(
              'https://project-backend-retb.onrender.com/imgrandom/vote',
              {
                bid_fk: bidLose,
                score: startscoreL,
                date: formattedDate,
                uid_fk: this.uid, // เพิ่ม uid ลงไปในข้อมูลที่โพสต์
              }
            )
            .subscribe({
              next: () => {
                console.log(
                  'Vote added successfully for the loser',
                  loserNewScore
                );
                this.fetchRandomImages();
                setTimeout(() => {
                  this.hidePopup();
                }, 2000); // ซ่อน Popup หลังจาก 3 วินาที

                // Call API to get total score for bidWin
                this.http
                  .put<any>(
                    `https://project-backend-retb.onrender.com/imgrandom/updatescore/${bidLose}`,
                    {
                      scsum: loserNewScore,
                    }
                  )
                  .subscribe({
                    next: (response) => {
                      this.http
                        .get<any>(
                          'https://project-backend-retb.onrender.com/imgrandom/votesomee'
                        )
                        .subscribe({
                          next: (data) => {
                            console.log('Updated data:', data);
                          },
                          error: (error) => {
                            console.error(
                              'Error fetching data after update:',
                              error
                            );
                          },
                        });
                    },
                    error: (error) => {
                      console.error(
                        'Error getting total score for bidLose:',
                        error
                      );
                    },
                  });
              },
              error: (err) => {
                console.error('Error adding vote for the loser:', err);
              },
            });
        },
        error: (err) => {
          console.error('Error adding vote for the winner:', err);
        },
      });

    this.selectedImage = this.img.find((img) => img.bid === bidWin);
  }

  hidePopup(): void {
    this.showVoteCompletePopup = false;
    this.selectedImage = null;
  }

  showPopupWithScore(
    selectedImg: any,
    score: number,
    total: number,
    before: number
  ): void {
    // กำหนดคะแนนของรูปภาพที่โดนโหวตใน selectedImage
    selectedImg.score = score;
    selectedImg.total_score = total;
    selectedImg.scsum = before;
    // แสดง Popup พร้อมคะแนนของรูปภาพ
    this.selectedImage = selectedImg;
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
