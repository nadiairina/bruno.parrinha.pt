// Inicialização do AOS (Animate On Scroll)
AOS.init({
    duration: 1000, // duração da animação em ms
    once: true,      // animações ocorrem apenas uma vez
});

// Lógica de Validação e Envio do Formulário (Formspree)
// Esta função só é necessária na página de contacto.
// Podemos verificar se o elemento do formulário existe antes de tentar manipulá-lo.
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById("contactForm");
    
    // Verifica se estamos na página de contacto e se o formulário existe
    if (form) {
        var status = document.getElementById("form-status");
        var subjectInput = document.getElementById("subject");

        // --- CÓDIGO ATUALIZADO AQUI: Pré-preencher campo "Assunto" com fallback ---
        const urlParams = new URLSearchParams(window.location.search);
        const assuntoParam = urlParams.get('assunto'); // Pega o valor do parâmetro 'assunto'

        if (subjectInput) { // Garante que o input do assunto existe
            if (assuntoParam) {
                subjectInput.value = assuntoParam; // Preenche com o assunto específico do botão
            } else {
                subjectInput.value = "Pedido de informações"; // Valor padrão se não houver parâmetro
            }
            // Opcional: pode-se desabilitar o campo se quiser que não seja alterado
            // subjectInput.readOnly = true;
            // subjectInput.style.backgroundColor = '#e9ecef'; // Cor de fundo para campo readonly
        }
        // --- FIM DO CÓDIGO ATUALIZADO ---


        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            // Validação simples (pode ser expandida)
            let isValid = true;
            const requiredFields = ['name', 'email', 'message'];
            requiredFields.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (!input.value.trim()) { // .trim() remove espaços em branco
                    isValid = false;
                    input.style.borderColor = 'red'; // Feedback visual de erro
                } else {
                    input.style.borderColor = '#ced4da'; // Resetar borda para cor padrão
                }
            });

            if (!isValid) {
                status.innerHTML = "Por favor, preencha todos os campos obrigatórios.";
                status.style.color = "red";
                return; // Para a execução se a validação falhar
            }

            var data = new FormData(event.target);
            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "Obrigado! A sua mensagem foi enviada com sucesso.";
                    status.style.color = "green";
                    form.reset(); // Limpa o formulário
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            status.innerHTML = "Oops! Houve um problema ao enviar a sua mensagem.";
                        }
                        status.style.color = "red";
                    })
                }
            }).catch(error => {
                status.innerHTML = "Oops! Houve um problema ao enviar a sua mensagem.";
                status.style.color = "red";
            });
        });

        // Adicionar event listeners para resetar a borda vermelha ao digitar
        const formInputs = form.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.style.borderColor === 'red') {
                    input.style.borderColor = '#ced4da'; // Resetar borda
                    // Opcional: esconder mensagem de erro geral se o usuário começar a corrigir
                    if (status.innerHTML === "Por favor, preencha todos os campos obrigatórios.") {
                        status.innerHTML = "";
                    }
                }
            });
        });
    }
});
