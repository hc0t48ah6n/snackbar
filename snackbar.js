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
                        min-width: 288px;
                        max-width: 568px;
                        background-color: #313033;
                        color: #f4eff4;
                        padding: 14px 16px;
                        border-radius: 4px;
                        box-shadow: 0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        font-family: 'Roboto', sans-serif;
                        font-size: 14px;
                        z-index: 10000;
                        transition: transform 0.2s cubic-bezier(0, 0, 0.2, 1), opacity 0.2s;
                        opacity: 0;
                    }
                    .m3-snack-container.show {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                    .m3-snack-message { flex-grow: 1; margin-right: 12px; }
                    .m3-snack-action {
                        color: #d0bcff;
                        font-weight: 500;
                        text-transform: uppercase;
                        cursor: pointer;
                        background: none;
                        border: none;
                        padding: 8px;
                        margin: -8px;
                        border-radius: 4px;
                        font-family: inherit;
                        font-size: 14px;
                    }
                    .m3-snack-action:hover { background-color: rgba(208, 188, 255, 0.08); }
                `;
                document.head.appendChild(style);
            }

            window.M3Snack = {
                show: function(options) {
                    return new Promise((resolve) => {
                        const config = {
                            message: options.message || '',
                            actionText: options.actionText || '',
                            duration: options.duration || 4000
                        };

                        const snack = document.createElement('div');
                        snack.className = 'm3-snack-container';
                        
                        let actionHtml = '';
                        if (config.actionText) {
                            actionHtml = `<button class="m3-snack-action">${config.actionText}</button>`;
                        }

                        snack.innerHTML = `<div class="m3-snack-message">${config.message}</div>${actionHtml}`;
                        document.body.appendChild(snack);

                        requestAnimationFrame(() => { snack.classList.add('show'); });

                        let resolved = false;
                        const dismiss = (result) => {
                            if (resolved) return;
                            resolved = true;
                            snack.classList.remove('show');
                            setTimeout(() => {
                                snack.remove();
                                resolve(result);
                            }, 200);
                        };

                        const actionBtn = snack.querySelector('.m3-snack-action');
                        if (actionBtn) {
                            actionBtn.onclick = () => dismiss(true);
                        }

                        if (config.duration > 0) {
                            setTimeout(() => dismiss(false), config.duration);
                        }
                    });
                }
            };
        })();

        // --- Demo Functions ---

        async function simpleSnack() {
            M3Snack.show({
                message: "設定を更新しました"
            });
        }

        async function actionSnack() {
            // 表示と待機
            const clicked = await M3Snack.show({
                message: "ファイルをゴミ箱に移動しました",
                actionText: "元に戻す",
                duration: 5000
            });

            // ボタンが押された（clicked === true）場合の処理
            if (clicked) {
                // 続けて別のスナックバーを表示して処理中であることを示す例
                M3Snack.show({ 
                    message: "復元しています...",
                    duration: 2000
                });
                console.log("ユーザーがアクションボタンをクリックしました。");
            } else {
                console.log("アクションなしで消去されました。");
            }
        }
