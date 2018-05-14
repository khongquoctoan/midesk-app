import { NotificationsService } from './../../services/notifications.service';
import { Component, ViewChild, Injectable } from '@angular/core';
import { NavController, Select, Platform, ModalController, PopoverController, /*Events*/ } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from './../../services/authentication/auth.service';
import { TicketService } from './../../services/ticket.service';
import { TicketDetailPage } from './../ticket/ticket-detail/ticket-detail';
import { ModalSearchTicket } from './../../components/modal/modal-search-ticket/modal-search.component';
import { PopoverSort } from './../../components/popover/popover-sort/popover-sort';
import { PopoverChannel } from './../../components/popover/popover-channel/popover-channel';
import { SocketService } from '../../common/socket.service';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { FCM } from '@ionic-native/fcm';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
@Injectable()
export class HomePage {
  @ViewChild('sectionSelect') sectionSelect: Select;
  @ViewChild('popoverChannel') popoverChannel: Select;
  arraySort:any=[
      { id: 'desc', name: 'Mới nhất', value: 'desc' },
      { id: 'asc', name: 'Cũ nhất', value: 'asc' },
  ];
  // arrayFilter:any=[
  //     { id:'filter1', name:'Yêu cầu tạo bởi bạn', value:'yêu cầu được tạo bởi bạn' },
  //     { id:'filter3',name:'Yêu cầu chưa phân công', value: 'yêu cầu chưa phân công' },
  //     { id:'filter4', name:'Yêu cầu đang chờ xử lý', value: 'yêu cầu đang chờ xử lý' },
  //     { id:'filter5', name:'Yêu cầu đã xử lý', value: 'yêu cầu đã xử lý' },
  //     { id:'filter6', name:'Yêu cầu chưa giải quyết', value: 'yêu cầu chưa giải quyết' }
  // ];
  arrayFilter:any=[
    { id:'filter1', name:'Phiếu chưa giải quyết của bạn', value: 'yêu cầu chưa giải quyết của bạn' },
    { id:'filter2', name:'Phiếu chưa giải quyết trong bộ phận', value: 'yêu cầu chưa giải quyết trong bộ phận' },
    { id:'filter3', name:'Phiếu chưa phân công', value: 'yêu cầu chưa phân công' },
    { id:'filter4', name:'Phiếu đang chờ xử lý', value: 'yêu cầu đang chờ xử lý' },
    { id:'filter5', name:'Phiếu đã xử lý', value: 'yêu cầu đã xử lý' },
    { id:'filter6', name:'Phiếu tạo bởi bạn', value: 'yêu cầu tạo bởi bạn' }
];
  status:any=[
      { id : 1, name : 'Mở mới', value : 'new', color : '#C8C800', alias: 'n', checked: false  },
      { id : 2, name : 'Đang mở', value : 'open', color : '#C80000', alias: 'o', checked: false },
      { id : 3, name : 'Đang chờ', value : 'pending', color : '#15BDE9', alias: 'p', checked: false },
      { id : 4, name : 'Đã xử lý', value : 'solved', color : '#CCCCCC', alias: 's', checked: false }
  ];
  priority=[];
  filterTicket:any={
  	filterBy:'yêu cầu chưa giải quyết của bạn',
  	sortBy:'desc'
  };
  modelTicket:any={
  	dataItems:[],
  	dataPage:1,
    dataLoading:false,
    dataTotal:0,
    loadMore:false,
    filterBy:'yêu cầu chưa giải quyết của bạn',
    sortBy:[],
    channel:'all',
  };
  filterOption = {
    cssClass: 'my-class'
  } 
  countList:any=[];
  countNotify:any;
  room:any={};
  deviceToken:any;
  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private _ticketService: TicketService,
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private modalCtrl: ModalController,
    private _authService: AuthService,
    private _notifyService: NotificationsService,
    private _socketService: SocketService,
    private _socket: Socket,
    private _fcm: FCM
    ) {
    // _fcm.getToken().then(token=>{
    //   this.deviceToken = token;
    // })
    this.room=JSON.parse(_authService.getLoggedInRoom());
    let self = this;
    setTimeout(function(){
      self.connectSocket();
    },2000);
    this.listenEventNewNotifi();
  }
  connectSocket(){
    //this.room= JSON.parse(this._authService.getLoggedInRoom());
    this._socket.connect();
    this._socket.emit('room',this.room);
  }
  disconnectSocket(){
    this._socket.disconnect();
  }
  ionViewDidLoad(){
    this.initListTicket();
    this.priority = this._authService.getPriority();
    this.loadCountTicket();
  }
  loadCountTicket(){
    this._notifyService.countNewNotifications().subscribe(res=>{ this.countNotify = res;});
      this._ticketService.countTicket().subscribe(res=>{
        this.countList['filter1'] = res.filter1;
        this.countList['filter2'] = res.filter2;
        this.countList['filter3'] = res.filter3;
        this.countList['filter4'] = res.filter4;
        this.countList['filter5'] = res.filter5;
        this.countList['filter6'] = res.filter6;
    })
  }
  initListTicket(){
    this.modelTicket.dataLoading = true;
    this._ticketService.getListTicket(this.modelTicket).subscribe(res=>{
      this.modelTicket.dataItems = res.data;
      if(res.next_page_url!==null) this.modelTicket.loadMore = true;
      else this.modelTicket.loadMore = false;
      this.modelTicket.dataLoading = false;
    });
  }
  doRefresh(refresher) {
      this.modelTicket.dataPage = 1;
      this.modelTicket.dataTotal = 0;
      this.initListTicket();
      refresher.complete();
  }
  doInfinite(infiniteScroll){
  	this.modelTicket.dataPage += 1;
  	this._ticketService.getListTicket(this.modelTicket).subscribe(res=>{
  		this.modelTicket.dataItems.push(...res.data);
  		if(res.next_page_url!==null) this.modelTicket.loadMore = true;
      else this.modelTicket.loadMore = false;
      this.modelTicket.dataLoading = false;
      infiniteScroll.complete();
  	})
  }
  openModal(){
    let contactModal = this.modalCtrl.create(ModalSearchTicket);
    contactModal.present();
  }
  doSort(){
  	this.sectionSelect.open();
  }
  clickTicket(index){
  	console.log(index);
    this.navCtrl.push(TicketDetailPage,{data:index});
  }
  doFilter(){
    this.modelTicket.dataItems=[];
    this.modelTicket.dataPage=1;
    this.modelTicket.dataTotal=0;
    this.initListTicket();
    console.log(this.modelTicket.filterBy);
  }
  openPopoverSort(myEvent) {
    let data = {priority:this.priority,status:this.status}
    let popover = this.popoverCtrl.create(PopoverSort,data,{cssClass:"custom-sort",enableBackdropDismiss: true });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data=>{
      if(typeof data!=undefined && data!=null){
        this.modelTicket.sortBy=data;
        this.modelTicket.dataPage=1;
        this.modelTicket.dataTotal=0;
        this.initListTicket();
      }
      console.log(data);
      //
    });
  }
  openPopoverChannel(myEvent){
    let data = this.modelTicket.channel;
    let popover = this.popoverCtrl.create(PopoverChannel,{data:data},{cssClass:"custom-channel",enableBackdropDismiss: true });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data=>{
      if(typeof data!=undefined && data !=null){     
        this.modelTicket.channel = data.channel;
        this.modelTicket.dataPage=1;
        this.modelTicket.dataTotal=0;
        this.initListTicket(); 
      }
    });
  }
  listenEventNewNotifi(){
    this._socket.on('NEW NOTIFI',data=>{
      console.log(data);
      let del_agent = data[0]['del_agent'];
      let view = data[0]['view'];
      let userId = this._authService.getLoggedInUser().id;
      let title = data[0]['title'];
      var regex = /(<([^>]+)>)/ig
      title = title.replace(regex, "");
      if(del_agent != userId && view != userId){ //thong bao tu nguoi khac tao
        let body:any={
          title: title,
          data:JSON.parse(data[0]['custom']),
        }
        this.pushNotifications(body);
      }
      else{
        console.log('NOT');
      }
      this.loadCountTicket();
    })
  }
  pushNotifications(data:any={}){
      let body ={
        "notification":{
          "title":"Bạn có thông báo mới!",
          "body":data.title,
          "sound":"default",
          "click_action":"FCM_PLUGIN_ACTIVITY",
          "icon":"fcm_push_icon",
          "forceStart": "1"
          },
        "data":data.data,
        "to":"/topics/all",
        "priority":"high",
        "restricted_package_name":""
      }
      this._ticketService.pushNotifications(body).subscribe();
  }
}
