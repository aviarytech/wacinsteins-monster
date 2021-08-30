import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
const promiseRetry = require('promise-retry');

@Injectable()
export class DBService {
  private client: MongoClient;
  public ready: Promise<boolean>;
  private promiseRetryOptions: object;
  public readonly collection = 'docs';
  public readonly metaCollection = 'meta';

  constructor(private log: Logger, private config: ConfigService) {
    const connectOptions = {
      // authSource: this.config.get('DBAUTHSOURCE'),
      // auth: {
      //   user: this.config.get('DBUSER'),
      //   password: this.config.get('DBPASSWORD'),
      // },
      reconnectTries: 15,
      reconnectInterval: 1000,
      connectTimeoutMS: 60000,
    };
    this.promiseRetryOptions = {
      retries: connectOptions.reconnectTries,
      factor: 1.5,
      minTimeout: connectOptions.reconnectInterval,
      maxTimeout: 5000,
    };
    this.client = new MongoClient(
      `mongodb://${this.config.get('DBHOST')}:${this.config.get('DBPORT')}`,
      connectOptions,
    );

    this.ready = new Promise(async (resolve, reject) => {
      try {
        await this.connect(
          `mongodb://${this.config.get('DBHOST')}:${this.config.get('DBPORT')}`,
        );
        resolve(true);
      } catch (e) {
        this.log.error(`Failed to connect to ${this.config.get('DBHOST')}`);
        this.log.error(e);
        reject(false);
      }
      this.initMeta();
    });
  }

  get dbName(): string {
    return this.config.get('DBNAME');
  }

  removeIds(res) {
    const newRes = res.map((r) => {
      delete r._id;
      return r;
    });
    return res;
  }

  connect = (url: string) => {
    return promiseRetry((retry, number) => {
      console.log(`MongoClient connecting to ${url} - retry number: ${number}`);
      return this.client.connect().catch(retry);
    }, this.promiseRetryOptions);
  };

  async initMeta() {
    await this.ready;
    // check if doc exists
    const doc = await this.client
      .db(this.dbName)
      .collection(this.metaCollection)
      .findOne({ '@type': 'Meta' });
    if (!doc) {
      const res = await this.client
        .db(this.dbName)
        .collection(this.metaCollection)
        .insertOne({
          '@type': 'Meta',
          events: [],
          root: null,
          created_at: new Date(),
          updated_at: new Date(),
        });
    }
  }

  async drop() {
    console.log('Dropping');
    try {
      await this.client.db(this.dbName).collection(this.collection).drop();
    } catch (e) {
      // already dropped
    }
    try {
      await this.client.db(this.dbName).collection(this.metaCollection).drop();
    } catch (e) {
      // already dropped
    }
    await this.initMeta();
  }

  async close() {
    await this.client.close();
  }

  async getById(id: string) {
    let res = await this.client
      .db(this.dbName)
      .collection(this.collection)
      .findOne({ '@id': id });
    if (!res) {
      return null;
    }
    delete res._id;
    return res;
  }

  async getManyById(ids: string[]) {
    const res = await this.client
      .db(this.dbName)
      .collection(this.collection)
      .find({ '@id': { $in: ids } })
      .toArray();
    return this.removeIds(res);
  }

  async getByProps(props: object) {
    let res = await this.client
      .db(this.dbName)
      .collection(this.collection)
      .findOne(props);
    if (!res) {
      return null;
    }
    delete res._id;
    return res;
  }

  async getManyByProps(props: object) {
    const res = await this.client
      .db(this.dbName)
      .collection(this.collection)
      .find(props)
      .toArray();
    return this.removeIds(res);
  }

  async getAllByType(type: string) {
    const res = await this.client
      .db(this.dbName)
      .collection(this.collection)
      .find({ '@type': type })
      .toArray();
    return this.removeIds(res);
  }

  // upsert by @id or referenceId
  async upsert(obj) {
    const id = obj['@id'];
    const referenceId = obj['referenceId'];

    const searchParams: any[] = [{ '@id': id }];
    if (referenceId) {
      searchParams.push({ referenceId: referenceId });
    }

    // check if doc exists
    const doc = await this.client
      .db(this.dbName)
      .collection(this.collection)
      .findOne({ $or: searchParams });

    const timestamp = new Date();
    let res = null;
    let docId = null;

    // exists, so update
    if (doc !== null) {
      res = await this.client
        .db(this.dbName)
        .collection(this.collection)
        .updateOne(
          { _id: doc._id },
          { $set: { ...obj, updated_at: timestamp } },
        );
      docId = doc._id;
    } else {
      // does not exist, so create
      res = await this.client
        .db(this.dbName)
        .collection(this.collection)
        .insertOne({ ...obj, created_at: timestamp, updated_at: timestamp });
      docId = res.insertedId;
    }
    let finalRes = await this.client
      .db(this.dbName)
      .collection(this.collection)
      .findOne({ _id: docId });
    delete finalRes._id;
    return finalRes;
  }

  // insert, even if duplicate
  async insert(obj) {
    if (obj['@id'].length !== 32 || obj['@id'].substr(0, 3) !== 'a51') {
      this.log.error(`@id of '${obj['@id']}' is invalid`);
      return null;
    }
    const timestamp = new Date();
    const res = await this.client
      .db(this.dbName)
      .collection(this.collection)
      .insertOne({ ...obj, created_at: timestamp, updated_at: timestamp });
    let finalRes = await this.client
      .db(this.dbName)
      .collection(this.collection)
      .findOne({ _id: res.insertedId });
    delete finalRes._id;
    return finalRes;
  }

  async create(obj) {
    try {
      const currentContact = await this.client
        .db(this.dbName)
        .collection(this.collection)
        .findOne({ id: obj.id });
      if (currentContact) {
        throw new Error('Contact already exists');
      }

      const timestamp = new Date();
      const res = await this.client
        .db(this.dbName)
        .collection(this.collection)
        .insertOne({ ...obj, created_at: timestamp, updated_at: timestamp });
      const id = res.insertedId;
      let finalRes = await this.client
        .db(this.dbName)
        .collection(this.collection)
        .findOne({ _id: id });
      delete finalRes._id;
      return finalRes;
    } catch (e) {
      this.log.error(`error in create doc`, e);
      return null;
    }
  }

  async getCountByType(type: string) {
    return await this.client
      .db(this.dbName)
      .collection(this.collection)
      .find({ '@type': type })
      .count();
  }

  async getRootAgent() {
    try {
      let res = await this.client
        .db(this.dbName)
        .collection(this.collection)
        .findOne({
          $and: [
            { $where: "this['@id'] == this.owned_by" },
            { '@type': 'Agent' },
          ],
        });
      delete res._id;
      return res;
    } catch (e) {
      return null;
    }
  }

  async addToSet(id: string, setName: string, toAdd: any): Promise<boolean> {
    try {
      const res = await this.client
        .db(this.dbName)
        .collection(this.collection)
        .updateOne({ '@id': id }, { $addToSet: { [setName]: toAdd } });
      return res.result.nModified === 1;
    } catch (e) {
      return null;
    }
  }

  async addEvent(hash: string): Promise<boolean> {
    try {
      const res = await this.client
        .db(this.dbName)
        .collection(this.metaCollection)
        .updateOne({ '@type': 'Meta' }, { $addToSet: { events: hash } });
      return res.modifiedCount === 1;
    } catch (e) {
      this.log.error('Event insert error!');
    }
  }

  async getEventsDoc(): Promise<{
    events: string[];
    created_at: string;
    updated_at: string;
  }> {
    try {
      return await this.client
        .db(this.dbName)
        .collection(this.metaCollection)
        .findOne({ '@type': 'Meta' });
    } catch {
      this.log.error('Events metadata not found');
    }
  }
}
