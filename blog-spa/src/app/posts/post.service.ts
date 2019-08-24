import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' }) // important: 'root' to add and only creates once instance
export class PostService {
  //
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>(); // rxjs

  constructor() {}

  getPosts() {
    return [...this.posts]; // spread operator
  }

  // for Subject/rxjs
  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      // title: title,
      // content: content

      // shorthand notation
      title,
      content
    };
    this.posts.push(post);
    this.postUpdated.next([...this.posts]); // rxjs copy of post after update
  }
}
