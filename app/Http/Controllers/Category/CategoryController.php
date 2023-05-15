<?php

namespace App\Http\Controllers\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreRequest;
use App\Http\Requests\Category\UpdateRequest;
use App\Models\Category;
use App\Services\CategoryService;

class CategoryController extends Controller
{
    public $service;

    public function __construct(CategoryService $service)
    {
        return $this->service = $service;
    }

    public function index()
    {
        return $this->service->index();
    }

    public function show(Category $category)
    {
        return $this->service->show($category);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Category $category)
    {
        return $this->service->update($request, $category);
    }

    public function destroy(Category $category)
    {
        return $this->service->destroy($category);
    }
}
