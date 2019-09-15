import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as json from '../../../assets/images/alldata.json';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
    clientData;
    log: Array<String> = [];
    fileList: Array<String> = [];
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
  
    constructor(private _formBuilder: FormBuilder) {}
  
    ngOnInit() {
        this.clientData = json.basic_data;
    }

    onFileSelected(event){
        if(event.target.files.length > 0) 
        {
          console.log(event.target.files[0].name);
          console.log(event.target.files);
          this.fileList.push(event.target.files[0].name);
        }
    }

    async loading(){
        alert('submitted')
    }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    };


}
