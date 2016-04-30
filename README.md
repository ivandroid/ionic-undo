# <img src="http://fs5.directupload.net/images/160429/2bxnrthw.png" width="30"> ionic-undo  

* [Info](#1-info)
    * [Features](#11-features)
    * [Demo](#12-demo)
    * [License](#13-license)
    * [Versions](#14-versions)
    * [Author](#15-author)
* [Usage](#2-usage)
* [Configuration provider](#3-configuration-provider)
* [Services](#4-services)
* [Directives](#5-directives)

##1. Info
This plugin provides undo feature similar to several Google apps on Android. It can be integrated into your ionic 1.x app.
You can test the plugin via the [ionic view app](http://view.ionic.io/) with the ID **120e45c6**.

##1.1 Features 
* restoring last state of your objects
* undo bar for Android
* undo button for iOS

##[1.2 Demo](http://app-ionicundo.herokuapp.com)  
![animated example](http://i.giphy.com/l2JJDowgKTFn0qLKg.gif)

##1.3 License

[MIT](https://github.com/ivandroid/ionic-undo/blob/master/LICENSE)

##1.4 Versions

[CHANGELOG](https://github.com/ivandroid/ionic-undo/blob/master/CHANGELOG.md)

###1.5 Author
* E-Mail: ivan.weber@gmx.de
* Twitter: https://twitter.com/hybrid_app
* Github: https://github.com/ivandroid
* Ionic Market: https://market.ionic.io/user/6540
* Donations: You're welcome to donate. Any amount at any time! :-)

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ivan%2eweber%40gmx%2ede&lc=DE&item_name=GithubRepositories&no_note=0&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHostedGuest)


##2. Usage
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
            Chats.all().push(deletedChat);
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
            Chats.all().push(deletedChat);
        });
        
        $ionicHistory.goBack();
    };
});
```

##3. Configuration provider

In the angular configuration phase you can define global settings for this plugin. For that purpose there is a provider named `$ionicUndoConfigProvider`.
The following options can be set in the configuration phase:

option|description|type|accepted values|default value
---|---|---|---|---
background|Undo bar's background color|string|ionic color names|dark
color|Undo bar's foreground color|string|ionic color names|light
deletedText|Undo bar's deleted text (left side)|string|text|deleted
undoText|Undo bar's undo text (right side)|string|text|UNDO
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
    $ionicUndoConfigProvider.setUndoAndroid(true);
    $ionicUndoConfigProvider.setUndoIos(false);
});
```

##### Result
![screenshot1](http://fs5.directupload.net/images/160302/57mqqv6r.png)

##4. Services

### Service `$ionicUndo`

#### Methods

##### get()

Using this method you can retrieve your original object or array of objects (before its modification). 
Use it in your undo function.

##### init(originalObject, undoFunction, deletedText, undoText)

Via this method you can initialize the undo feature passing the following parameters:

Param|Type|Details
---|---|---
`originalObject`|object or array|Original object or array, e.g. deleted list item(s)
`undoFunction`|function|Undo function which is invoked if the undo-button (undo-bar) is pressed
`deletedText`|string|Optional: undo bar's deleted text
`undoText`|string|Optional: undo bar's undo text 

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
            Chats.all().push(deletedChat);
        }, "deleted items", "UNDO THAT!");
    };
});
```

###### Result
![screenshot1](http://fs5.directupload.net/images/160303/of3fydfj.png)

##5. Directives

### Directive `ion-undo-button`

Use this directive to show / hide the undo button on iOS.

### Directive `ion-undo-bar`

Use this directive to show / hide the undo bar on Android. Add it to a view after the `ion-content` element.

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
