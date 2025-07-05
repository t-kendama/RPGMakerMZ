/*
----------------------------------------------------------------------------
 KEN_RegionColor v1.0.0
----------------------------------------------------------------------------
 (C)2025 KEN
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/06/30 初版
----------------------------------------------------------------------------
*/
/*:
 * @target MZ
 * @plugindesc リージョンの色を描画します
 * @author KEN
 * @url https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_RegionColor.js
 * 
 * @help 
 * 
 * マップ上のリージョンに色を描画します。
 * リージョンの設定はプラグインコマンド、またはプラグインパラメータから設定します。
 * 
 * リージョンの色を消去したい場合、プラグインコマンドから行ってください。
 * 色はCSSカラー名も使用可能です（red, blue など）。
 * 
 * 
 * @param DefaultRegionColors
 * @text デフォルトのリージョン色
 * @type struct<RegionColor>[]
 * @default []
 *
 * @command setRegionColor
 * @text リージョン色を設定
 * @desc 指定リージョンに色・不透明度・点滅・フラッシュ効果を設定します。
 *
 * @arg regionId
 * @type number
 * @text リージョンID
 * @desc 色を設定するリージョンID
 * @default 1
 * @min 1
 * @max 255
 *
 * @arg color
 * @type combo
 * @desc 色の設定（例．rgb(255,0,0)）
 * @text 色
 * @option #FF0000
 * @option red
 * @option blue
 * @option green
 * @option yellow
 * @option cyan
 * @option magenta
 * @option black
 * @option white
 * @default #FF0000
 *
 * @arg alpha
 * @type number
 * @text 不透明度
 * @desc リージョン色の不透明度
 * @min 0
 * @max 255
 * @default 128
 *
 * @arg blink
 * @type boolean
 * @text 点滅
 * @desc リージョンを点滅させます
 * @default false
 *
 * @arg flash
 * @type boolean
 * @text フラッシュ
 * @desc リージョンにフラッシュアニメーションをつけます
 * @default false
 *
 *
 * @command clearRegionColor
 * @text 指定リージョンの色を消す
 * @desc 指定したリージョンIDの色設定をクリアします
 * 
 * @arg regionId
 * @type number
 * @text リージョンID
 * @default 1
 * @min 1
 * @max 255
 *
 * @command clearAllRegionColor
 * @text 全リージョン色をクリア
 * @desc 登録した全リージョンカラー設定を消去します
 * 
 * @command restoreRegionColorPreset
 * @text リージョンプリセットを復元
 * @desc プラグインパラメータで定義されたリージョンカラーを再適用します。
 * 
 */

/*~struct~RegionColor:
 * @param regionId
 * @type number
 * @text リージョンID
 * @default 1
 * @min 1
 * @max 255
 *
 * @param color
 * @type combo
 * @text 色
 * @desc 色の設定（例．rgb(255,0,0)）
 * @default #FF0000
 * @option red
 * @option blue
 * @option green
 * @option yellow
 * @option cyan
 * @option magenta
 * @option black
 * @option white
 * @default red
 *
 * @param alpha
 * @type number
 * @text 不透明度
 * @desc リージョン色の不透明度
 * @default 128
 * @min 0
 * @max 255
 * 
 * @param blink
 * @type boolean
 * @text 点滅させる
 * @desc リージョンを点滅させます
 * @default false
 * 
 * @param flash
 * @type boolean
 * @text フラッシュさせる
 * @desc リージョンにフラッシュアニメーションをつけます
 * @default false
 * 
 */


(() => {
'use strict';

// Plugin Parameters
const pluginName = "KEN_RegionColor";
const parameters = PluginManager.parameters(pluginName);
const defaultColors = JSON.parse(parameters.DefaultRegionColors || "[]").map(str => JSON.parse(str));

PluginManager.registerCommand(pluginName, "setRegionColor", args => {
    const regionId = Number(args.regionId);
    const color = args.color || "red";
    const alpha = isNaN(Number(args.alpha)) ? 255 : Number(args.alpha);
    const blink = String(args.blink) === "true";
    const flash = String(args.flash) === "true";

    $gameMap.setRegionColor(regionId, color, alpha, blink, flash);
});

PluginManager.registerCommand(pluginName, "clearRegionColor", args => {
    const regionId = Number(args.regionId);
    $gameMap._regionColorOverlay.delete(regionId);
});

PluginManager.registerCommand(pluginName, "clearAllRegionColor", () => {
    $gameMap._regionColorOverlay.clear();
});

PluginManager.registerCommand(pluginName, "restoreRegionColorPreset", () => {
    $gameMap.restoreDefaultRegionColors();
});


const _DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    _DataManager_extractSaveContents.call(this, contents);

    const overlayData = contents.regionColorOverlayData;
    if (overlayData) {
        $gameMap._regionColorOverlay = new Map(
            Object.entries(overlayData).map(([key, value]) => [Number(key), value])
        );
    }
};

const _DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    const contents = _DataManager_makeSaveContents.call(this);

    if ($gameMap._regionColorOverlay instanceof Map) {
        contents.regionColorOverlayData = Object.fromEntries($gameMap._regionColorOverlay);
    }

    return contents;
};


const _Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
    _Game_Map_initialize.call(this);
    console.log(this._regionColorOverlay)

    if (!this._regionColorOverlay) {
        this._regionColorOverlay = new Map();
        for (const entry of defaultColors) {
            this._regionColorOverlay.set(Number(entry.regionId), {
                color: entry.color,
                alpha: Number(entry.alpha),
                blink: String(entry.blink) === "true",
                flash: String(entry.flash) === "true"
            });
        }
    }
};

Game_Map.prototype.setRegionColor = function(regionId, color, alpha = 255, blink = false, flash = false) {
    if (!this._regionColorOverlay) {
        this._regionColorOverlay = new Map();
    }
    this._regionColorOverlay.set(regionId, {
        color,
        alpha,
        blink,
        flash
    });
};

Game_Map.prototype.restoreDefaultRegionColors = function() {
    if (!this._regionColorOverlay) this._regionColorOverlay = new Map();
    for (const entry of defaultColors) {
        const regionId = Number(entry.regionId);
        const color = entry.color;
        const alpha = Number(entry.alpha) || 255;
        const blink = entry.blink === true;
        const flash = entry.flash === true;
        this._regionColorOverlay.set(regionId, { color, alpha, blink, flash });
    }
};


const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
    _Spriteset_Map_createLowerLayer.call(this);
    this.createRegionOverlay();
};

Spriteset_Map.prototype.createRegionOverlay = function() {
    const width = $gameMap.width() * $gameMap.tileWidth();
    const height = $gameMap.height() * $gameMap.tileHeight();

    this._regionOverlaySprite = new Sprite();
    this._regionOverlayBitmap = new Bitmap(width, height);
    this._regionOverlaySprite.bitmap = this._regionOverlayBitmap;

    const index = this._tilemap.children.indexOf(this._tilemap._lowerLayer);
    this._tilemap.addChildAt(this._regionOverlaySprite, index + 1);
};

Spriteset_Map.prototype.getBlinkAlpha = function(baseAlpha, blink) {
    if (!blink) return baseAlpha;
    const frame = this._regionBlinkFrame || 0;
    const rate = 0.5 + 0.5 * Math.sin(frame / 20);
    return Math.floor(baseAlpha * rate);
};

Spriteset_Map.prototype.updateRegionOverlay = function() {
    console.log($gameMap._regionColorOverlay)
    if (!this._regionOverlaySprite) return;

    const tileWidth = $gameMap.tileWidth();
    const tileHeight = $gameMap.tileHeight();
    const dx = $gameMap.displayX();
    const dy = $gameMap.displayY();
    const mapWidth = $gameMap.width();
    const mapHeight = $gameMap.height();

    // スプライトの表示位置（小数点スクロールに追従）
    this._regionOverlaySprite.x = -(dx % 1) * tileWidth;
    this._regionOverlaySprite.y = -(dy % 1) * tileHeight;

    // アニメフレーム更新
    this._regionBlinkFrame = ((this._regionBlinkFrame || 0) + 1) % 126;

    const bitmap = this._regionOverlayBitmap;
    bitmap.clear();

    const screenTileX = $gameMap.screenTileX();
    const screenTileY = $gameMap.screenTileY();

    for (let sy = 0; sy <= screenTileY; sy++) {
        for (let sx = 0; sx <= screenTileX; sx++) {
            const mx = (Math.floor(dx) + sx) % mapWidth;
            const my = (Math.floor(dy) + sy) % mapHeight;

            const regionId = $gameMap.regionId(mx, my);
            const config = $gameMap._regionColorOverlay.get(regionId);
            if (!config) continue;

            const alpha = this.getBlinkAlpha(config.alpha, config.blink);
            const color = this.getFlashColor(config.color, config.flash);
            bitmap.paintOpacity = alpha;
            bitmap.fillRect(sx * tileWidth, sy * tileHeight, tileWidth, tileHeight, color);
        }
    }

    bitmap.paintOpacity = 255;
};

Spriteset_Map.prototype.getFlashColor = function(color, flash) {
    if (!flash) return color;
    const frame = this._regionBlinkFrame || 0;
    const rate = 0.5 + 0.5 * Math.sin(frame / 20); // 0〜1
    return this.blendColor(color, "#ffffff", rate);
};

Spriteset_Map.prototype.getFlashColor = function(color, flash) {
    if (!flash) return color;
    const frame = this._regionBlinkFrame || 0;
    const rate = 0.5 + 0.5 * Math.sin(frame / 20); // 0〜1
    return this.blendColorPreserveHue(color, rate);
};

Spriteset_Map.prototype.blendColor = function(c1, c2, rate) {
    const [r1, g1, b1] = this.colorToRGB(c1);
    const [r2, g2, b2] = this.colorToRGB(c2);
    const r = Math.floor(r1 + (r2 - r1) * rate);
    const g = Math.floor(g1 + (g2 - g1) * rate);
    const b = Math.floor(b1 + (b2 - b1) * rate);
    return `rgb(${r},${g},${b})`;
};

Spriteset_Map.prototype.colorToRGB = function(color) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = color;
    const computed = ctx.fillStyle; 
    // rgb() 形式
    let match = computed.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (match) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    // #rrggbb 形式
    match = computed.match(/^#([0-9a-f]{6})$/i);
    if (match) {
        const hex = match[1];
        return [
            parseInt(hex.substring(0, 2), 16),
            parseInt(hex.substring(2, 4), 16),
            parseInt(hex.substring(4, 6), 16)
        ];
    }
    if (match) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    return [255, 255, 255]; // fallback
};

Spriteset_Map.prototype.blendColorPreserveHue = function(color, rate) {
    const [r, g, b] = this.colorToRGB(color);
    const toWhite = (c) => Math.floor(c + (255 - c) * rate);
    return `rgb(${toWhite(r)}, ${toWhite(g)}, ${toWhite(b)})`;
};

const _Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
    _Spriteset_Map_update.call(this);
    this.updateRegionOverlay();
};

})();