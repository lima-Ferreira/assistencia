import { options } from "./modules/selects.js";
import validate from "./modules/validate.js";

const formValidate = validate();

const element = document.getElementById("lojas");
const form = document.querySelector("form");
const inputValidate = document.querySelectorAll(".form-control");
const btnSalvarPdf = document.getElementById("salvar-pdf");
const btnGerarPdf = document.querySelectorAll(".gerar-pdf");
const btnAdd = document.querySelector(".btn-add");
const btnSave = document.querySelector(".btn-save");
const produtos = document.querySelectorAll(".input-produto");
const body = document.querySelector("tbody");
const td = document.createElement("td:las-child");

const inputCliente = inputValidate[0];
const inputVenda = inputValidate[1];
const inputOs = inputValidate[2];
const inputFone = inputValidate[3];
const inputEnd = inputValidate[4];
const inputBairro = inputValidate[5];
const inputProduto = inputValidate[6];
const inputCodigo = inputValidate[7];
const inputPeca = inputValidate[8];
const inputCor = inputValidate[9];
const inputQde = inputValidate[10];
const inputObs = inputValidate[11];
const inputLojas = inputValidate[12];
const inputSolic = inputValidate[13];
const assistencia = inputValidate[14];

const arrButton = Array.from(btnGerarPdf);
arrButton[1].style.display = "none";

btnSave.addEventListener("click", (e) => {
  if (
    !inputCodigo.value ||
    !inputPeca.value ||
    !inputCor.value ||
    !inputQde.value
  )
    return;
  const tr = document.createElement("tr");
  tr.title = "click botão esquerdo para excluir";

  for (let i = 0; i < produtos.length; i++) {
    const td = document.createElement("td");
    td.classList.add("delete");
    td.innerHTML = `${produtos[i].value}`;
    body.appendChild(tr);
    tr.appendChild(td);
  }
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      let resposta = confirm("deseja excluir este item?");
      if (resposta) {
        e.target.parentElement.remove();
      } else {
        return;
      }
    }
  });
  inputCodigo.value;
  inputPeca.value;
  inputCor.value;
  inputQde.value;
});

btnAdd.addEventListener("click", () => {
  inputCodigo.value = "";
  inputPeca.value = "";
  inputCor.value = "";
  inputQde.value = "";
  inputCodigo.focus();
});

const dataForm = () => {
  const dataForm = new FormData(form);
  const data = Object.fromEntries(dataForm);
  if (formValidate) {
    return false;
  } else {
    return data;
  }
};

const activeBtn = () => {
  arrButton.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (
        !inputCliente.value ||
        !inputVenda.value ||
        !inputOs.value ||
        !inputFone.value ||
        !inputEnd.value ||
        !inputBairro.value ||
        !inputProduto.value ||
        !inputCodigo.value ||
        !inputPeca.value ||
        !inputCor.value ||
        !inputQde.value ||
        !inputObs.value ||
        !inputLojas.value ||
        !inputSolic.value ||
        !assistencia.value
      ) {
        return;
      } else {
        arrButton[1].style.display = "block";
      }
    });
  });
};

const handleSubmit = (e) => {
  e.preventDefault();
  dataForm();
  activeBtn();
};

const handlePdf = (e) => {
  e.preventDefault();
  const data = dataForm();

  const option = {
    year: "numeric",
    month: "long" || "short" || "numeric",
    weekday: "long" || "short",
    day: "numeric",
  };

  const locale = "pt-br";
  const calendar = new Date().toLocaleDateString(locale, option);

  let content = document.getElementById("content");

  options.forEach((opt, indexOpt) => {
    const elementSelectOpt = +element.options[element.selectedIndex].value;

    if (indexOpt === elementSelectOpt) {
      for (let i = 0; i < produtos.length; i++) {
        content = `<div class='content-container'>
        <div class='header-1'> <div><strong> <p>O.S</p> <p>Nº${data.os}</p></strong></div></div>
    <div class='header'> 
        <img class='img' src="./img/Logo_loj.jpg">
    <div class='select'>
      <div> <p> <strong>Loja: </strong>${opt.loja} </p></div>
      <div> <p> <strong>Endereço: </strong>${opt.endereco} </p></div>
      <div> <p> <strong>Email: </strong>${opt.email} </p></div>
      <div> <p> <strong>Contato: </strong>${opt.contato} </p></div>
    </div>
    </div>
     
    <hr>
        <h4> <strong>Dados dos Clientes</strong></h4>
    <div class='dados-cliente'>
        <p> <strong>Nome do Cliente: </strong>${data.nome_cliente} </p>
        <p> <strong>Endereço: </strong>${data.endereco_cliente} </p>
        <p> <strong>Bairro: </strong>${data.bairro_cliente} </p>
        <p> <strong>Núm da venda: </strong>${data.venda} </p>
        <p> <strong>Telefone: </strong>${data.telefone} </p>
        <p> <strong>Número da OS: </strong>${data.os} </p>
    </div>
        <hr>
    <div class='dados-pecas'>
        <h4 class='dados_prod'> <strong>Dados das Peças</strong></h4>
        <h3 class='d_prod'><strong>${data.produto} </strong></h3>        
        <table class="table table-striped table-hover table-sm ">
        <thead class="table-dark sticky-top pecas">
            <tr>
                <th id="th-cod">Código</th>
                <th id="th-pec">Descrição da Peça</th>
                <th id="th-cor">Cor da Peça</th>
                <th id="th-qua">Qtde</th>
            </tr>
        </thead>
        <tbody> <tr class="dt-line">${body.innerHTML}</tr></tbody>
    </table>   
    <hr>
    <div class='ob'> 
    <p><strong>Observação:</strong></p> 
    <span class='obse'>${data.obs}</span>
    </div> 
    </div>
    <div class='sol'>
        <p class='solicitante'><strong>Att: </strong> ${data.solicitante}</p> 
        <p class='cidade'><strong>${opt.cidade}-ce </strong>  <span class='cal'> ${calendar}</span></p> 
    </div>
       `;
      }
    }
  });

  var opt = {
    margin: [5, 5, 5, 5],
    filename: data.assistencia + "_OS_" + data.os + ".pdf",
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(content).set(opt).save();
};

btnSalvarPdf.addEventListener("click", handleSubmit);
btnGerarPdf[1].addEventListener("click", handlePdf);
