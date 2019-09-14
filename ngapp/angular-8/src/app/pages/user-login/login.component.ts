import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import { Router } from '@angular/router';
import { Alert } from 'selenium-webdriver';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class UserLoginComponent implements OnInit {

    static username: String = 'rahul';
    loginForm: FormGroup;
    error: Boolean = false;
    submitted: Boolean = false;
    constructor(private _auth: AuthService,
                private _router: Router,
                private fb: FormBuilder) {}

    ngOnInit() {
        this.loginForm = this.fb.group({
            userId: ['', Validators.required],
            password: ['', Validators.required]
        })
    }

    loginUser(){
            console.log(this.loginForm.value);
            this.submitted = true;
            // check if it is empty
            if (this.loginForm.invalid){
                return;
            }
            // authenticate the login
            this._auth.loginUser(this.loginForm.value.userId,this.loginForm.value.password)
            .subscribe(
            res => {
                UserLoginComponent.username = res.username;
                this._router.navigate(['/rm/profile']);
            },
            err => {
                console.log(err)
                this.error = true;
                console.log('user id or password are not correct')}
            )
    }

    forgetPassword(){
        console.log("too bad");
    }
}
