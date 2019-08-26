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
  private postsUpdated = new Subject<Post[]>(); // rxjs

  constructor(private http: HttpClient, public router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts; // from server
        this.postsUpdated.next([...this.posts]);
      });
  }

  // get single post
  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + id
    );
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

        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };

        // optimesting updating
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); // rxjs copy of post after update
        this.router.navigate(['/']); // navigate home
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        // keep entries that are not equal
        const updatedPost = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // update posts
  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content, imagePath: null };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        console.log(response);
        const updatedPost = [...this.posts]; // clone
        const oldPostIndex = updatedPost.findIndex(p => p.id === post.id);

        updatedPost[oldPostIndex] = post;
        this.posts = updatedPost;

        // update
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']); // navigate home
      });
  }
}
