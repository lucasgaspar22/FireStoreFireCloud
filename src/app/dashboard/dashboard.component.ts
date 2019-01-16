import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../services/config-service.service'
import { StorageService } from '../services/storage.service'
import { Config } from '../classes/config';
import { StoredFile } from '../classes/file';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material'

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  config = new Config();
  files: StoredFile[] = [];


  displayedColumns: string[] = ['nome', 'id'];
  dataSource = new MatTableDataSource<StoredFile>(this.files);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  uploadProgress: any;

  constructor(private configService: ConfigService, private storageService: StorageService, private toastr: ToastrService) { }

  ngOnInit() {

    // Get config to download section
    this.configService.getConfig().subscribe((res: Config[]) => {
      this.config = res[0];
    });

    // Get File names
    this.storageService.getFiles().subscribe((res: StoredFile[]) => {
      this.files = res;
      this.dataSource = new MatTableDataSource<StoredFile>(this.files);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  upload(event) {
    this.storageService.uploadFiles(event).subscribe(percent => {
      this.uploadProgress = percent
      if (percent == 100) {
        this.uploadProgress = 0;
        this.storageService.addFile(event.target.files[0].name);
        this.toastr.success('Sucesso, o arquivo foi salvo no FireStore!','Deu bom!',{
          timeOut:2000
        });
      }
    });

  }


  getDowloadLink(fileName: string) {
    this.storageService.downloadFile(fileName).subscribe(res => {
      window.open(res, "_blank")
    })
  }

}