import { Injectable } from '@angular/core';
import { customerNews } from '../myComponent/suggested-reading/suggested-reading-example';
import { LoginComponent } from '../pages/login/login.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subscriber, Observable } from 'rxjs';

interface NewsObj {
  name: string;
  news: object[];
}

interface NewsArticle {
  title: string;
  img_url: string;
  summary: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService
{

  constructor(
    private http: HttpClient
  ) { }

  public getNews() {
    if (customerNews.length > 0) { return; }
    this._getNewsCall().subscribe((res) => {
      Object.entries(res).forEach(([key, value]: [string, object]) => {
        const newsObj: NewsObj = { name: value['name'], news: new Array<NewsArticle>() };
        for (let i = 0; i < 4; i++) {
          const newsArticle: NewsArticle = {
            title: value[`news_title_${i + 1}`],
            img_url: value[`news_imgurl_${i + 1}`],
            summary: value[`news_article_${i + 1}`],
            link: value[`news_url_${i + 1}`],
          };
          newsObj.news.push(newsArticle);
        }
        customerNews.push(newsObj);
      });
    });
  }

  public _getNewsCall(): Observable<any>
  {
    const apiUrl = `${environment.webSvcBaseUrl}/user/${LoginComponent.username}/news`;
    return this.http.get<any>(apiUrl);
  }
}
