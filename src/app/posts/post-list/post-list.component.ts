import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  //
  spinnerIsLoading = false;
  posts: Post[] = [];
  private postsSubscription: Subscription;

  // for paginator
  totlePosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];


  constructor(public postService: PostService) {
  }

  ngOnInit() {
    this.spinnerIsLoading = true; // show spinner

    this.postService.getPosts();
    this.postsSubscription =  this.postService.getPostUpdateListner()
      .subscribe((posts: Post[]) => {
        this.spinnerIsLoading = false;
        this.posts = posts;
      }); // three arguments next()|error()|completed()
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  onChangePage(pageData: PageEvent){
    console.log(pageData);
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe(); // to prevent memory leaks
  }
}
