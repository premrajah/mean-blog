import { Injectable } from '@angular/core';
import { Post } from './post.model';

@Injectable({providedIn: 'root'}) // important: 'root' to add and only creates once instance
export class PostService {
  private posts: Post[] = [];

  constructor() {}

  getPosts() {
    return [...this.posts]; // spread operator
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
  }
}
