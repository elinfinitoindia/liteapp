import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { deals } from "../../models/deal";
import { File } from "@ionic-native/file";

const DEALS_KEY = "deals";
const N_KEY = "notifications";
const P_KEY = "pushNotifications";
const I_KEY = "images";

@Injectable()
export class StorageProvider {
  constructor(
    public http: HttpClient,
    private storage: Storage,
    private file: File
  ) {
    console.log("Hello StorageProvider Provider");
  }

  addDeals(item: any): Promise<any> {
    return this.storage.get(DEALS_KEY).then((items: any[]) => {
      if (items) {
        if (items.find(x => x.ID === item.ID)) {
          return false;
        } else {
          items.push(item);
          this.storage.set(DEALS_KEY, items);
          return true;
        }
      } else {
        this.storage.set(DEALS_KEY, [item]);
      }
    });
  }

  addImages(data: any): Promise<any> {
    console.log(data.ID);
    return this.storage.get(I_KEY).then((res: any) => {
      if (res) {
        if (res.find(x => x.ID === data.ID)) {
          return data;
        } else {
          res.push(data);
          this.storage.set(I_KEY, res);
        }
      } else {
        this.storage.set(I_KEY, [data]);
        return data;
      }
    });
  }
  // READ
  getDeals(): Promise<deals[]> {
    return this.storage.get(DEALS_KEY);
  }

  getImages(): Promise<any[]> {
    return this.storage.get(I_KEY);
  }

  removeImages(): Promise<any> {
    return this.storage.set(I_KEY, []);
  }

  deleteDeals(id: number): Promise<deals> {
    return this.storage.get(DEALS_KEY).then((items: deals[]) => {
      if (!items || items.length === 0) {
        return null;
      }
      let toKeep: deals[] = [];
      for (let i of items) {
        if (i.id !== id) {
          toKeep.push(i);
        }
      }
      return this.storage.set(DEALS_KEY, toKeep);
    });
  }

  addNotification(item: any): Promise<any> {
    return this.storage.get(N_KEY).then(items => {
      if (items) {
        if (items.find(x => x.id === item.id)) {
          return this.updateNotification(item).then(res => {
            return true;
          });
        } else {
          items.push(item);
          this.storage.set(N_KEY, items);
        }
      } else {
        this.storage.set(N_KEY, [item]);
      }
    });
  }

  getNotification(): Promise<any[]> {
    return this.storage.get(N_KEY);
  }

  updateNotification(item): Promise<any> {
    return this.storage.get(N_KEY).then((items: any[]) => {
      if (!items || items.length === 0) {
        return null;
      }
      let newItems: any[] = [];
      for (let i of items) {
        if (i.id === item.id) {
          newItems.push(item);
          this.storage.set(N_KEY, newItems);
        } else {
          newItems.push(i);
          this.storage.set(N_KEY, newItems);
        }
      }
      return true;
    });
  }
  removeNotification(id: number): Promise<any> {
    return this.storage.get(N_KEY).then((items: deals[]) => {
      if (!items || items.length === 0) {
        return null;
      }
      let toKeep: deals[] = [];
      for (let i of items) {
        if (i.id !== id) {
          toKeep.push(i);
        }
      }
      return this.storage.set(N_KEY, toKeep);
    });
  }

  removelAll() {
    this.storage.set(N_KEY, "");
  }

  savePushNotification(item): Promise<any> {
    return this.storage.get(P_KEY).then((items: deals[]) => {
      if (items) {
        items.push(item);
        console.log(items);
        this.storage.set(P_KEY, items);
        return true;
      } else {
        this.storage.set(P_KEY, [item]);
        return true;
      }
    });
  }

  removePushNotification(id: number): Promise<any> {
    return this.storage.get(P_KEY).then((items: deals[]) => {
      if (!items || items.length === 0) {
        return null;
      }
      let toKeep: deals[] = [];
      for (let i of items) {
        if (i.id !== id) {
          toKeep.push(i);
        }
      }
      return this.storage.set(DEALS_KEY, toKeep);
    });
  }

  getPushNotification(): Promise<any> {
    return this.storage.get(P_KEY);
  }

  checkDirectory() {
    return this.file.checkDir(this.file.externalDataDirectory, "images").then(
      (res: any) => {
        console.log("directory already present");
      },
      err => {
        this.file
          .createDir(this.file.externalDataDirectory, "images", false)
          .then(res => {
            console.log("Directory created successfully" + res);
          })
          .catch(err => {
            console.log("Failed to create directory" + JSON.stringify(err));
          });
      }
    );
  }
}
