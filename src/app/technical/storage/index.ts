import AsyncStorage from "@react-native-async-storage/async-storage";

export class AppStorage {
  static setItem(key: string, value: string) {
    return AsyncStorage.setItem(key, value);
  }

  static async getItem(key: string) {
    return new Promise<string>((resolve, reject) => {
      AsyncStorage.getItem(key)
        .then((raw) => {
          resolve(raw);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
