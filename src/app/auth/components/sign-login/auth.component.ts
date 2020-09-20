import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, throwError, pipe } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  @ViewChild('typeRef') typeRef: ElementRef<HTMLInputElement>;
  @ViewChild('registerRef') registerRef: ElementRef<HTMLInputElement>;
  @ViewChild('loginRef') loginRef: ElementRef<HTMLInputElement>;

  subscriptions: Subscription = new Subscription();
  authType: String = '';
  title: String = '';
  isLogin: boolean = true;
  isSubmitting = false;
  errMessage: string;
  registerErrMsg: string;
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder) {
    // pre login check
    this.subscriptions.add(this.authService.isLoggedIn().subscribe(tokenExist => {
      if (tokenExist) {
        this.router.navigate(['home']);
      }
      // use FormBuilder to create a form group
      this.loginForm = this.fb.group({
        'username': ['', Validators.required],
        'password': ['', Validators.required]
      });
      // use FormBuilder to create a form group
      this.registerForm = this.fb.group({
        'username': ['', Validators.required],
        'email': ['', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])],
        'password': ['', Validators.required],
        'terms': ['', Validators.required]
      });
    }));
  }

  ngOnInit() {
    // this.route.url.subscribe(data => {
    //   // Get the last piece of the URL (it's either 'login' or 'register')
    //   this.authType = data[data.length - 1].path;
    //   // Set a title for the page accordingly
    //   this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';
    //   // add form control for username if this is the register page
    //   if (this.authType === 'register') {
    //     this.loginForm.addControl('username', new FormControl());
    //     this.registerForm.addControl('username', new FormControl());
    //   }
    // });
  }

  submitForm(isLogin) {
    this.isSubmitting = true;
    if (isLogin) {
      if (this.loginForm.invalid) {
        this.errMessage = "Please fill up the form correctly"
        return;
      }
      const credentials = this.loginForm.value;
      this.authService.login(credentials.username, credentials.password).subscribe(result => {
        if (result.message === "Auth successful") {
          this.authService.saveToLocalStorage(result.token);
          this.authService.isLoginSubject.next(true);
        }
      }, err => {
        // auth failed msg
        this.errMessage = err.error.message
      })
    } else {
      if (this.registerForm.invalid) {
        this.registerErrMsg = "Please fill up the form correctly"
        return;
      }
      const credentials = this.registerForm.value;
      this.authService.signup(credentials).pipe(
        finalize(() => this.registerForm.reset()))
        .subscribe((result) => { this.registerErrMsg = result.message }
          ,err => {
            this.registerErrMsg = err.error.message;
          })
    }
  }

  toggleForm(isLogin) {
    if (!isLogin) {
      this.typeRef.nativeElement.style.left = "110px";
      this.registerRef.nativeElement.style.left = "50px";
      this.loginRef.nativeElement.style.left = "-400px";
    } else {
      this.typeRef.nativeElement.style.left = "0px";
      this.registerRef.nativeElement.style.left = "450px";
      this.loginRef.nativeElement.style.left = "50px";
    }
  }

  goToSignup() {
    this.router.navigate(['signup']);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
