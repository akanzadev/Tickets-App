import { TicketI } from "./ticket";

export interface DataI {
  ultimo: number;
  hoy: number;
  tickets: TicketI[];
  ultimos4: TicketI[];
}
