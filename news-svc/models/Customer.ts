export class Customer {
  obj: CustomerObj;

  constructor(obj: CustomerObj) {
    this.obj = obj;
  }

  public getInterests(): string {
    const interests: Interests = {
      interests_industry: this.obj.interests_industry,
      interests_inv_type: this.obj.interests_inv_type,
      interests_company: this.obj.interests_company,
      interests_country: this.obj.interests_country,
      interests_risk: this.obj.interests_risk,
    };
    let rStr = '';
    Object.values(interests).forEach((interest: string) => {
      rStr += `${interest} `;
    });
    rStr = rStr.replace(/,/g, '');
    return rStr;
  }
}

export interface CustomerObj {
  id: string;
  name: string;
  profile_pic?: string;
  jobs?: string;
  email?: string;
  mobile_number?: number;
  description?: string;
  interests_industry?: string;
  interests_inv_type?: string;
  interests_company?: string;
  interests_country?: string;
  interests_risk?: string;
  rm_current?: string;
  rm_previous?: string;
}

export interface Interests {
  interests_industry?: string;
  interests_inv_type?: string;
  interests_company?: string;
  interests_country?: string;
  interests_risk?: string;
}

export interface CustomersData {
  customer_dets: object;
}

export interface MInterestObj {
  [key: string]: InterestObj;
};

export interface InterestObj {
  interests: string;
  news: object;
  source: string;
  outPath: string;
}
export interface NewsObj {
  [key: string]: string;
}
