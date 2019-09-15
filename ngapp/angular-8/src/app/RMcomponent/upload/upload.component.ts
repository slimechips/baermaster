import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as json from '../../../assets/images/alldata (2).json';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class RequestUploadComponent implements OnInit {
    // Reason to Report
    dangerList: Array<number> = [
        7,
        14,
        16,
        17,
        18
    ];
    count: number = 0;
    clientData;
    key: Array<any> = [];
    value: Array<any> = [];
    waited: Boolean = false;
    loaded: Boolean = false;
    log: Array<String> = [];
    fileList: Array<String> = [];
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
  
    constructor(private _formBuilder: FormBuilder) {
    }
  
    ngOnInit() {
        this.clientData = json.data;
        Object.entries(this.clientData).forEach(([k,v])=>{
            this.key.push(k);
            this.value.push(v);
        })
        console.log(this.key)
        console.log(this.value)
    }

    onFileSelected(event){
        if(event.target.files.length > 0) 
        {
          console.log(event.target.files[0].name);
          console.log(event.target.files);
          this.fileList.push(event.target.files[0].name);
        }
    }

    async waiting(){
        if (!this.waited){
        // sleep for 5 seconds
        await this.delay(5000);
        this.waited = true;
        }
    }

    async loading(){
        if (!this.loaded){
        // sleep for 5 seconds
        this.log.push('Processing data...');
        await this.delay(1000);
        this.log.push('Gathering data from the real estate api');
        await this.delay(1000);
        this.log.push('Gathering data from financial credit');
        await this.delay(2000);
        this.log.push('Gathering data from social media');
        await this.delay(2000);
        this.log.push('Analysing the data');
        await this.delay(2000);
        this.loaded = true;
        }
    }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    };

    dropDownitem(event){
        console.log(event)
    }

    counter(){
        this.count++;
    }
}
