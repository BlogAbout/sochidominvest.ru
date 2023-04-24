<?php

use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::apiResource('/agent', 'Agent\AgentController');
    Route::apiResource('/article', 'Article\ArticleController')->only(['store', 'update', 'destroy']);
    Route::apiResource('/attachment', 'Attachment\AttachmentController');
    Route::apiResource('/building', 'Building\BuildingController')->only(['store', 'update', 'destroy']);
    Route::apiResource('/business-process', 'BusinessProcess\BusinessProcessController');
    Route::apiResource('/category', 'Category\CategoryController');
    Route::apiResource('/checker', 'Checker\CheckerController');
    Route::apiResource('/compilation', 'Compilation\CompilationController');
    Route::apiResource('/contact', 'Contact\ContactController');
    Route::apiResource('/developer', 'Developer\DeveloperController');
    Route::apiResource('/document', 'Document\DocumentController');
    Route::apiResource('/external', 'ExternalUser\ExternalUserController');
    Route::apiResource('/feed', 'Feed\FeedController');
    Route::apiResource('/mail', 'Mail\MailController');
    Route::apiResource('/notification', 'Notification\NotificationController');
    Route::apiResource('/partner', 'Partner\PartnerController');
    Route::apiResource('/post', 'Post\PostController');
    Route::apiResource('/product', 'Product\ProductController');
    Route::apiResource('/question', 'Question\QuestionController');
    Route::apiResource('/setting', 'Setting\SettingController')->only(['index', 'store']);
    Route::apiResource('/tag', 'Tag\TagController');
    Route::apiResource('/tariff', 'Tariff\TariffController')->only(['index', 'show']);
    Route::apiResource('/transaction', 'Transaction\TransactionController')->only(['index', 'show']);
    Route::apiResource('/user', 'User\UserController');
    Route::apiResource('/widget', 'Widget\WidgetController');
});

Route::apiResource('/article', 'Article\ArticleController')->only(['index', 'show']);
Route::apiResource('/building', 'Building\BuildingController')->only(['index', 'show']);
