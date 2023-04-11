<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('/agent', 'Agent\AgentController');
Route::apiResource('/article', 'Article\ArticleController');
Route::apiResource('/attachment', 'Attachment\AttachmentController');
Route::apiResource('/category', 'Category\CategoryController');
Route::apiResource('/compilation', 'Compilation\CompilationController');
Route::apiResource('/contact', 'Contact\ContactController');
Route::apiResource('/developer', 'Developer\DeveloperController');
Route::apiResource('/document', 'Document\DocumentController');
Route::apiResource('/external', 'ExternalUser\ExternalUserController');
Route::apiResource('/partner', 'Partner\PartnerController');
Route::apiResource('/post', 'Post\PostController');
Route::apiResource('/question', 'Question\QuestionController');
Route::apiResource('/setting', 'Setting\SettingController')->only(['index', 'show', 'store']);
Route::apiResource('/tag', 'Tag\TagController');
Route::apiResource('/tariff', 'Tariff\TariffController')->only(['index', 'show']);
Route::apiResource('/widget', 'Widget\WidgetController');
