import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MustMatch} from '../../utils/must-match.validator';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class ClientRegisterComponent implements OnInit {
    registerForm: FormGroup;
    submitted = false;
    constructor(private _router: Router, private fb: FormBuilder){}
    ngOnInit() {
        this.registerForm = this.fb.group({
            fullName: ['', Validators.required],
            userId: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
        },{
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    // easy access from the html form
    get f() {
        return this.registerForm.controls;
    }

    registerUser() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }

        // attempting to register

        console.log(this.registerForm.value);
        this._router.navigate(['login']);
      //   this._auth.loginUser(this.userData)
      //     .subscribe(
      //         res => console.log(res),
      //         err => console.log(err)
      //     )
    }
}
