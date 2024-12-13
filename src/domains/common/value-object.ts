import { Map } from 'immutable';

export abstract class ValueObject {
  private isSameType(other: unknown): other is typeof this {
    return other instanceof this.constructor;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }

    if (this.isSameType(other) && this.hashCode() === other.hashCode()) {
      return true;
    }

    return false;
  }

  public hashCode() {
    return this.properties().set('constructor', this.constructor).hashCode();
  }

  protected abstract properties(): Map<string, unknown>;
}
