/*
----------------------------------------------------------------------------
 KEN_TermHelpWindow v0.9.0
----------------------------------------------------------------------------
 (C)2024 KEN
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 0.9.0 2024/12/29 仮登録
----------------------------------------------------------------------------
*/
/*:
 * @target MZ
 * @plugindesc 用語ヘルプウィンドウプラグイン
 * @author KEN
 * 
 * @help
 * 
 * -------------------------    概要    -------------------------
 * ヘルプウィンドウに加えて追加のヘルプウィンドウを表示する機能を提供します。
 * 
 * ヘルプウィンドウ中の文字列から用語を検出し、用語が存在する場合は
 * 追加のヘルプウィンドウが表示されるようになります。
 * 
 * ヘルプウィンドウの表示方法はシーン個別で設定する必要があります。
 * 
 * -------------------------    使い方    -------------------------
 * 本プラグインはプラグインパラメータ上で設定します。
 * 
 * ・用語リスト
 * 用語の説明を登録します。
 * 
 * 
 *
 * @param Terms
 * @type struct<Term>[]
 * @text 用語リスト
 * @desc ヘルプウィンドウで検出する用語とその説明を登録します
 *
 * @param SceneSettings
 * @type struct<SceneSetting>[]
 * @text シーン設定
 * @desc 用語ウィンドウの表示シーンを設定します
 * 
 * @param DefaultKey
 * @type string
 * @text 表示切替キー
 * @desc 用語ヘルプウィンドウの表示切替キー（デフォルト：shift）
 * @default shift
 * 
 * @param DisplayText
 * @type string
 * @text 用語ヘルプテキスト
 * @desc 用語ヘルプが表示できることを示す文章 ヘルプウィンドウの右下に表示されます
 * @default Shift: 用語表示
 *
 * @param TermFontSize
 * @type number
 * @text 用語フォントサイズ
 * @desc 用語名のフォントサイズを設定します
 * @default 20
 *
 * @param DescriptionFontSize
 * @type number
 * @text 説明フォントサイズ
 * @desc 用語説明のフォントサイズを設定します
 * @default 16
 *
 * @param TermSpacing
 * @type number
 * @text 用語間スペース
 * @desc 用語と説明の間の縦方向スペース（ピクセル単位）
 * @default 10
 * 
 * @param TermColor
 * @type color
 * @text 用語色
 * @desc 用語を表示する時の色
 * @default 6
 */

/*~struct~Term:
 * @param Term
 * @type string
 * @text 用語
 * @desc 検出する用語。
 *
 * @param Description
 * @type note
 * @text 説明
 * @desc 用語の説明テキスト
 */

/*~struct~SceneSetting:
 * @param SceneName
 * @type combo
 * @text シーン名
 * @desc 対象となるシーン名。オリジナルシーンの場合は手動で記述ください。
 * @option Scene_Item
 * @value Scene_Item
 * @option Scene_Equip
 * @value Scene_Equip
 * @option Scene_Skill
 * @value Scene_Skill
 * @option Scene_Battle
 * @value Scene_Battle
 *
 * @param Width
 * @type number
 * @text 幅の最大値
 * @desc 用語ウィンドウの幅最大値。
 * @default 600
 *
 * @param Height
 * @type number
 * @text 高さの最大値
 * @desc 用語ウィンドウの高さ最大値。
 * @default 400
 *
 * @param Alignment
 * @type select
 * @text 表示位置
 * @desc 用語ウィンドウの表示位置。ヘルプウィンドウを基準にして描画します。
 * @option 左上
 * @value 0
 * @option 左下
 * @value 1
 * @option 右上
 * @value 2
 * @option 右下
 * @value 3
 * @default 0
 * 
 */

(() => {
    const PluginName = "KEN_TermHelpWindow";
    const Parameters = PluginManager.parameters(PluginName);
    const Terms = JSON.parse(Parameters["Terms"] || "[]").map(term => {
        const ParsedTerm = JSON.parse(term);
        ParsedTerm.Description = ParsedTerm.Description.replace(/\r\n|\n|\r/g, "\n");
        return ParsedTerm;
    });
    const SceneSettings = JSON.parse(Parameters["SceneSettings"] || "[]").map(setting => JSON.parse(setting));
    const DefaultKey = Parameters["DefaultKey"] || "shift";
    const TermFontSize = Number(Parameters["TermFontSize"] || 20);
    const DescriptionFontSize = Number(Parameters["DescriptionFontSize"] || 16);
    const TermSpacing = Number(Parameters["TermSpacing"] || 10);
    const TermColor = Parameters["TermColor"] || 0;
    const DisplayText = Parameters["DisplayText"] || "";

    //====================================================================
    // TermHelpWindow
    //====================================================================

    class TermHelpWindow extends Window_Help {
        initialize(rect) {
            Window_Base.prototype.initialize.call(this, rect);
            this._text = "";
            this.clear();
            this.hide(); // 初期状態で非表示にする
            this._visibleToggle = false; // 表示ON/OFF用フラグ
        }

        resetFontSettings() {
            this.contents.fontFace = $gameSystem.mainFontFace();
            this.resetTextColor();
        }

        lineHeight() {
            return Math.ceil(this.contents.fontSize * 1.2); // フォントサイズに基づく自動調整
        }

        toggleVisibility() {
            if (this.isShowText()) {
                SoundManager.playOk();
                if (!this._visibleToggle) {
                    this.show();
                    this._visibleToggle = true;
                } else {
                    this.hide();
                    this._visibleToggle = false;
                }
            }
        }

        isShowText() {
            return this._text !== "";
        }

        hide() {
            super.hide();
            this._visibleToggle = false;
        }

        setTermsText(terms) {
            this.clear();
            this._text = terms.map(term => {
                const descriptionText = term.Description.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
                return `${term.Term}\n${descriptionText}`;
            }).join("\n\n");

            const rect = this.calcAutoRect(terms);
            this.contents.resize(rect.width - this.padding * 2, rect.height - this.padding * 2);
            this.width = rect.width;
            this.height = rect.height;
            this.refresh();

            let y = 0;
            this.contents.clear();
            terms.forEach((term, index) => {
                this.contents.fontSize = TermFontSize;
                const termText = term.Term;
                this.drawText(termText, 0, y, this.contentsWidth(), "left");
                y += this.lineHeight();

                this.contents.fontSize = DescriptionFontSize;
                this.resetTextColor();
                const descriptionText = term.Description.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
                const lines = descriptionText.split("\n");
                lines.forEach(line => {
                    this.drawText(line, 0, y, this.contentsWidth(), "left");
                    y += this.lineHeight();
                });

                // 用語が複数あり、最後の要素でない場合のみスペースを追加
                if (terms.length > 1 && index < terms.length - 1) {
                    y += TermSpacing;
                }
            });
        }

        calcAutoRect(terms) {
            if (!terms || terms.length === 0) {
                return new Rectangle(0, 0, 200, 100); // デフォルトサイズ
            }

            let totalHeight = 0;
            let maxLineWidth = 0;

            terms.forEach((term, index) => {
                // 用語名の高さと幅を計算
                this.contents.fontSize = TermFontSize;
                totalHeight += this.lineHeight();
                maxLineWidth = Math.max(maxLineWidth, this.textWidth(term.Term));

                // 説明文の高さと幅を計算
                this.contents.fontSize = DescriptionFontSize;
                const descriptionLines = term.Description.replace(/^"|"$/g, "").replace(/\\n/g, "\n").split("\n");
                totalHeight += descriptionLines.length * this.lineHeight();
                maxLineWidth = Math.max(maxLineWidth, ...descriptionLines.map(line => this.textWidth(line)));

                // 用語が複数あり、最後の要素でない場合のみスペースを追加
                if (terms.length > 1 && index < terms.length - 1) {
                    totalHeight += TermSpacing;
                }
            });

            const height = totalHeight + this.padding * 2;
            const width = Math.min(maxLineWidth + this.padding * 2, 600); // 最大幅制限

            return new Rectangle(0, 0, width, height);
        }
    }

    //====================================================================
    // Window_Help
    //====================================================================

    Window_Help.prototype.processTerms = function(text) {
        let matchedTerms = [];
        for (const term of Terms) {
            const regex = new RegExp(`(^|[^\w])(${term.Term})(?=[^\w]|$)`, "gu");
            text = text.replace(regex, (match, p1, p2) => {
                matchedTerms.push(term);
                return `${p1}\x1bC[${TermColor}]${p2}\x1bC[0]`;
            });
        }
        return { text, matchedTerms };
    };

    const _Window_Help_setText = Window_Help.prototype.setText;
    Window_Help.prototype.setText = function(text) {
        const { text: processedText, matchedTerms } = this.processTerms(text);
        _Window_Help_setText.call(this, processedText);
        if (this._extraHelpWindow) {
            if (matchedTerms.length > 0) {
                this._extraHelpWindow.setTermsText(matchedTerms);
                const rect = this._extraHelpWindow.calcAutoRect(matchedTerms);
                const sceneName = SceneManager._scene.constructor.name;
                const x = this.calculateWindowX(rect, sceneName);
                const y = this.calculateWindowY(rect, sceneName);
                this._extraHelpWindow.move(x, y, rect.width, rect.height);
            } else {
                this._extraHelpWindow.clear();
                this._extraHelpWindow.hide();
            }
            this.refreshDisplayHelpText();
        }
    };

    Window_Help.prototype.calculateWindowX = function(rect, sceneName) {
        const BaseX = this.x;
        const Setting = SceneSettings.find(s => s.SceneName === sceneName);
        if (!Setting) return BaseX;
        return Number(Setting.Alignment) >= 2 ? BaseX + this.width - rect.width : BaseX;
    };

    Window_Help.prototype.calculateWindowY = function(rect, sceneName) {
        const BaseY = this.y;
        const Setting = SceneSettings.find(s => s.SceneName === sceneName);
        if (!Setting) return BaseY;
        return Number(Setting.Alignment) % 2 === 1 ? BaseY + this.height : BaseY - rect.height;
    };

    Window_Help.prototype.attachExtraHelpWindow = function(sceneName) {
        const Setting = SceneSettings.find(s => s.SceneName === sceneName);
        if (!Setting) return; // 設定がない場合は処理を中断

        const ExtraHelpWindow = new TermHelpWindow(new Rectangle(0, 0, 200, 100));
        this._extraHelpWindow = ExtraHelpWindow;
        this.parent.addChildAt(ExtraHelpWindow, this.parent.children.length); // 常に最上位に追加
    };

    Window_Help.prototype.refreshDisplayHelpText = function() {
        if (this.hasTermText()) {
            const text = DisplayText;
            const fontSize = 18;
            const width = this.textWidth(DisplayText);
            const x = this.contentsWidth() - width;
            const y = this.contentsHeight() - fontSize - this.padding;
            this.contents.fontSize = fontSize;
            this.contents.fontFace = $gameSystem.mainFontFace();
            this.resetTextColor();
            this.drawText(text, x, y, width, "right");
        }
    };

    Window_Help.prototype.hasTermText = function() {
        if(this._extraHelpWindow) {
            return DisplayText != "" && this._extraHelpWindow.isShowText();
        }
        return false;
    };

    //====================================================================
    // Scene_Base
    //====================================================================

    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.call(this);
        if (this._helpWindow && typeof this._helpWindow.attachExtraHelpWindow === "function") {
            const SceneName = this.constructor.name;
            this._helpWindow.attachExtraHelpWindow(SceneName);
        }
    };

    const _Window_Selectable_update = Window_Selectable.prototype.update;
    Window_Selectable.prototype.update = function() {
        _Window_Selectable_update.call(this);
        if (this.active && Input.isTriggered(DefaultKey)) {
            if (this._helpWindow && this._helpWindow._extraHelpWindow) {
                this._helpWindow._extraHelpWindow.toggleVisibility();
            }
        }
    };
})();
