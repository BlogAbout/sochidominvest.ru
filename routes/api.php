<?php

use App\Http\Controllers\MessengerController;
use App\Http\Controllers\Notification\NotificationController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::apiResource('/agent', 'Agent\AgentController');
    Route::apiResource('/article', 'Article\ArticleController')->only(['store', 'update', 'destroy']);
    Route::apiResource('/attachment', 'Attachment\AttachmentController');
    Route::apiResource('/building', 'Building\BuildingController')->only(['store', 'update', 'destroy']);
    Route::apiResource('/business-process', 'BusinessProcess\BusinessProcessController');
    Route::apiResource('/store/category', 'Category\CategoryController');
    Route::apiResource('/checker', 'Checker\CheckerController')->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('/compilation', 'Compilation\CompilationController');
    Route::apiResource('/contact', 'Contact\ContactController');
    Route::apiResource('/developer', 'Developer\DeveloperController');
    Route::apiResource('/document', 'Document\DocumentController');
    Route::apiResource('/external', 'ExternalUser\ExternalUserController');
    Route::apiResource('/feed', 'Feed\FeedController')->only(['index', 'show', 'update', 'destroy']);
    Route::apiResource('/mailing', 'Mail\MailController');
    Route::apiResource('/partner', 'Partner\PartnerController');
    Route::apiResource('/post', 'Post\PostController');
    Route::apiResource('/store/product', 'Product\ProductController')->only(['store', 'update', 'destroy']);
    Route::apiResource('/question', 'Question\QuestionController')->only(['store', 'update', 'destroy']);
    Route::apiResource('/setting', 'Setting\SettingController')->only(['index', 'store']);
    Route::apiResource('/tag', 'Tag\TagController');
    Route::apiResource('/tariff', 'Tariff\TariffController')->only(['index', 'show']);
    Route::apiResource('/transaction', 'Transaction\TransactionController');
    Route::apiResource('/user', 'User\UserController');
    Route::apiResource('/widget', 'Widget\WidgetController');

    Route::get('/logout', [UserController::class, 'logout']);
    Route::group(['namespace' => 'Notification'], function () {
        Route::get('/notification', [NotificationController::class, 'index']);
        Route::post('/notification', [NotificationController::class, 'store']);
        Route::get('/notification/read', [NotificationController::class, 'readNotifications']);
        Route::get('/registration/trash', [NotificationController::class, 'trashNotifications']);
    });

    Route::get('/search', 'SearchController');

    Route::group(['prefix' => 'messenger'], function () {
        Route::get('/', [MessengerController::class, 'fetchMessengers']);
        Route::delete('/{messenger}', [MessengerController::class, 'removeMessenger']);
        Route::get('/{messengerId}', [MessengerController::class, 'fetchMessages']);
        Route::post('/message', [MessengerController::class, 'sendMessage']);
        Route::patch('/message/{message}', [MessengerController::class, 'editMessage']);
        Route::delete('/message/{message}', [MessengerController::class, 'removeMessage']);
    });
});

Route::group(['namespace' => 'User'], function () {
    Route::post('/auth', [UserController::class, 'authenticate']);
    Route::post('/registration', [UserController::class, 'registration']);
});

Route::apiResource('/article', 'Article\ArticleController')->only(['index', 'show']);
Route::apiResource('/building', 'Building\BuildingController')->only(['index', 'show']);
Route::apiResource('/feed', 'Feed\FeedController')->only(['store']);
Route::apiResource('/question', 'Question\QuestionController')->only(['index', 'show']);
Route::apiResource('/store/product', 'Product\ProductController')->only(['index', 'show']);
