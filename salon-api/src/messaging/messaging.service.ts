import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export type RezervacijaEventType = 'KREIRANA' | 'IZMENJENA' | 'OTKAZANA';

@Injectable()
export class MessagingService {
  constructor(
    @Inject('REZERVACIJA_SERVICE') private client: ClientProxy,
  ) {}

  publishRezervacijaEvent(
    eventType: RezervacijaEventType,
    payload: Record<string, unknown>,
  ) {
    this.client.emit<void>(eventType, payload);
  }
}