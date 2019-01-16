import { Injectable } from '@angular/core';

import { AngularFireStorage , AngularFireUploadTask  } from 'angularfire2/storage'
import { AngularFirestore} from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StoredFile } from '../classes/file';



@Injectable({
  providedIn: 'root'
})
export class StorageService {

  files: Observable<StoredFile[]>;
  uploadTask : AngularFireUploadTask;
  uploadProgress: Observable<number>;


  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }

  downloadFile(filename: string){
    let filePath = `files/${filename}`;
    return this.storage.ref("").child(filePath).getDownloadURL();
  }

  uploadFiles(event: any){
    this.uploadTask = this.storage.ref("").child(`files/${event.target.files[0].name}`).put(event.target.files[0])
    this.uploadProgress = this.uploadTask.percentageChanges();
    return this.uploadProgress;
  }
 
  addFile(filename:string){
    this.db.collection('files').add({nome:filename})
  }

  getFiles(){
    this.files = this.db.collection('files').snapshotChanges().pipe(map( changes => {
      return changes.map( a => {
        const data = a.payload.doc.data() as StoredFile;
        data.id = a.payload.doc.id
        return data;
      });
    }));
    return this.files;
  }
}
