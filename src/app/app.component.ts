import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls:  ['./app.component.css']
})
export class AppComponent {
  title = 'Admins';

  uid:     Observable<string>;
  isAdmin: Observable<boolean>;

  constructor(public af: AngularFire) {

    // AngularFire.auth is an Observable<FirebaseAuthState>
    // Update UI when auth-state changes
    // uid is an Observable<string>
    this.uid = this.af.auth.map(state => {
      if (state) {
        return state.google.uid;
      } else {
        return null;
      }
    });


    // When auth-state changes
    // request info about the current user.
    // which is an async DB call that returns an Observable<admin-user-profile>
    this.isAdmin = this.af.auth.switchMap(state => {
      if (state) {
        const uid = state.google.uid;

        // if the user-profile.value is truthy, this person is an Admin
        // watch for change to `value` as person might not stay an admin
        return this.af.database.object('/admins/' + uid)
          .map(obj => !!obj.$value);

      } else {
        return Observable.of(false);
      }
    });
  }

  login() {
    this.af.auth.login();
  }

  logout() {
    this.af.auth.logout();
  }
}
