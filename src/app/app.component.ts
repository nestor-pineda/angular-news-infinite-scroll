import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public allPost: any = []; // stores the single artiles
  // intinite & spinner variables
  notEmptyPost = true;
  notScrolly = true;

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.loadInitPost();
  }

  loadInitPost() {
    const url =
      'https://newsapi.org/v2/everything?domains=wsj.com&apiKey=e24581c7b11b48aaa42a1cd064e5a204';
    this.http.get(url).subscribe((data: any) => {
      console.log(data.articles);
      this.allPost = data.articles;
    });
  }

  onScroll() {
    if (this.notScrolly && this.notEmptyPost) {
      this.spinner.show();
      this.notScrolly = false;
      this.loadNextPost();
    }
  }

  // We load the next post after the last post shown in the previosu fetch.
  //We need to get the id of the last post fetched previously
  loadNextPost() {
    const url =
      'https://newsapi.org/v2/everything?domains=wsj.com&apiKey=e24581c7b11b48aaa42a1cd064e5a204';
    //return las post from the array. We create a varieble lastPost
    const lastPost = this.allPost[this.allPost.length - 1];
    // extract id of the last post and save it in a variable lastPostId (source comes from the api object)
    const lastPostId = lastPost.source.id;
    // we send the id as key value pare using formatdata()
    const dataToSend = new FormData();
    dataToSend.append('id', lastPostId);
    //we create a http request and send the id to the back end.
    this.http.post(url, dataToSend).subscribe((data: any) => {
      const newPost = data.articles;
      this.spinner.hide(); //we hide the spiner
      // we check if there are more post to load after
      if (newPost.lenght === 0) {
        //if no more to load...
        this.notEmptyPost = false;
      }
      // we aad new fetched post to the array
      this.allPost = this.allPost.concat(newPost);
      this.notScrolly = true;
    });
  }
}
