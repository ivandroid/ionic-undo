/*!
 * Copyright 2016 Ivan Weber
 *
 * ionic-undo, v1.0.0
 *
 * By @_ivandroid_
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 *
 */

/* global ionic */

(function (angular) {
    
    angular.module("ionicUndo.directives", [])
        .directive("ionUndoBar", ["$ionicUndo", "$ionicUndoConfig", function($ionicUndo, $ionicUndoConfig) {
            return {
                restrict: "E",
                scope: true,
                template: '<div class="bar ionic-undo-bar {{background}}-bg {{color}}"' + 
                               'ng-if="data.length > 0 && isAndroid"' + 
                               'ng-click="restore()">' +
                               '<span class="ionic-undo-left {{color}}">{{data.length}} {{text.deleted}}</span>' +
                               '<span class="ionic-undo-right {{color}}">{{text.undo}}</span>' +
                          '</div>',
                link: function($scope) {
                    $scope.background = $ionicUndoConfig.background;
                    $scope.color = $ionicUndoConfig.color;
                    $scope.text = $ionicUndo.getText();
                    $scope.data = $ionicUndo.getData(true);
                    $scope.isAndroid = ionic.Platform.isAndroid() && $ionicUndoConfig.isAndroid;
                    $scope.restore = $ionicUndo.restore;
                    
                    $scope.$on("$stateChangeStart", $ionicUndo.clear);
                }
            };
        }])
        .directive("ionUndoButton", ["$ionicUndo", "$ionicUndoConfig", function($ionicUndo, $ionicUndoConfig) {
            return {
                restrict: "E",
                scope: true,
                template: '<button class="button button-icon {{icon}}"' +
                                  'ng-if="data.length > 0 && isIos"' +
                                  'ng-click="restore()">' + 
                          '</button>',
                link: function($scope) {
                    $scope.data = $ionicUndo.getData(true);
                    $scope.icon = $ionicUndoConfig.icon;
                    $scope.isIos = !ionic.Platform.isAndroid() && $ionicUndoConfig.isIos;
                    $scope.restore = $ionicUndo.restore;
                    
                    $scope.$on("$stateChangeStart", $ionicUndo.clear);
                }
            };
        }]);

    angular.module("ionicUndo.providers", [])
        .provider("$ionicUndoConfig", function() {
            var android = ionic.Platform.isAndroid();
            var background = "dark";
            var color = "light";
            var deletedText = "deleted";
            var icon = "ion-ios-undo";
            var ios = true;
            var undoText = "UNDO";
            return {
                setBackground: function(_background) {
                    background = _background;
                },
                setColor: function(_color) {
                    color = _color;
                },
                setDeletedText: function(_deletedText) {
                    deletedText = _deletedText;
                },
                setIcon: function(_icon) {
                    icon = _icon;
                },
                setUndoAndroid: function(_android) {
                    android = _android;
                },
                setUndoIos: function(_ios) {
                    ios = _ios;
                },
                setUndoText: function(_undoText) {
                    undoText = _undoText;
                },
                $get: function() {
                    return {
                        background: background,
                        color: color,
                        deletedText: deletedText,
                        icon: icon,
                        isAndroid: android,
                        isIos: ios,
                        undoText: undoText
                    };
                }
            };
        });
    
    angular.module("ionicUndo.services", [])
        .factory("$ionicUndo", ["$ionicUndoConfig", "$log", function($ionicUndoConfig, $log) {
            var self = this;
            var data = [];
            var text = {
                deleted: "",
                undo: ""
            };
            var onRestore;
            
            self.clear = function() {
                angular.copy([], data);
            };
            
            self.get = function() {
                if (data.length === 1) {
                    return data[0];
                }
                return data;
            };
            
            self.getData = function() {
                return data;
            };
            
            self.getText = function() {
                return text;
            };
            
            self.init = function(_data, _onRestore, deletedText, undoText) {
                if (!angular.isArray(_data)) {
                    _data = [_data];
                }
                angular.copy(_data, data);
                onRestore = _onRestore;
                text.deleted = deletedText || $ionicUndoConfig.deletedText;
                text.undo = undoText || $ionicUndoConfig.undoText;
            };
            
            self.restore = function() {
                if (angular.isFunction(onRestore)) {
                    try {
                        return onRestore().then(self.clear);
                    } catch(e) {
                        self.clear();
                    }
                } else {
                    return $log.error("No restore function defined!");
                }
            };
            
            self.setDeletedText = function(deletedText) {
                text.deleted = deletedText;
            };
            
            self.setUndoText = function(undoText) {
                text.undo = undoText;
            };
            
            return self;
    }]);

    // App
    angular.module("ionicUndo", [
        "ionicUndo.directives",
        "ionicUndo.providers",
        "ionicUndo.services"
    ]);
})(angular);