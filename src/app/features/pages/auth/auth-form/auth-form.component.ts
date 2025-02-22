import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';


@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styles: ['']
})
export class AuthFormComponent implements OnInit {
  authForm!: FormGroup;
  signIn = 'login';
  signUp = 'register';
  @Input() options!: {
    id: string,
    label: string
  };

  constructor(private readonly fb: FormBuilder, private authSvc: AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(option: string): void {
    if (option === this.signIn && this.authForm.valid) {
      this.authSvc.login(this.authForm.value).subscribe()
      this.initForm();
    } else if(this.authForm.invalid && option === this.signIn) {
      console.log('Form login is invalid');
    }

    if (option === this.signUp && 
      this.authForm.value.password === this.authForm.value.password_again &&
      this.authForm.valid) {
      this.authSvc.register(this.authForm.value).subscribe()
      this.initForm();
    } else if(this.authForm.invalid && option === this.signUp) {
      console.log('Form register is invalid');
    }
  }

  private initForm(): void {
    if (this.signIn === this.options.id) {
      this.authForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      })
    } else {
      this.authForm = this.fb.group({
        name: ['', [Validators.required, Validators.pattern(/[a-zA-Z]/), Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['',
          [Validators.required,
          // 2. check whether the entered password has a number
          Validators.pattern(/[0-9]/),
          // 4. check whether the entered password has a letter
          Validators.pattern(/[a-zA-Z]/),
          // 5. check whether the entered password has a special character
          Validators.pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/),
          // 6. Has a minimum length of 6 characters
          Validators.minLength(6)]],
        password_again: ['', [Validators.required, Validators.pattern]]
      })
    }
  }

}
