const form = document.getElementById("formAgendamento");

const horariosDisponiveis = [
"09:00",
"09:30",
"10:00",
"10:30",
"11:00",
"11:30",
"13:00",
"13:30",
"14:00",
"14:30",
"15:00",
"15:30",
"16:00",
"16:30",
"17:00"
];

if(form){

form.addEventListener("submit", function(event){

event.preventDefault();

const nome = document.getElementById("nome").value;
const telefone = document.getElementById("telefone").value;
const barbeiro = document.getElementById("barbeiro").value;
const data = document.getElementById("data").value;
const horario = document.getElementById("horario").value;
const fotoInput = document.getElementById("fotoCorte");
const foto = fotoInput.files[0];

let lista = JSON.parse(localStorage.getItem("agendamentos")) || [];

const horarioOcupado = lista.find(function(item){

return (
item.barbeiro === barbeiro &&
item.data === data &&
item.horario === horario
);

});

if(horarioOcupado){

alert("Esse horário já está ocupado para esse barbeiro.");

return;

}

if(foto){

const leitor = new FileReader();

leitor.onload = function(){

const agendamento = {
nome,
telefone,
barbeiro,
data,
horario,
foto: leitor.result,
status: "Agendado"
};

lista.push(agendamento);

localStorage.setItem("agendamentos", JSON.stringify(lista));

alert("Agendamento realizado!");

const mensagem = `Olá, gostaria de confirmar meu horário.

Nome: ${nome}
Barbeiro: ${barbeiro}
Data: ${data}
Horário: ${horario}`;

const numero = "5524998410840"; // número da barbearia

const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

window.open(url, "_blank");

form.reset();

};

leitor.readAsDataURL(foto);

}else{

const agendamento = {
nome,
telefone,
barbeiro,
data,
horario,
foto: null,
status: "Agendado"
};

lista.push(agendamento);

localStorage.setItem("agendamentos", JSON.stringify(lista));

alert("Agendamento realizado com sucesso!");

form.reset();

}

});

}

const formLogin = document.getElementById("formLogin");

if(formLogin){

formLogin.addEventListener("submit", function(event){

event.preventDefault();

const email = document.getElementById("email").value;
const senha = document.getElementById("senha").value;

if(email === "admin@barbearia.com" && senha === "1234"){

alert("Login realizado");

window.location.href = "dashboard.html";

}else{

alert("Email ou senha incorretos");

}

});

}

const tabela = document.getElementById("listaAgendamentos");

if(tabela){

const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

agendamentos.forEach(function(item){

const linha = document.createElement("tr");

linha.innerHTML = `
<td>${item.nome}</td>
<td>${item.telefone}</td>
<td>${item.barbeiro}</td>
<td>${item.data}</td>
<td>${item.horario}</td>
`;

tabela.appendChild(linha);

});

}

const selectBarbeiro = document.getElementById("barbeiro");
const selectData = document.getElementById("data");
const selectHorario = document.getElementById("horario");

if(selectBarbeiro && selectData){

function atualizarHorarios(){

const barbeiro = selectBarbeiro.value;
const data = selectData.value;

let lista = JSON.parse(localStorage.getItem("agendamentos")) || [];

selectHorario.innerHTML = '<option value="">Selecione o horário</option>';

horariosDisponiveis.forEach(function(horario){

const ocupado = lista.find(function(item){

return (
item.barbeiro === barbeiro &&
item.data === data &&
item.horario === horario
);

});

if(!ocupado){

const option = document.createElement("option");
option.value = horario;
option.textContent = horario;

selectHorario.appendChild(option);

}

});

}

selectBarbeiro.addEventListener("change", atualizarHorarios);
selectData.addEventListener("change", atualizarHorarios);

}

const agendaDeyvid = document.getElementById("agendaDeyvid");
const agendaJoaldey = document.getElementById("agendaJoaldey");
const agendaJonatas = document.getElementById("agendaJonatas");
const filtroData = document.getElementById("filtroData");
function carregarAgenda(dataSelecionada){

const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

agendaDeyvid.innerHTML = "";
agendaJoaldey.innerHTML = "";
agendaJonatas.innerHTML = "";

agendamentos.forEach(function(item){

if(item.status === "Atendido" && item.atendidoEm){

const agora = Date.now();
const tempo = agora - item.atendidoEm;

const dezMinutos = 10 * 60 * 1000;

if(tempo > dezMinutos){
return;
}

}

if(dataSelecionada && item.data !== dataSelecionada){
return;
}

const card = document.createElement("div");

card.classList.add("agendamento-card");

card.innerHTML = `
<strong>${item.horario}</strong><br>
Cliente: ${item.nome}<br>
Telefone: ${item.telefone}<br>
Data: ${item.data}
<br>
Status: ${item.status}

<br><br>

${item.foto ? `<img src="${item.foto}" width="120">` : "Sem foto de referência"}

<br><br>

<button onclick="marcarAtendido('${item.nome}','${item.horario}','${item.data}')">
Atendido
</button>

<button onclick="cancelarAgendamento('${item.nome}','${item.horario}','${item.data}')">
Cancelar
</button>
`;

if(item.barbeiro === "Deyvid"){
agendaDeyvid.appendChild(card);
}

if(item.barbeiro === "Joaldey"){
agendaJoaldey.appendChild(card);
}

if(item.barbeiro === "Jonatas"){
agendaJonatas.appendChild(card);
}

});

}

if(filtroData){

filtroData.addEventListener("change", function(){

carregarAgenda(filtroData.value);

});

}

if(agendaDeyvid){
carregarAgenda();
}


function cancelarAgendamento(nome, horario, data){

let lista = JSON.parse(localStorage.getItem("agendamentos")) || [];

lista = lista.filter(function(item){

return !(item.nome === nome && item.horario === horario && item.data === data);

});

localStorage.setItem("agendamentos", JSON.stringify(lista));

alert("Agendamento cancelado");

location.reload();

}

function marcarAtendido(nome, horario, data){

let lista = JSON.parse(localStorage.getItem("agendamentos")) || [];

lista.forEach(function(item){

if(item.nome === nome && item.horario === horario && item.data === data){

item.status = "Atendido";
item.atendidoEm = Date.now(); // salva o momento

}

});

localStorage.setItem("agendamentos", JSON.stringify(lista));

alert("Cliente marcado como atendido");

location.reload();

}


function atualizarEstatisticas(){

const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

const hoje = new Date().toISOString().split("T")[0];

let totalHoje = 0;
let atendidos = 0;
let aguardando = 0;

agendamentos.forEach(function(item){

if(item.data === hoje){

totalHoje++;

if(item.status === "Atendido"){
atendidos++;
}else{
aguardando++;
}

}

});

document.getElementById("totalHoje").textContent = totalHoje;
document.getElementById("atendidosHoje").textContent = atendidos;
document.getElementById("aguardandoHoje").textContent = aguardando;

}

if(document.getElementById("totalHoje")){
atualizarEstatisticas();
}
