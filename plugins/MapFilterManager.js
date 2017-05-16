/*:ja
 * メモ: SceneManager._scene._spriteset.filtersに適用するフィルターを管理
 *
 * @plugindesc マップのFilterを管理する。セーブ/ロード対応。
 * @author weakboar
 *
 * @help
 * Filterの各パラメータ値の設定は非対応です。
 */

/**
 * API
 */
function MapFilterManager() {
    throw new Error('This is a static class');
}
MapFilterManager._filters =[];
MapFilterManager._instances = {};
MapFilterManager._active = [];

MapFilterManager.add = function(filterName)
{
    for(var i=0; i < this._active.length; i++)
    {
        if( filterName == this._active[i].key)
        {
            console.log('exist keyName!!');
            return;
        }
    }
    console.log(filterName);
    var filterInstance = new MapFilterManager._filters[filterName]();
    var data = {"key":filterName, "filter":filterInstance};
    this._active.push(data);
}
MapFilterManager.remove = function(keyName)
{
    for(var i=0; i < this._active.length; i++)
    {
        if( keyName == this._active[i].key)
        {
            this._active.splice(i,1);
            break;
        }
    }
}
MapFilterManager.clear = function()
{
    this._active.length = 0;
}
MapFilterManager.exec = function()
{
    if(!(SceneManager._scene instanceof Scene_Map))
    {
        console.log('Current scene is not Scene_Map')
        return;
    }
    var filter = [];
    for(var i=0; i < this._active.length; i++)
    {
        filter.push(this._active[i].filter);
    }
    SceneManager._scene._spriteset.filters = filter;
};
/**
 *  セーブ/ロード時のフィルターの保存/読み込み
 */
MapFilterManager.saveContents = function() {
    var contents = [];
    for( var index in MapFilterManager._active) {
        var filter = MapFilterManager._active[index];
        var data = { name : filter.key };
        data.uniform = {};
        for( var key in filter.filter) {
            data.uniform[key] = filter.filter[key];
        }

        contents.push(data);
    }
    return contents;
}
MapFilterManager.loadContents = function( contents ) {
    MapFilterManager.clear();
    for(var i=0; i < contents.length; i++){
        console.log(contents[i]);
        MapFilterManager.add(contents[i].name);
    }
}
var _Scene_Save_OnSavefileOk = Scene_Save.prototype.onSavefileOk;
Scene_Save.prototype.onSavefileOk = function() {
    $gameSystem.map_filter = MapFilterManager.saveContents();
    _Scene_Save_OnSavefileOk.call( this );
}
var _Scene_Load_OnLoadSuccess = Scene_Load.prototype.onLoadSuccess;  
Scene_Load.prototype.onLoadSuccess = function() {
    _Scene_Load_OnLoadSuccess.call( this );
    
    if ( $gameSystem.map_filter ) {
        MapFilterManager.loadContents( $gameSystem.map_filter);
    }
};
/**
*  Scene_Map遷移時にSpriteSetにフィルターを適用する
*/
var mapFilterList = [new PIXI.filters.TiltShiftFilter()];
var _SceneMap_createSpriteSet = Scene_Map.prototype.createSpriteset;
Scene_Map.prototype.createSpriteset = function(){
    this._spriteset = new Spriteset_Map();
    this.addChild(this._spriteset);
    MapFilterManager.exec();
}
/**
 * 起動時にデフォルトのフィルターを登録
 */
var _Scene_Boot_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
    _Scene_Boot_start.call(this);
    MapFilterManager.add('bloom');
    MapFilterManager.add('tiltshift');
};

MapFilterManager._filters['bloom'] = PIXI.filters.BloomFilter;
MapFilterManager._filters['tiltshift'] = PIXI.filters.TiltShiftFilter;
MapFilterManager._filters['grayscale'] = PIXI.filters.GrayScaleFilter;
MapFilterManager._filters['sepia'] = PIXI.filters.SepiaFilter;
