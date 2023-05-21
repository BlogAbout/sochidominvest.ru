<?php

namespace App\Http\Controllers;

use App\Services\ArticleService;
use App\Services\AttachmentService;
use App\Services\BuildingService;
use App\Services\DeveloperService;
use App\Services\DocumentService;
use App\Services\PartnerService;
use App\Services\UserService;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    private $userService;
    private $buildingService;
    private $articleService;
    private $documentService;
    private $developerService;
    private $attachmentService;
    private $partnerService;

    public function __construct(
        UserService $userService,
        BuildingService $buildingService,
        ArticleService $articleService,
        DocumentService $documentService,
        DeveloperService $developerService,
        AttachmentService $attachmentService,
        PartnerService $partnerService
    )
    {
        $this->userService = $userService;
        $this->buildingService = $buildingService;
        $this->articleService = $articleService;
        $this->documentService = $documentService;
        $this->developerService = $developerService;
        $this->attachmentService = $attachmentService;
        $this->partnerService = $partnerService;
    }


    public function __invoke(Request $request)
    {
        if (!isset($request->text) || trim($request->text) === '') {
            return response([])->setStatusCode(200);
        }

        return response([
            'users' => $this->userService->index($request),
            'buildings' => $this->buildingService->index($request),
            'articles' => $this->articleService->index($request),
            'documents' => $this->documentService->index($request),
            'developers' => $this->developerService->index($request),
            'attachments' => $this->attachmentService->index($request),
            'partners' => $this->partnerService->index($request)
        ])->setStatusCode(200);
    }
}
