/**dependencies**/
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  //redis data retrieve
  async get(key: string) {
    return await this.cache.get(key);
  }

  //redis data insert
  async set(key: string, value: any) {
    if (!key && !value) {
      console.log('need to insert redis');
    }
    // await this.cache.set(key, value);
  }

  //redis data delete
  async delete(key: string) {
    await this.cache.del(key);
  }

  //redis data delete
  async reset() {
    await this.cache.reset();
  }
}
