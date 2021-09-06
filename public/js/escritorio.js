const $ = (tag) => document.querySelector(tag);

const $$ = (tag) => document.querySelectorAll(tag);

const lblEscritorio = $("#lblEscritorio");
const btnAtender = $("#btnAtender");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location.href = "./index.html";
  throw new Error("El escritorio es obligatorio");
}

const escritorio = searchParams.get("escritorio");
lblEscritorio.innerHTML = `Escritorio ${escritorio}`;

const socket = io();

const lblNuevoTicket = $("#lblNuevoTicket");
const btnNuevoTicket = $("#btnNuevoTicket");
const lblTicket = $("#lblTicket");
const divAlerta = $("#divAlerta");
const lblPendientes = $("#lblPendientes");
divAlerta.style.display = "none";

socket.on("connect", () => {
  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  btnAtender.disabled = true;
});

socket.on("tickets-pendientes", (pendientes) => {
  if (pendientes === 0) {
    lblPendientes.style.display = "none";
  } else {
    lblPendientes.style.display = "";
    lblPendientes.innerHTML = pendientes;
  }
});

btnAtender.addEventListener("click", () => {
  socket.emit("atender-ticket", { escritorio }, ({ ok, ticket }) => {
    if (!ok) {
      lblTickets.innerText = "No hay tickets";
      return (divAlerta.style.display = "block");
    }
    lblTicket.innerHTML = `Ticket ${ticket.numero}`;
  });
});
