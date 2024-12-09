(function (window, document) {
    function initVIPModal(config) {
        // Default configurations
        var defaultConfig = {
            vipPasswords: ['LINDA'],
            groupLink: 'https://chat.whatsapp.com/KeKbyjZgp367i0CPlUORka',
            triggerPath: '/grupo-vip',
            lockImageUrl: 'https://agenciametodo.com/wp-content/uploads/cadeado.png',
            authStorageKey: 'vipModalAuthenticated',
            expirationHours: 24
        };

        // Merge configurations
        var settings = {};
        for (var key in defaultConfig) {
            settings[key] = config[key] || defaultConfig[key];
        }

        // Ensure vipPasswords is an array
        if (typeof settings.vipPasswords === 'string') {
            settings.vipPasswords = settings.vipPasswords.split(',').map(function (p) {
                return p.trim();
            });
        }

        // Create VIP Access Modal
        function createVIPAccessModal() {
            // Check authentication with expiration
            var authData = localStorage.getItem(settings.authStorageKey);
            if (authData) {
                try {
                    var parsedData = JSON.parse(authData);
                    var currentTime = new Date().getTime();

                    // Check if authentication has expired
                    if (currentTime < parsedData.expiration) {
                        return;
                    }
                } catch (e) {
                    localStorage.removeItem(settings.authStorageKey);
                }
            }

            // Prevent multiple modal creations
            if (document.getElementById('vip-access-overlay')) return;

            // Create overlay
            var overlay = document.createElement('div');
            overlay.id = 'vip-access-overlay';
            overlay.style.cssText =
                'position: fixed;top: 0;left: 0;width: 100%;height: 100%;' +
                'background: rgba(0, 0, 0, 0.5);backdrop-filter: blur(5px);' +
                'z-index: 9999999;display: flex;justify-content: center;align-items: center;';

            // Create modal
            var modal = document.createElement('div');
            modal.id = 'vip-access-modal';
            modal.style.cssText =
                'background: #fff;padding: 24px;border-radius: 16px;' +
                'text-align: center;max-width: 400px;width: 90%;' +
                'box-shadow: 0 4px 20px rgba(0,0,0,0.2);font-family: Arial, sans-serif;';

            // Modal content
            modal.innerHTML =
                '<div style="margin-bottom: 20px;">' +
                '<img src="' + settings.lockImageUrl + '" alt="Cadeado VIP" style="width: 110px;">' +
                '<h2 style="font-size: 24px; color: #333; margin-bottom: 10px;">Conteúdo Exclusivo</h2>' +
                '<p style="font-size: 16px; color: #868E96;">As ofertas desta página só estão disponíveis para membros do Grupo VIP.</p>' +
                '</div>' +
                '<div style="margin-top: 20px;">' +
                '<input ' +
                'type="password" ' +
                'id="vip-password" ' +
                'placeholder="Digite a senha VIP" ' +
                'style="width: 100%; padding: 10px; height:46px; margin-bottom: 16px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; color: #868E96;"' +
                '>' +
                '<p id="error-message" style="color: red; font-size: 14px; margin-top:-16px; margin-bottom:4px; display: none;">Senha incorreta. Tente novamente.</p>' +
                '<button ' +
                'id="unlock-button"' +
                'style="width: 100%; height:46px; padding: 10px; display:flex; align-items: center; justify-content: center; background-color: #B92454; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;"' +
                '>' +
                'Desbloquear' +
                '</button>' +
                '</div>' +
                '<div style="margin-top: 16px; font-size: 14px; background-color: rgba(185, 36, 84, 0.05); padding: 16px; border-radius:4px;">' +
                '<h3 style="font-size: 18px; color: #B92454; margin-bottom: 8px;">Não tem a senha?</h3>' +
                '<p style="font-size: 16px; color: #B92454;">Entre agora nosso Grupo VIP e tenha acesso às ofertas.</p>' +
                '<a href="' + settings.groupLink + '" target="_blank"' +
                'style="width: 100%; height:46px; padding: 8px; display:flex; align-items: center; justify-content: center; border: 1px solid #B92454; background-color: transparent; color: #B92454; border-radius: 4px; font-size: 16px; cursor: pointer;"' +
                '>' +
                'Quero participar do Grupo VIP' +
                '</a>' +
                '</div>';

            // Add modal to overlay
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';

            // Capture elements
            var passwordInput = document.getElementById('vip-password');
            var unlockButton = document.getElementById('unlock-button');
            var errorMessage = document.getElementById('error-message');

            // Unlock function
            function tryUnlock() {
                // Check if input matches any of the passwords
                var isValidPassword = settings.vipPasswords.some(function (password) {
                    return passwordInput.value === password;
                });

                if (isValidPassword) {
                    // Set authentication in localStorage with expiration
                    var authData = {
                        authenticated: true,
                        expiration: new Date().getTime() + (settings.expirationHours * 60 * 60 * 1000)
                    };
                    localStorage.setItem(settings.authStorageKey, JSON.stringify(authData));

                    // Remove modal
                    overlay.parentNode.removeChild(overlay);
                    document.body.style.overflow = '';
                } else {
                    errorMessage.style.display = 'block';
                    passwordInput.style.borderColor = 'red';
                }
            }

            // Event listeners
            unlockButton.addEventListener('click', tryUnlock);
            passwordInput.addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    tryUnlock();
                }
            });

            // Prevent closing modal by clicking overlay
            overlay.addEventListener('click', function (event) {
                if (event.target === overlay) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
        }

        // Check and initialize modal
        function checkAndInitializeVIPModal() {
            if (window.location.pathname.indexOf(settings.triggerPath) !== -1) {
                createVIPAccessModal();
            }
        }

        // Initialize on page load
        checkAndInitializeVIPModal();
    }

    // Expose function to global scope
    window.initVIPModal = initVIPModal;
})(window, document);

// Config and initialization
initVIPModal({
    vipPasswords: ['LINDA', 'linda', 'Linda'],
    groupLink: 'https://chat.whatsapp.com/KeKbyjZgp367i0CPlUORka',
    triggerPath: '/grupo-vip',
    lockImageUrl: 'https://agenciametodo.com/wp-content/uploads/cadeado.png',
    expirationHours: 24
});