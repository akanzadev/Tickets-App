import { DataI } from "../interfaces/data";
import fs from "fs";
import { TicketI } from "../interfaces/ticket";

export default class Ticket {
  public ultimo = 0;
  private hoy = new Date().getDate();
  public tickets: Array<TicketI> = [];
  public ultimos4: Array<TicketI> = [];
  constructor() {
    this.init();
  }

  // Retornar datos iniciales
  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4,
    };
  }

  // Cargar base de datos
  private init() {
    const {
      hoy,
      tickets,
      ultimo,
      ultimos4,
    }: DataI = require("../db/data.json");
    if (hoy === this.hoy) {
      this.tickets = tickets;
      this.ultimo = ultimo;
      this.ultimos4 = ultimos4;
    } else {
      this.guardarDB();
    }
  }

  private guardarDB() {
    const dbPath = "./src/db/data.json";
    // Guardar datos iniciales en el archivo
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  public siguiente() {
    this.ultimo += 1;
    const ticket: TicketI = {
      numero: this.ultimo,
      escritorio: null,
    };
    this.tickets.push(ticket);
    this.guardarDB();
    return `Ticket ${ticket.numero}`;
  }

  public atenderTicket(escritorio: string) {
    if (this.tickets.length === 0) {
      return null;
    }
    const ticket = this.tickets[0];
    this.tickets.shift();
    ticket.escritorio = escritorio;
    console.log(this.ultimos4);
    this.ultimos4.unshift(ticket);

    if (this.ultimos4.length > 4) {
      this.ultimos4.splice(-1, 1);
    }
    this.guardarDB();
    return ticket;
  }
}
