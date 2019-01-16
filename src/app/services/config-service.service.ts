import { Injectable } from '@angular/core';

import { AngularFirestore} from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Config } from '../classes/Config';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  config: Observable<Config[]>;

  constructor(private db: AngularFirestore) { }

  getConfig(){
    this.config = this.db.collection('config').snapshotChanges().pipe(map( changes => {
      return changes.map( a => {
        const data = a.payload.doc.data() as Config;
        data.id = a.payload.doc.id
        return data;
      });
    }));
    return this.config;
  }
}
