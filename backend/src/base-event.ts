import { hash } from '@stablelib/sha256';

export const Merklize =
  () =>
    (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;

      descriptor.value = async function(...args): Promise<boolean> {
        const hash = args[0].hash;
        const added = await this.db.addEvent(hash);
        if (!added) {
          this.log.error(`Event Replayed: ${args[0].eventName}`);
          if (typeof args[0].eventName === 'undefined') {
            this.log.error(`Event not extending BaseEvent found:`);
            this.log.error(args[0]);
          }
          return false;
        }
        originalMethod.apply(this, args);
        return true;
      };

      return descriptor;
    };

export class BaseEvent {
  eventName = this.constructor.name;

  get hash(): string {
    const bytes = new TextEncoder().encode(JSON.stringify(this));
    return Buffer.from(hash(bytes)).toString('hex');
  }
}
