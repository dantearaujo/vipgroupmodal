(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node.js/CommonJS
        module.exports = factory();
    } else {
        // Browser globals
        root.initVIPModal = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    return function initVIPModal(config) {
        // Configurações padrão
        const defaultConfig = {
            vipPassword: 'LINDA',
            groupLink: 'https://chat.whatsapp.com/KeKbyjZgp367i0CPlUORka',
            triggerPath: '/grupo-vip',
            lockImageUrl: 'https://agenciametodo.com/wp-content/uploads/cadeado.png',
        };

        // Merge das configurações fornecidas pelo usuário com as padrão
        const settings = { ...defaultConfig, ...config };

        function createVIPAccessModal() {
            // Criar overlay de fundo
            const overlay = document.createElement('div');
            overlay.id = 'vip-access-overlay';
            overlay.style.cssText =
                'position: fixed;' +
                'top: 0;' +
                'left: 0;' +
                'width: 100%;' +
                'height: 100%;' +
                'background: rgba(0, 0, 0, 0.5);' +
                'backdrop-filter: blur(5px);' +
                'z-index: 9999999;' +
                'display: flex;' +
                'justify-content: center;' +
                'align-items: center;';

            // Criar modal
            const modal = document.createElement('div');
            modal.id = 'vip-access-modal';
            modal.style.cssText =
                'background: #fff;' +
                'padding: 24px;' +
                'border-radius: 16px;' +
                'text-align: center;' +
                'max-width: 400px;' +
                'width: 90%;' +
                'box-shadow: 0 4px 20px rgba(0,0,0,0.2);' +
                'font-family: Arial, sans-serif;';

            // Conteúdo do modal
            modal.innerHTML =
                `<div style="margin-bottom: 20px;">
                    <img src="${settings.lockImageUrl}" alt="Cadeado VIP" style="width: 110px;">
                    <h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">Conteúdo Exclusivo</h2>
                    <p style="font-size: 16px; color: #868E96;">As ofertas desta página só estão disponíveis para membros do Grupo VIP.</p>
                </div>
                <div style="margin-top: 20px;">
                    <input 
                        type="password" 
                        id="vip-password" 
                        placeholder="Digite a senha VIP" 
                        style="width: 100%; padding: 10px; height:46px; margin-bottom: 16px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; color: #868E96;"
                    >
                    <p id="error-message" style="color: red; font-size: 14px; margin-top:-16px; margin-bottom:4px; display: none;">Senha incorreta. Tente novamente.</p>
                    <button 
                        id="unlock-button"
                        style="width: 100%; height:46px; padding: 10px; display:flex; align-items: center; justify-content: center; background-color: #B92454; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;"
                    >
                        Desbloquear
                    </button>
                </div>
                <div style="margin-top: 16px; font-size: 14px; background-color: rgba(185, 36, 84, 0.05); padding: 16px; border-radius:4px;">
                    <h3 style="font-size: 18px; color: #B92454; margin-bottom: 8px;">Não tem a senha?</h3>
                    <p style="font-size: 16px; color: #B92454;">Entre agora nosso Grupo VIP e tenha acesso às ofertas.</p>
                    <a href="${settings.groupLink}" target="_blank"
                        style="width: 100%; height:46px; padding: 8px; display:flex; align-items: center; justify-content: center;  border: 1px solid #B92454; background-color: transparent; color: #B92454; border-radius: 4px; font-size: 16px; cursor: pointer;">
                        Quero participar do Grupo VIP
                    </a>
                </div>`;

            // Adicionar modal ao overlay
            overlay.appendChild(modal);

            // Adicionar ao corpo do documento
            document.body.appendChild(overlay);

            // Bloquear rolagem da página
            document.body.style.overflow = 'hidden';

            // Capturar elementos
            const passwordInput = document.getElementById('vip-password');
            const unlockButton = document.getElementById('unlock-button');
            const errorMessage = document.getElementById('error-message');

            // Função para tentar desbloquear
            function tryUnlock() {
                if (passwordInput.value === settings.vipPassword) {
                    overlay.parentNode.removeChild(overlay);
                    document.body.style.overflow = '';
                } else {
                    errorMessage.style.display = 'block';
                    passwordInput.style.borderColor = 'red';
                }
            }

            // Eventos de desbloqueio
            unlockButton.addEventListener('click', tryUnlock);
            passwordInput.addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    tryUnlock();
                }
            });

            // Bloquear fechamento do modal
            overlay.addEventListener('click', function (event) {
                if (event.target === overlay) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
        }

        // Função para verificar e iniciar o modal
        function checkAndInitializeVIPModal() {
            // Verificar se a URL contém o caminho configurado
            if (window.location.pathname.indexOf(settings.triggerPath) !== -1) {
                createVIPAccessModal();
            }
        }

        // Executar imediatamente ou quando GTM injeções acontecerem
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            checkAndInitializeVIPModal();
        } else {
            document.addEventListener('DOMContentLoaded', checkAndInitializeVIPModal);
        }
    };
}));
