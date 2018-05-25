import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/authentication/auth.service';
import { CookieService } from 'angular2-cookie/core';
import { DataService } from '../../common/data.service';
import { MessageService } from '../../common/message.service';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  enableNotify:boolean;
  enableVibrate:boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _authService: AuthService,
    private _cookieService: CookieService,
    private _dataService: DataService,
    private _msgService: MessageService
  ) {
    this.enableNotify = this._authService.enableNotify();
    this.enableVibrate = this._authService.enableVibrate();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }
  changeStatusNotify(){
    let flag:any;
    if(this.enableNotify){
      flag = '1';
    }else{
      flag = '0';
      this.enableVibrate = false;
    }     
    let arr = this._cookieService.getObject('setting');
    arr['notify']= flag;
    this._cookieService.putObject('setting',arr);
    this._dataService.createAlertWithoutHandle(this._msgService._msg_setting_disable_notification);
  }
  changeVibrate(){
    let flag = (this.enableVibrate==true)?'1':'0';
    let arr = this._cookieService.getObject('setting');
    arr['vibrate']= flag;
    this._cookieService.putObject('setting',arr);
  }
}
