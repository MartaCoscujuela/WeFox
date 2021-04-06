import { of, throwError } from 'rxjs';
import { PostsService } from './posts.service';
import { posts as initPosts } from './samplePosts';
import { Post } from './post.model'
import { HttpErrorResponse } from '@angular/common/http';
let httpClientSpy;

describe('PostsService', () => {
  let service: PostsService;

  let samplePosts: Post[]

  beforeEach(() => {
    samplePosts = [...initPosts]
    httpClientSpy = jasmine.createSpyObj(['get', 'post', 'put', 'delete'])
    service = new PostsService(httpClientSpy as any); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPosts()', () => {


    it("should call the http method get if it does not have the posts in memory when the getposts method is called",
      () => {
        httpClientSpy.get.and.returnValue(of(samplePosts));
    
        service.getPosts();
    
        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
      })
  
    it("should NOT call the http method get if it does have the posts in memory when the getposts method is called",
      () => {
        httpClientSpy.get.and.returnValue(of(samplePosts));
        service['posts'] = samplePosts

        service.getPosts();
    
        expect(httpClientSpy.get).toHaveBeenCalledTimes(0);
      })
  
  
    it("should populate the posts array when calling the http get method",
      () => {
        httpClientSpy.get.and.returnValue(of(samplePosts));

        service.getPosts();

        expect(service['posts']).toEqual(samplePosts);
      })
  });

  describe('getUpdatedPosts()', () => {

    it("should return the list of posts ",
      () => {
        service['posts'] = samplePosts;
    
        service.getUpdatedPosts().subscribe((posts) => {
          expect(posts).toBe(samplePosts)
        });
        
        service.getPosts();
     })
  });

  describe('get post', () => {

    xit("should get the post from the list of posts if it is already populated",
      () => {
        service['posts'] = samplePosts;
    
        service.getPost(1).subscribe((post) => {
          expect(post).toBe(samplePosts[0])
        });
        
      })
    
    it("should call the http get method if the list is empty",
      () => {
        httpClientSpy.get.and.returnValue(of(samplePosts[0]));
    
        service.getPost(1).subscribe((post) => {
          expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
        });
        
      })
    
        
    it("should not call the http get method if the list is not empty",
      () => {
        service["posts"] = samplePosts

        httpClientSpy.get.and.returnValue(of(samplePosts[0]));
    
        service.getPost(1).subscribe((post) => {
          expect(httpClientSpy.get).toHaveBeenCalledTimes(0);
        });
        
      })
    
    it('should call the error handler when the server returns an error', () => {
      const errorResponse = new HttpErrorResponse({
        status: 404,
      });
      httpClientSpy.get.and.returnValue(throwError(errorResponse));

      service.getPost(1).subscribe(
        {
          error: (error) => {
            expect(error).toContain('Something bad happened')
          }
        }
      )
    });
  });

  describe('add post', () => {

    it("should call the add post http method",
      () => {
        service["posts"] = samplePosts;
        const newPost = {
          title: "Santiago",
          content: "Lorem Ipsum"
        }

        httpClientSpy.post.and.returnValue(of(samplePosts[0]));
    
        service.addPost(newPost).subscribe((post) => {
          expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
        });
        
      })
    
    it("should add the post to the array",
      () => {
        service["posts"] = samplePosts;

        const newPost = {
          title: "Santiago",
          content: "Lorem Ipsum"
        }
        
        httpClientSpy.post.and.returnValue(of(samplePosts[0]));
    
        service.addPost(newPost).subscribe((post) => {
          expect(service["posts"].length).toBe(4);
        });
      })
    
    
      it('should call the error handler when the server returns an error', () => {
        const errorResponse = new HttpErrorResponse({
          status: 404,
        });
        const newPost = {
          title: "Santiago",
          content: "Lorem Ipsum"
        }
        httpClientSpy.post.and.returnValue(throwError(errorResponse));

        service.addPost(newPost).subscribe(
          {
            error: (error) => {
              expect(error).toContain('Something bad happened')
            }
          }
        )
      });
    });



  describe('update post', () => {

    it("should call the update post http method",
      () => {
        service["posts"] = samplePosts;
        const updatedPost = {
          id: 1,
          title: "Santiago",
          content: "Lorem Ipsum"
        }

        httpClientSpy.put.and.returnValue(of(samplePosts[0]));
    
        service.updatePost(updatedPost, updatedPost.id).subscribe((post) => {
          expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
        });
        
      })
    
    it("should update the post in the array",
      () => {
        service["posts"] = samplePosts;
        const updatedPost = {
          id: 1,
          title: "Santiago",
          content: "Lorem Ipsum"
        }
        httpClientSpy.put.and.returnValue(of(updatedPost));
    
        service.updatePost(updatedPost, updatedPost.id).subscribe((post) => {
          expect(service["posts"][0].title).toEqual("Santiago");
        });
      })
     
      it('should call the error handler when the server returns an error', () => {
        const errorResponse = new HttpErrorResponse({
          status: 404,
        });
        const updatedPost = {
          id: 1,
          title: "Santiago",
          content: "Lorem Ipsum"
        }
        httpClientSpy.put.and.returnValue(throwError(errorResponse));

        service.updatePost(updatedPost, updatedPost.id).subscribe(
          {
            error: (error) => {
              expect(error).toContain('Something bad happened')
            }
          }
        )
      });

  });

 describe('delete post', () => {

    it("should call the delete post http method",
      () => {
        service["posts"] = samplePosts;
        const deleteId = 1;

        httpClientSpy.delete.and.returnValue(of(true));
    
        service.deletePost(deleteId).subscribe((post) => {
          expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
        });
        
      })
    
    it("should delete the post in the array",
      () => {
        service["posts"] = samplePosts;
        const deleteId = 1; 
        httpClientSpy.delete.and.returnValue(of(true));
    
        service.deletePost(deleteId).subscribe(() => {
          expect(service["posts"].length).toBe(2);
        });
      })
   
       it('should call the error handler when the server returns an error', () => {
        const errorResponse = new HttpErrorResponse({
          status: 404,
        });
        const deleteId = 1; 
        httpClientSpy.delete.and.returnValue(throwError(errorResponse));

        service.deletePost(deleteId).subscribe(
          {
            error: (error) => {
              expect(error).toContain('Something bad happened')
            }
          }
        )
      });
  });
})
