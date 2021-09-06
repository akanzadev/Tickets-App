import { createServer, Server } from "http";
import SocketIO, { Server as SV, Socket } from "socket.io";
import { Application } from "express";
import { config } from "./config";
import Ticket from "../ticket/ticket";

export class SocketsNode {
  public httpServer: Server;
  public io: SocketIO.Server;
  private ticket = new Ticket();

  constructor(app: Application) {
    this.httpServer = createServer(app);
    // Creando instancia de Socket
    this.io = new SV(this.httpServer);
  }

  public startSockets() {
    this.httpServer.listen(config.API.PORT, () => {
      console.log("Servidor corriendo en el puerto ", config.API.PORT);
    });
    this.onConnection();
  }
  public onConnection() {
    this.io.on("connection", (socket: Socket) => {
      // Mostrando id del cliente conectado
      console.log("Cliente conectado", socket.id);
      socket.on("disconnect", () => {
        console.log("Cliente desconectado", socket.id);
      });
      // Recibiendo informacion enviada desde cliente
      this.onReceivedMessage(socket);
    });
  }

  public onReceivedMessage(socket: Socket) {
    socket.emit("ultimo-ticket", this.ticket.ultimo);
    socket.emit("estado-actual", this.ticket.ultimos4);
    socket.emit("tickets-pendientes", this.ticket.tickets.length);
    socket.broadcast.emit("tickets-pendientes", this.ticket.tickets.length);

    socket.on("siguiente-ticket", (data, cb) => {
      const siguiente = this.ticket.siguiente();
      cb(siguiente);
      socket.broadcast.emit("tickets-pendientes", this.ticket.tickets.length);
    });

    socket.on("atender-ticket", ({ escritorio }, cb) => {
      if (!escritorio) {
        return cb({
          ok: false,
          message: "No hay escritorios disponibles",
        });
      }
      const ticket = this.ticket.atenderTicket(escritorio);
      socket.broadcast.emit("estado-actual", this.ticket.ultimos4);
      if (!ticket) {
        return cb({
          ok: false,
          message: "No hay tickets disponibles",
        });
      } else {
        cb({
          ok: true,
          ticket,
        });
      }
    });
  }
  public onSendMessage(socket: Socket) {
    socket.broadcast.emit("enviar-mensaje", "Alerta para todos los usuarios");
  }
}
