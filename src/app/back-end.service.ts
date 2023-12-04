import { Injectable } from '@angular/core';
import { PostService } from './post.service';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  constructor(private postservice: PostService, private http: HttpClient) { }
  posts: Post[] = [];


  saveData() {
    const listofpost: Post[] = this.postservice.getPost();
    this.http.put('https://cc105-50dd5-default-rtdb.asia-southeast1.firebasedatabase.app/post.json', listofpost).subscribe((res)=>{console.log(res)})
  }

fetchData(){
  return this.http.get<Post[]>('https://cc105-50dd5-default-rtdb.asia-southeast1.firebasedatabase.app/post.json')
    .pipe
    (tap((listofpost: Post[]) => {
      listofpost.forEach(post =>{
        if (!Array.isArray(post.comments)){
          post.comments=[];
        }
        post.date = new Date(post.date)
      });
      this.postservice.setPosts(listofpost);
      this.postservice.listChangeEvent.emit(listofpost);
      console.log('listofpost')
    }));

}
ngOnInit() {
  this.fetchData().subscribe((data: Post[]) => {
    this.posts = data;
  });
}
}
