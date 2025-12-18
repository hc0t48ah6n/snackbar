   /**
         * M3Snack Library 本体
         */
        (function() {
            const styleId = 'm3-snack-styles';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    .m3-snack-container {
                        position: fixed;
                        bottom: 24px;
                        left: 50%;
                        transform: translateX(-50%) translateY(100px);
                        min-width: 320px;
                        max-width: 568px;
                        background-color: #313033;
                        color: #f4eff4;
                        padding: 14px 16px;
                        border-radius: 8px;
                        box-shadow: 0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        font-family: 'Roboto', sans-serif;
                        font-size: 14px;
                        z-index: 10000;
                        transition: transform 0.25s cubic-bezier(0, 0, 0.2, 1), opacity 0.2s;
                        opacity: 0;
                    }
                    .m3-snack-container.show {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                    .m3-snack-message { flex-grow: 1; margin-right: 12px; line-height: 1.4; }
                    .m3-snack-action {
                        color: #d0bcff;
                        font-weight: 500;
                        text-transform: uppercase;
                        cursor: pointer;
                        background: none;
                        border: none;
                        padding: 8px 12px;
                        margin: -8px -4px -8px 8px;
                        border-radius: 4px;
                        font-family: inherit;
                        font-size: 14px;
                        white-space: nowrap;
                    }
                    .m3-snack-action:hover { background-color: rgba(208, 188, 255, 0.08); }
                `;
                document.head.appendChild(style);
            }

            window.M3Snack = {
                show: function(options) {
                    return new Promise((resolve) => {
                        const config = {
                            message: options.message || 'No message',
                            actionText: options.actionText || '',
                            duration: options.duration !== undefined ? options.duration : 4000
                        };

                        const snack = document.createElement('div');
                        snack.className = 'm3-snack-container';
                        
                        let actionHtml = '';
                        if (config.actionText) {
                            actionHtml = `<button class="m3-snack-action">${config.actionText}</button>`;
                        }

                        snack.innerHTML = `<div class="m3-snack-message">${config.message}</div>${actionHtml}`;
                        document.body.appendChild(snack);

                        // 描画を確実にするため少し待機
                        setTimeout(() => { snack.classList.add('show'); }, 10);

                        let resolved = false;
                        const dismiss = (result) => {
                            if (resolved) return;
                            resolved = true;
                            snack.classList.remove('show');
                            setTimeout(() => {
                                if (snack.parentNode) snack.parentNode.removeChild(snack);
                                resolve(result);
                            }, 250);
                        };

                        const actionBtn = snack.querySelector('.m3-snack-action');
                        if (actionBtn) {
                            actionBtn.onclick = () => dismiss(true);
                        }

                        // durationが0以上の場合は自動消去
                        if (config.duration > 0) {
                            setTimeout(() => dismiss(false), config.duration);
                        }
                    });
                }
            };
        })();

        // --- Demo Functions ---

        function runSimple() {
            M3Snack.show({
                message: "設定をサーバーに保存しました。"
            });
        }

        async function runAction() {
            const result = await M3Snack.show({
                message: "スレッドをアーカイブしました",
                actionText: "元に戻す",
                duration: 6000
            });

            if (result) {
                M3Snack.show({ message: "アーカイブを取り消しました" });
            }
        }

        function runLong() {
            M3Snack.show({
                message: "この通知は10秒間表示されます。",
                duration: 10000
            });
        }
