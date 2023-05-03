<?php

use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::apiResource('/agent', 'Agent\AgentController');
    Route::apiResource('/article', 'Article\ArticleController')->only(['store', 'update', 'destroy']);
    Route::apiResource('/attachment', 'Attachment\AttachmentController');
    Route::apiResource('/building', 'Building\BuildingController')->only(['store', 'update', 'destroy']);
    Route::apiResource('/business-process', 'BusinessProcess\BusinessProcessController');
    Route::apiResource('/store/category', 'Category\CategoryController');
    Route::apiResource('/checker', 'Checker\CheckerController');
    Route::apiResource('/compilation', 'Compilation\CompilationController');
    Route::apiResource('/contact', 'Contact\ContactController');
    Route::apiResource('/developer', 'Developer\DeveloperController');
    Route::apiResource('/document', 'Document\DocumentController');
    Route::apiResource('/external', 'ExternalUser\ExternalUserController');
    Route::apiResource('/feed', 'Feed\FeedController')->only(['index', 'show', 'update', 'destroy']);
    Route::apiResource('/mail', 'Mail\MailController');
    Route::apiResource('/notification', 'Notification\NotificationController');
    Route::apiResource('/partner', 'Partner\PartnerController');
    Route::apiResource('/post', 'Post\PostController');
    Route::apiResource('/store/product', 'Product\ProductController')->only(['store', 'update', 'destroy']);
    Route::apiResource('/question', 'Question\QuestionController')->only(['store', 'update', 'destroy']);
    Route::apiResource('/setting', 'Setting\SettingController')->only(['index', 'store']);
    Route::apiResource('/tag', 'Tag\TagController');
    Route::apiResource('/tariff', 'Tariff\TariffController')->only(['index', 'show']);
    Route::apiResource('/transaction', 'Transaction\TransactionController')->only(['index', 'show']);
    Route::apiResource('/user', 'User\UserController');
    Route::apiResource('/widget', 'Widget\WidgetController');
});

Route::group(['namespace' => 'User'], function () {
    Route::post('/auth', [UserController::class, 'authenticate']);
    Route::post('/registration', [UserController::class, 'registration']);
});
Route::apiResource('/article', 'Article\ArticleController')->only(['index', 'show']);
Route::apiResource('/building', 'Building\BuildingController')->only(['index', 'show']);
Route::apiResource('/feed', 'Feed\FeedController')->only(['store']);
Route::apiResource('/question', 'Question\QuestionController')->only(['index', 'show']);
Route::apiResource('/product', 'Product\ProductController')->only(['index', 'show']);
