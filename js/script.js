import { options } from "./modules/selects.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const tbody = document.querySelector("tbody");

  const btnAdd = document.querySelector(".add");
  const btnSave = document.querySelector(".save");
  const btnPdf = document.querySelector(".pdf");

  const inputCodigo = document.querySelector('[name="codigo"]');
  const inputPeca = document.querySelector('[name="peca"]');
  const inputCor = document.querySelector('[name="cor"]');
  const inputQde = document.querySelector('[name="qde"]');

  // ADD PEÇA
  btnAdd.addEventListener("click", () => {
    if (
      !inputCodigo.value ||
      !inputPeca.value ||
      !inputCor.value ||
      !inputQde.value
    ) {
      alert("Preencha os dados da peça");
      return;
    }

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${inputCodigo.value}</td>
      <td>${inputPeca.value}</td>
      <td>${inputCor.value}</td>
      <td>${inputQde.value}</td>
    `;

    tbody.appendChild(tr);

    inputCodigo.value = "";
    inputPeca.value = "";
    inputCor.value = "";
    inputQde.value = "";
  });

  // REMOVE
  tbody.addEventListener("click", (e) => {
    if (e.target.tagName === "TD") {
      if (confirm("Excluir item?")) {
        e.target.parentElement.remove();
      }
    }
  });

  function getData() {
    return Object.fromEntries(new FormData(form));
  }

  function validar(data) {
    const ignorar = ["codigo", "peca", "cor", "qde"];

    for (let key in data) {
      if (ignorar.includes(key)) continue;
      if (!data[key]) return false;
    }

    return true;
  }

  btnSave.addEventListener("click", () => {
    const data = getData();

    if (!validar(data)) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    alert("Salvo!");
  });

  btnPdf.addEventListener("click", () => {
    const data = getData();

    if (!validar(data)) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    const dataAtual = new Date();

    const dataFormatada = dataAtual.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const hora = dataAtual.toLocaleTimeString("pt-BR");

    const selectLoja = document.querySelector('[name="lojas"]');

    function getLojaSelecionada() {
      const index = selectLoja.selectedIndex - 1;

      if (index < 0) return null;

      return options[index];
    }

    // ===== DADOS DA LOJA (ajusta se quiser)
    const loja = getLojaSelecionada();

    function formatarNomeArquivo(nome) {
      return nome
        .trim()
        .replace(/\s+/g, "_") // espaço → _
        .replace(/[^\w\-]/g, ""); // remove caracteres estranhos
    }

    function limparTexto(texto) {
      return texto
        .toString()
        .trim()
        .normalize("NFD") // remove acento
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_") // espaço → _
        .replace(/[^\w\-]/g, ""); // remove resto
    }

    if (!loja) {
      alert("Selecione a loja");
      return;
    }

    // fornecedor (assistência)
    const fornecedor = limparTexto(data.assistencia);

    // cidade da loja
    const cidade = limparTexto(loja.cidade);

    // data formatada
    const hoje = new Date();
    const dataNome = hoje.toLocaleDateString("pt-BR").replace(/\//g, "-");

    // nome final
    const nomeArquivo = `${fornecedor}_${cidade}_OS_${data.os}_${dataNome}.pdf`;

   const conteudo = `
<style>
  @page {
    size: A4;
    margin: 10mm;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    font-size: 12px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  th, td {
    padding: 6px;
    border: 1px solid #000;
    word-break: break-word;
    white-space: normal;
  }

  thead {
    background: #000;
    color: #fff;
  }
</style>

<div style="
  width:100%;
  margin:0 auto;
  padding:20px;
  box-sizing:border-box;
">

  <!-- HEADER -->
  <div style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    border-bottom:2px solid #000;
    padding-bottom:10px;
    margin-bottom:15px;
  ">

    <div style="display:flex; gap:15px; align-items:center;">
      <img src="img/Logo.jpg" style="height:60px;">

      <div style="line-height:1.4;">
        <strong>${loja.loja}</strong><br>
        ${loja.endereco}<br>
        ${loja.contato}<br>
        ${loja.email}<br>
        
      </div>
    </div>

    <div style="text-align:right;">
      <h2 style="margin:0; font-size:18px;">ORDEM DE SERVIÇO</h2>
      <strong style="font-size:16px;">Nº ${data.os}</strong>
    </div>

  </div>

  <!-- CLIENTE -->
  <div style="margin-bottom:8px;">
    <strong>Cliente:</strong> ${data.nome_cliente} |
    <strong>Telefone:</strong> ${data.telefone} |
    <strong>Venda:</strong> ${data.venda}
  </div>

  <div style="margin-bottom:12px;">
    <strong>Endereço:</strong> ${data.endereco_cliente} |
    <strong>Bairro:</strong> ${data.bairro_cliente}
  </div>

  <!-- PRODUTO -->
  <div style="margin-bottom:10px;">
    <strong>Produto:</strong> ${data.produto}
  </div>

  <!-- TABELA -->
  <table>
    <thead>
      <tr>
        <th>Código</th>
        <th>Descrição</th>
        <th>Cor</th>
        <th>Qtd</th>
      </tr>
    </thead>

    <tbody>
      ${tbody.innerHTML}
    </tbody>
  </table>

  <!-- OBS -->
  <div style="margin-top:15px;">
    <strong>Observações:</strong>
    <div style="
      border:1px solid #000;
      min-height:60px;
      padding:6px;
      margin-top:4px;
      word-break:break-word;
    ">
      ${data.obs}
    </div>
  </div>

  <!-- FOOTER -->
  <div style="
    margin-top:20px;
    display:flex;
    justify-content:space-between;
    border-top:1px solid #000;
    padding-top:10px;
  ">

    <div>
      <strong>Solicitante:</strong> ${data.solicitante}
    </div>

    <div style="text-align:right;">
      <strong>${loja.cidade} - CE</strong><br>
      ${dataFormatada} - ${hora}
    </div>

  </div>

</div>
`;
    // ===== CONFIG PDF =====
    const opt = {
      margin: [5, 5, 5, 5],
      filename: nomeArquivo,

      image: {
        type: "jpeg",
        quality: 2,
      },

      html2canvas: {
        scale: 1,
        useCORS: true,
        logging: false,
      },

      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape",
      },

      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
      },
    };

    html2pdf().from(conteudo).set(opt).save();
  });
});
