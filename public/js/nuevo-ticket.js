const socket = io();

const $ = (tag) => document.querySelector(tag);

const $$ = (tag) => document.querySelectorAll(tag);

const lblNuevoTicket = $("#lblNuevoTicket");
const btnNuevoTicket = $("#btnNuevoTicket");

console.log("Nuevo Ticket HTML");

const btnCrear = $("#btnCrear");

socket.on("connect", () => {
  btnCrear.disabled = false;
});

socket.on("disconnect", () => {
  btnCrear.disabled = true;
});

btnCrear.addEventListener("click", () => {
  socket.emit("siguiente-ticket", null, (ticket) => {
    lblNuevoTicket.innerText = ticket;
  });
});

socket.on("ultimo-ticket", (ticket) => {
  lblNuevoTicket.innerText = `Ticket ${ticket}`;
});
