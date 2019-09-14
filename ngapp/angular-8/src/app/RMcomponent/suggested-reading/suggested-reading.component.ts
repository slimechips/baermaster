import { Component, OnInit } from '@angular/core';
import {customerNews} from './suggested-reading-example';
import { NewsService } from '../../service/news.service';

@Component({
  selector: 'app-suggested-reading',
  templateUrl: './suggested-reading.component.html',
  styleUrls: ['./suggested-reading.component.css']
})
export class SuggestedReadingComponent implements OnInit {
    data = customerNews;
    constructor(private newsService: NewsService) { }

    ngOnInit() {
      this.newsService.getNews();
    }

}
