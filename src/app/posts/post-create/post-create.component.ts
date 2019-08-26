import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';

  spinnerIsLoading = false;

  form: FormGroup;
  imagePreview = '';

  private mode = 'create';
  private postId: string;
  post: Post;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {validators: [Validators.required]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // show spinner
        this.spinnerIsLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          // hide spinner
          this.spinnerIsLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };

          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    // check form validity
    if (this.form.invalid) {
      return;
    }
    // show spinner
    this.spinnerIsLoading = true;

    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }

    this.form.reset(); // reset form to default
  }


  // image selection
  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]; // type conversion
    this.form.patchValue({image: file});

    // imform the form that the validaty is changed
    this.form.get('image').updateValueAndValidity();

    // convert image to data url
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = (reader.result as string);
    };
    reader.readAsDataURL(file);

    console.log(file);
    console.log(this.form);
  }
}
