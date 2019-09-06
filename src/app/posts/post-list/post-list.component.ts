import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  //
  spinnerIsLoading = false;
  posts: Post[] = [];
  userIsAuthenticated = false;
  userId: string;

  private postsSubscription: Subscription;
  private authStatusSubscription: Subscription;

  // for paginator
  totlePosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(
    public postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.spinnerIsLoading = true; // show spinner

    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();

    this.postsSubscription = this.postService
      .getPostUpdateListner()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.spinnerIsLoading = false;
        this.totlePosts = postData.postCount;
        this.posts = postData.posts;
      }); // three arguments next()|error()|completed()

    // check in t=service for user autha fter login
    this.userIsAuthenticated = this.authService.getIsAuthenticated();

    // auth status change
    this.authStatusSubscription = this.authService
      .getAuthStatusListner()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(postId: string) {
    this.spinnerIsLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangePage(pageData: PageEvent) {
    this.spinnerIsLoading = true;

    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe(); // to prevent memory leaks
    this.authStatusSubscription.unsubscribe();
  }
}
