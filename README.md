# ionic-undo  

This plugin provides undo feature similar to several Google apps on Android. It can be integrated into your ionic 1.x app.

## [Demo](http://app-ionicundo.herokuapp.com)  
![animated example](http://i.giphy.com/l2JJDowgKTFn0qLKg.gif)

## Features 
* restoring last state of your objects
* undo bar for Android
* undo button for iOS

## Quick start 
1. Get the files from here or install from bower:

    ```
    bower install ionic-undo
    ```
    
2. Include javascript and css files or their minified versions in your `index.html` file.

    ```html
    <link href="style/css/ionic-undo.min.css" rel="stylesheet">
    <script src="dist/ionic-undo.min.js"></script>
    ```
    
3. Add the module `ionicUndo` to your application dependencies:

    ```javascript
    angular.module('starter', ['ionic', 'ionicUndo'])
    ```
    
4. Add the directives `ion-undo-button` for iOS and `ion-undo-bar` for Android to your view.

5. After modifying your object in the view controller invoke the `init` method of the `$ionicUndo` service passing the original object and your specific undo function as parameters.
You can get the original object via the `$ionicUndo` service's `get` method.

#### Example *(based on the ionic starter tabs app)*

```html
<ion-view view-title="Chats">
    <ion-nav-buttons side="right">
        <ion-undo-button></ion-undo-button>
    </ion-nav-buttons>
    <ion-content>
        <ion-list>
            <ion-item class="item-remove-animate item-avatar item-icon-right"
                      href="#/tab/chats/{{chat.id}}"
                      ng-repeat="chat in chats | orderBy: 'id'">
                <img ng-src="{{chat.face}}">
                <h2>{{chat.name}}</h2>
                <p>{{chat.lastText}}</p>
                <i class="icon ion-chevron-right icon-accessory"></i>
                <ion-option-button class="button-assertive" ng-click="delete(chat)">
                    Delete
                </ion-option-button>
            </ion-item>
        </ion-list>
    </ion-content>
    <ion-undo-bar></ion-undo-bar>
</ion-view>

<ion-view view-title="{{chat.name}}">
    <ion-nav-buttons side="right">
        <button class="button button-icon icon {{deleteIcon}}" ng-click="delete()"></button>
    </ion-nav-buttons>
    <ion-content class="padding">
        <img ng-src="{{chat.face}}" style="width: 64px; height: 64px">
        <p>{{chat.lastText}}</p>
    </ion-content>
</ion-view>
```

```javascript
angular.module('starter.controllers', [])
.controller('ChatsCtrl', function($ionicUndo, $scope, Chats) {
    $scope.chats = Chats.all();
    $scope.delete = function(chat) {
        Chats.delete(chat);
        
        $ionicUndo.init(chat, function() {
            var deletedChat = $ionicUndo.get();
            Chats.add(deletedChat);
        });
    };
})

.controller('ChatDetailCtrl', function($ionicHistory, $ionicUndo, $scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
    $scope.deleteIcon = ionic.Platform.isAndroid() ? "ion-android-delete" : "ion-ios-trash";
    
    $scope.delete = function() {
        Chats.delete($scope.chat);
        
        $ionicUndo.init($scope.chat, function() {
            var deletedChat = $ionicUndo.get();
            Chats.add(deletedChat);
        });
        
        $ionicHistory.goBack();
    };
});
```

## Configuration provider

In the angular configuration phase you can define global settings for this plugin. For that purpose there is a provider named `$ionicUndoConfigProvider`.
The following options can be set in the configuration phase:

option|description|type|accepted values|default value
---|---|---|---|---
background|Undo bar's background color|string|ionic color names|dark
color|Undo bar's foreground color|string|ionic color names|light
deletedText|Undo bar's deleted text (left side)|string|text|deleted
undoText|Undo bar's undo (right side)|string|text|UNDO
icon|Undo button's icon|string|ionic icon css classes|ion-ios-undo
undoAndroid|Enabling / disabling undo feature on Android|boolean|true, false|true
undoIos|Enabling / disabling undo feature on iOS|boolean|true, false|true

#### Example
##### Code

```javascript
angular.module('starter', ['ionic', 'ionicUndo'])
.config(function($ionicUndoConfigProvider) {
    $ionicUndoConfigProvider.setBackground('calm');
    $ionicUndoConfigProvider.setColor('dark');
    $ionicUndoConfigProvider.setDeletedText('deleted items!');
    $ionicUndoConfigProvider.setUndoText('UNDO THAT!');
    $ionicUndoConfigProvider.setIcon('ion-ios-undo-outline');
});
```

##### Result
![screenshot1](http://fs5.directupload.net/images/160302/57mqqv6r.png)

## Services

### Service `$ionicUndo`

#### Methods

##### get()

Using this method you can retrieve your original object or array of objects (before its modification). 
Use it in your undo function.

##### init(originalObject, undoFunction, deletedText, undoText)

Param|Type|Details
---|---|---
`originalObject`|object or array|Original object or array, e.g. deleted list item(s)
`undoFunction`|function|Undo function which is invoked if the undo-button (undo-bar) is pressed
`deletedText`|string|Optional: Undo bar's deleted text
`undoText`|string|Optional: Undo bar's undo text 

##### Example
###### Code

```javascript
angular.module('starter.controllers', [])
.controller('ChatsCtrl', function($ionicUndo, $scope, Chats) {
    $scope.chats = Chats.all();
    
    $scope.delete = function(chat) {
        Chats.delete(chat);
        
        $ionicUndo.init(chat, function() {
            var deletedChat = $ionicUndo.get();
            Chats.add(deletedChat);
        }, "deleted items", "UNDO THAT!");
    };
});
```

###### Result
![screenshot1](http://fs5.directupload.net/images/160303/of3fydfj.png)

## Directives

### Directive `ion-undo-button`

Use this directive to show / hide undo button on iOS.

### Directive `ion-undo-bar`

Use this directive to show / hide undo bar on Android. Add it to a view after the `ion-content` element.

#### Example

```html
<ion-view view-title="Chats">
    <ion-nav-buttons side="right">
        <ion-undo-button></ion-undo-button>
    </ion-nav-buttons>
    <ion-content>
    </ion-content>
    <ion-undo-bar></ion-undo-bar>
</ion-view>
```

## Author

✓|✓
---|---
email|ivan.weber@gmx.de
twitter|https://twitter.com/_ivandroid_
github|https://github.com/ivandroid
ionic market|https://market.ionic.io/user/6540

## License

[MIT](https://github.com/ivandroid/ionic-undo/blob/master/LICENSE)

## Versions

[CHANGELOG](https://github.com/ivandroid/ionic-undo/blob/master/CHANGELOG.md)