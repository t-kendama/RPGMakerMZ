/*
----------------------------------------------------------------------------
 KEN_RecoveryGauge v0.9.0
----------------------------------------------------------------------------
 (C)2024 KEN
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 0.9.0 2025/01/05 仮登録
----------------------------------------------------------------------------
*/
/*:
 * @target MZ
 * @plugindesc HP/MP回復ゲージを表示するプラグイン
 * @author KEN
 *
 * @help
 * バトラーのHP/MP回復量を視覚的に表示する追加ゲージを描画します。
 * 回復量はバトラーのHP/MP再生率から算出されます。
 *
 * 特徴:
 * - HP/MPの自然回復量をゲージ上で可視化。
 * - ゲージの色はプラグインパラメータでカスタマイズ可能。
 *
 * 使い方:
 * プラグインを有効化するだけで機能します。
 *
 *
 * @param HpRecoveryGaugeColor1
 * @text HP回復ゲージ色1
 * @desc HP回復ゲージの左側の色（CSS形式で指定）。
 * @default #99FF99
 *
 * @param HpRecoveryGaugeColor2
 * @text HP回復ゲージ色2
 * @desc HP回復ゲージの右側の色（CSS形式で指定）。
 * @default #66CC66
 *
 * @param MpRecoveryGaugeColor1
 * @text MP回復ゲージ色1
 * @desc MP回復ゲージの左側の色（CSS形式で指定）。
 * @default #66CCFF
 *
 * @param MpRecoveryGaugeColor2
 * @text MP回復ゲージ色2
 * @desc MP回復ゲージの右側の色（CSS形式で指定）。
 * @default #3399FF
 */

(() => {
    const pluginName = "KEN_RecoveryGauge";

    const parameters = PluginManager.parameters(pluginName);
    const hpRecoveryGaugeColor1 = parameters["HpRecoveryGaugeColor1"] || "#99FF99";
    const hpRecoveryGaugeColor2 = parameters["HpRecoveryGaugeColor2"] || "#66CC66";
    const mpRecoveryGaugeColor1 = parameters["MpRecoveryGaugeColor1"] || "#66CCFF";
    const mpRecoveryGaugeColor2 = parameters["MpRecoveryGaugeColor2"] || "#3399FF";

    const _Sprite_Gauge_initialize = Sprite_Gauge.prototype.initialize;
    Sprite_Gauge.prototype.initialize = function() {
        _Sprite_Gauge_initialize.apply(this, arguments);
        this._recoveryValue = 0;
    };

    Sprite_Gauge.prototype.setRecoveryValue = function(value) {
        this._recoveryValue = value;
    };

    Sprite_Gauge.prototype.drawRecoveryGaugeRect = function(x, y, width, height) {
        if (this._recoveryValue > 0) {
            const rate = this._recoveryValue / this.currentMaxValue();
            const fillW = Math.floor(width * rate);
            const currentRate = this.currentValue() / this.currentMaxValue();
            const currentW = Math.floor(width * currentRate);

            const adjustedX = x + currentW;
            const availableW = Math.max(0, width - currentW);
            const finalFillW = Math.min(fillW, availableW);

            if (finalFillW > 0) {
                const color1 = this._statusType === "hp" ? hpRecoveryGaugeColor1 : mpRecoveryGaugeColor1;
                const color2 = this._statusType === "hp" ? hpRecoveryGaugeColor2 : mpRecoveryGaugeColor2;

                this.bitmap.gradientFillRect(adjustedX, y + 1, finalFillW, height - 2, color1, color2);
            }
        }
    };

    const _Sprite_Gauge_drawGaugeRect = Sprite_Gauge.prototype.drawGaugeRect;
    Sprite_Gauge.prototype.drawGaugeRect = function(x, y, width, height) {
        _Sprite_Gauge_drawGaugeRect.call(this, x, y, width, height);
        this.drawRecoveryGaugeRect(x, y, width, height);
    };

    const _Sprite_Gauge_update = Sprite_Gauge.prototype.update;
    Sprite_Gauge.prototype.update = function() {
        _Sprite_Gauge_update.call(this);
        if (this._battler && this._statusType === "hp") {
            this.setRecoveryValue(this._battler.xparam(7) * this._battler.mhp);
        } else if (this._battler && this._statusType === "mp") {
            this.setRecoveryValue(this._battler.xparam(8) * this._battler.mmp);
        } else {
            this.setRecoveryValue(0);
        }
    };
})();
