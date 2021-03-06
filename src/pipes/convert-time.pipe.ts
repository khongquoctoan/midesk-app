import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'toTime',
    pure: false
})

export class ConvertTime implements PipeTransform {
    transform(val:any) {
        if(typeof val == 'string'){
            val = Date.parse(val)/1000;
        }
        var tmp =  new Date().toString();
        var now = Date.parse(tmp)/1000;
        var compare = now - val;
        if(compare < 60){
            val = "ngay bây giờ ";
        }
        else if(compare <= 3600){
            val = Math.round(compare/60)+" phút trước";
        }
        else if(compare > 3600 && compare < 86400){
            val = Math.round(compare/3600)+" giờ trước";
        }
        else{
            let time = new Date(val*1000);
            let day = (time.getDate()<10)?'0'+time.getDate():time.getDate();
            let month = (time.getMonth()+1<10)?'0'+(time.getMonth()+1):time.getMonth()+1;
            let year = time.getFullYear();
            let hour = (time.getHours()<10)?'0'+time.getHours():time.getHours();
            let minute = (time.getMinutes()<10)?'0'+time.getMinutes():time.getMinutes();
            let aa = (time.getHours()>11)?'pm':'am';
            val = day+'/'+month+'/'+year +' '+hour +':'+minute+' '+aa;
            // val = day+'/'+month+'/'+year;
        }
        return val;
  }
}