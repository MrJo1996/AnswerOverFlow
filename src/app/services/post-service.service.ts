import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Promise} from "q";

@Injectable({
    providedIn: 'root'
})
export class PostServiceService {
    workid;
    id;
    table;
    tablen;
    user_Name = '';
    user_Surname = '';
    user_id;
    user_email = '';
    user_tabella;
    session;
urlimg;
    constructor(public http: HttpClient) {
    }

    postService(body, url): Promise<any> {
        return Promise((res, rej) => {
            this.http.post<any>(url, body)
                .subscribe(data => {
                    res(data);
                    rej(data.error);
                });
        });
    }
    deleteService( url,body): Promise<any> {
        return Promise((res, rej) => {
            this.http.delete<any>(url,body)
                .subscribe(data => {
                    res(data);

                });
        });
    }
    
}