import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  //
  posts: Post[] = [];
  private postsSubscription: Subscription;


  constructor(public postService: PostService) {
  }

  ngOnInit() {
    this.postService.getPosts();
    this.postsSubscription =  this.postService.getPostUpdateListner()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      }); // three arguments next()|error()|completed()
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe(); // to prevent memory leaks
  }
}
