import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle = '';
  enteredContent = '';


  constructor(public postService: PostService) {}

  ngOnInit() {

  }

  onAddPost(form: NgForm) {

    // check form validity
    if (form.invalid) {
      return;
    }

    this.postService.addPost(form.value.title, form.value.content);

    //form.reset(); // reset form to default
  }

}

