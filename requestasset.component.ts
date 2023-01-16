import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { _MatListItemGraphicBase } from '@angular/material/list';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { SystemFormService } from 'src/app/shared/service/system-form.service';
import { __values } from 'tslib';

@Component({
  selector: 'app-requestasset',
  templateUrl: './requestasset.component.html',
  styleUrls: ['./requestasset.component.sass']
})
export class RequestassetComponent implements OnInit {
  assets: any;
  sortAsset = [];
  innerAssetData: any;
  assetsInnerDataDetailsIndex: number = -1
  @ViewChild('picker') date!: ElementRef;

  assetForm: FormGroup;
  projects$: Observable<any>
  loadData: HttpResponse<any>;
  getAllAssets: any;
  loadAPIData: any;

  constructor(private systemFormService: SystemFormService, private fb: FormBuilder) {
    this.assetForm = this.fb.group({
      assetsDetails: this.fb.array([]),
    });

  }
  ngOnInit(): void {
    this.getAssetsForm();
  }
  assetsDetails(): FormArray {
    return this.assetForm.get("assetsDetails") as FormArray;
  }
  newAssetsForm(data:any): FormGroup {
    return this.fb.group({
      data: [data]

    });

  }

  getAssetsForm(): void {
    this.systemFormService.getForm('001').subscribe((res: HttpResponse<any>) => {
      this.assets = res.body
      this.getAllAssets =res.body
      this.getLoadAPI();
      // for (let a = 0; a < this.assets.length; a++) {
      //   console.log(this.assets[a].name)
      //   this.assetsDetails().push(this.newAssetsForm(this.assets[a].loadField, this.assets[a].loadAPI));
      //   if (!this.assetsDetails().controls[a]["controls"].loadAPI.value ==null) {
      //     this.systemFormService.assetsLoadData(this.assetsDetails().controls[a]["controls"].loadAPI.value).subscribe((res: HttpResponse<any>) => {
      //       // this.assetsDetails().at(a).patchValue({ data: res.body });
      //     })
      //    }
      //   // this.assetForm.addControl(this.assets[a].name, new FormControl('', Validators.required));
      // }
      const group: FormGroup = new FormGroup({});
      this.getAllAssets.forEach((fg:any) => {
        const formGroup: FormGroup = new FormGroup({});
        const nCtrol = {
          name: fg.name,
          control: fg.isRequired
            ? new FormControl(fg.defaultValue || '', Validators.required)
            : new FormControl(fg.defaultValue || ''),
        };
        formGroup.addControl(fg.name, nCtrol.control);

        group.addControl(fg.name, formGroup);
      });
      this.assetForm = group;
      console.log(this.assetForm.value)
    })
  }

  onSubmit(): void {
    console.log(this.assetForm.value)
  }
  selectedAssetsInnerData(selectedValue: any, linkCode: string, selectedAssetsDetailIndex: number): void {
    console.log(selectedValue)
    // this.clearAssetsForm(this.assetsInnerDataDetails(selectedAssetsDetailIndex));
    this.systemFormService.assetsInnerData(selectedValue.value, linkCode).subscribe((res: HttpResponse<any>) => {
      this.innerAssetData = res.body
      const group: FormGroup = new FormGroup({});
      this.innerAssetData.forEach((fg) => {
        console.log(fg)
        const formGroup: FormGroup = new FormGroup({});
        const nCtrol = {
          name: fg.name,
          control: fg.isActive
            ? new FormControl(fg.defaultValue || '', Validators.required)
            : new FormControl(fg.defaultValue || ''),
        };

        formGroup.addControl(fg.name, nCtrol.control);


        group.addControl(fg.name, formGroup);
      });
      this.assetForm = group;
    })
  }
  clearAssetsForm = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  getCurrentDate(event: any, assetsInnerDataDetailsIndex: number): void {
    const momentDate = new Date(event.value); // Replace event.value with your date value
    const formattedDate = moment(momentDate).format("YYYY/MM/DD");
    if (assetsInnerDataDetailsIndex == 0) {
      this.assetForm.patchValue({
        fromDate: formattedDate
      });
    }
    else {
      this.assetForm.patchValue({
        toDate: formattedDate
      });
    }
  }
  getLoadAPI () : void {
    this.assetsDetails().push(this.newAssetsForm(this.loadAPIData))
    for(let i=0;i<this.getAllAssets.length;i++){
        console.log("kushan")
        this.systemFormService.assetsLoadData(this.getAllAssets[i].loadAPI).subscribe((res: any) => {
          // this.assetsDetails().at(a).patchValue({ data: res.body });
          this.loadAPIData= res.body
          console.log(res.body)
         
         
        // this.assetsDetails().at(i).patchValue({ data: res.body });
        })
       
    }
   
  }
}




