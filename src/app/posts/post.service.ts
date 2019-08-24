import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' }) // important: 'root' to add and only creates once instance
export class PostService {
  //
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>(); // rxjs

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts; // from server
        this.postUpdated.next([...this.posts]);
      });
  }

  // for Subject/rxjs
  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: '', title: title, content: content };
    this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
    .subscribe((responseData) => {
      console.log(responseData.message);

      // optimesting updating
      this.posts.push(post);
      this.postUpdated.next([...this.posts]); // rxjs copy of post after update
    });
  }
}
