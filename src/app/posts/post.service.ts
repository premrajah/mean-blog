import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' }) // important: 'root' to add and only creates once instance
export class PostService {
  //
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>(); // rxjs

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
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
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
  }

  // for Subject/rxjs
  getPostUpdateListner() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe(responseData => {
        // recieve response
        const id = responseData.postId;
        post.id = id; // overwrite with response id

        // optimesting updating
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); // rxjs copy of post after update
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
    const post: Post = { id: id, title: title, content: content };
    this.http.put('http://localhost:3000/api/posts/' + id, post)
    .subscribe(response => {
      console.log(response);
      const updatedPost = [...this.posts]; // clone
      const oldPostIndex = updatedPost.findIndex((p => p.id === post.id));

      updatedPost[oldPostIndex] = post;
      this.posts = updatedPost;

      // update
      this.postsUpdated.next([...this.posts]);

    });
  }
}
