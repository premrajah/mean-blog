import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' }) // important: 'root' to add and only creates once instance
export class PostService {
  //
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>(); // rxjs

  constructor(private http: HttpClient, public router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    // for query parameters
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;

    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts; // from server
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  // get single post
  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/api/posts/' + id);
  }

  // for Subject/rxjs
  getPostUpdateListner() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    // to send form data rather than json
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title); // title for file name

    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']); // navigate home
      });
  }

  // update posts
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;

    // check what kind of image (objec tor json)
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      // string
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }

    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(() => {
        this.router.navigate(['/']); // navigate home
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete('http://localhost:3000/api/posts/' + postId);
  }
}
