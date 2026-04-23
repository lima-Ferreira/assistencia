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
    <div style="
      width:1000px;
      min-height:700px;
      display:flex;
      flex-direction:column;
      font-family:Arial, sans-serif;
      font-size:12px;
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
    
        <!-- ESQUERDA -->
        <div style="display:flex; gap:15px; align-items:center;">
          <img src="img/Logo.jpg" style="height:60px;">
    
          <div style="line-height:1.4;">
            <strong>${loja.loja}</strong><br>
            ${loja.endereco}<br>
            ${loja.contato}<br>
            ${loja.email}<br>
            ${loja.cidade}
          </div>
        </div>
    
        <!-- DIREITA -->
        <div style="text-align:right;">
          <h2 style="margin:0; font-size:18px;">ORDEM DE SERVIÇO</h2>
          <strong style="font-size:16px;">Nº ${data.os}</strong>
        </div>
    
      </div>
    
      <!-- CONTEÚDO -->
      <div style="flex:1;">
    
        <!-- CLIENTE -->
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <div><strong>Cliente:</strong> ${data.nome_cliente}</div>
          <div><strong>Telefone:</strong> ${data.telefone}</div>
          <div><strong>Venda:</strong> ${data.venda}</div>
        </div>
    
        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
          <div><strong>Endereço:</strong> ${data.endereco_cliente}</div>
          <div><strong>Bairro:</strong> ${data.bairro_cliente}</div>
        </div>
    
        <!-- PRODUTO -->
        <div style="margin-bottom:10px;">
          <strong>Produto:</strong> ${data.produto}
        </div>
    
        <!-- TABELA -->
        <table style="width:100%; border-collapse:collapse; margin-top:10px;">
          <thead>
            <tr style="background:#000; color:#fff;">
              <th style="padding:6px;">Código</th>
              <th style="padding:6px;">Descrição</th>
              <th style="padding:6px;">Cor</th>
              <th style="padding:6px;">Qtd</th>
            </tr>
          </thead>
    
          <tbody>
            ${tbody.innerHTML}
          </tbody>
        </table>
    
        <!-- OBS -->
        <div style="margin-top:12px;">
          <strong>Observações:</strong>
          <div style="
            border:1px solid #000;
            min-height:80px;
            padding:6px;
            margin-top:4px;
          ">
            ${data.obs}
          </div>
        </div>
    
      </div>
    
      <!-- FOOTER -->
      <div style="
        display:flex;
        justify-content:space-between;
        margin-top:20px;
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
        quality: 1,
      },

      html2canvas: {
        scale: 2,
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
