import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule, RequestOptions } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CookieService } from 'angular2-cookie/core';
import { Keyboard } from '@ionic-native/keyboard';

import { SettingService } from './common/setting.service';
import { UserService } from './services/user.service';
import { TicketService } from './services/ticket.service';
import { AuthService } from './services/authentication/auth.service';
import { AuthRequestOptions } from './services/authentication/auth-request.service';

import { MyApp } from './app.component';
import { HomePage } from './../pages/home/home';
import { ListPage } from './../pages/list/list';
import { LoginPage } from './../pages/login/login';
import { TicketAddPage } from './../pages/ticket/ticket-add/ticket-add';
import { TicketDetailPage } from './../pages/ticket/ticket-detail/ticket-detail';
import { ModalAssign } from './../pages/ticket/ticket-add/modal-assign/modal-assign';
import { ModalRequester } from './../pages/ticket/ticket-add/modal-requester/modal-requester';
import { ModalProperties } from './../pages/ticket/ticket-add/modal-properties/modal-properties';

import { ModalSearchComponent } from './components/modal-search/modal-search.component';
import { PopoverSort } from './components/popover/popover-sort';
import { PopoverChannel } from './components/popover/popover-channel';
import { PopoverCategory } from './../pages/ticket/ticket-add/popover-category/popover-category';

import { GetFirstCharacter } from './pipes/get-first-character.pipe';
import { ConvertLengthTitle } from './pipes/convert-length-title.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    TicketAddPage,
    TicketDetailPage,
    ModalAssign,
    ModalRequester,
    ModalProperties,
    ModalSearchComponent,
    GetFirstCharacter,
    ConvertLengthTitle,
    SafeHtmlPipe,
    PopoverSort,
    PopoverChannel,
    PopoverCategory
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
  ],
  exports:[
    GetFirstCharacter,
    ConvertLengthTitle,
    SafeHtmlPipe
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    TicketAddPage,
    TicketDetailPage,
    ModalAssign,
    ModalRequester,
    ModalProperties,
    ModalSearchComponent,
    PopoverSort,
    PopoverChannel,
    PopoverCategory
    //GetFirstCharacter
  ],
  providers: [
    CookieService,
    SettingService,
    UserService,
    TicketService,
    AuthService,
    StatusBar,
    SplashScreen,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {
      provide: RequestOptions,
      useClass: AuthRequestOptions  //automatically appending headers to every request.
    }
  ]
})
export class AppModule {}
