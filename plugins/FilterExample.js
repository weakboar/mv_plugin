/*:ja
 * メモ: Filterをプラグインコマンドから利用するためのプラグイン。
 *
 * @plugindesc BloomFilter,TiltShiftFilter,GrayScale,Sepiaをプラグインコマンドから利用できます。
 * @author weakboar
 *
 * @help
 *
 * プラグインコマンド:
 *   Filter bloom           # BloomFilterを有効にする
 *   TiltShift bloom        # TiltShiftFilterを有効にする
 */
(function () {
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        var argsLen = args.length;
        for(var i=0; i < argsLen; i++) {
            args[i] = Window_Base.prototype.convertEscapeCharacters(args[i]);
        }

        if(command == "Filter") {
            SceneManager._scene.filters = SceneManager._scene.filters || [];
            switch(args[0])
            {
                case "bloom":
                    MapFilterManager.add("bloom");
                    break;
                case "tiltshift":
                    MapFilterManager.add("tiltshift");
                    break;
                case "grayscale":
                    MapFilterManager.add("grayscale");
                    break;
                case "sepia":
                    MapFilterManager.add("sepia");
                    break;
                case "default":
                default:
                    MapFilterManager.clear();
                    break;
            }
            MapFilterManager.exec();
        }
    }
})();

