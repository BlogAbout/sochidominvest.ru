<?php

namespace App\Services;

use App\Http\Requests\Category\StoreRequest;
use App\Http\Requests\Category\UpdateRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Exception;
use Illuminate\Support\Facades\Auth;

class CategoryService
{
    public function index()
    {
        $categories = Category::all();

        return CategoryResource::collection($categories)->response()->setStatusCode(200);
    }

    public function show(Category $category)
    {
        return (new CategoryResource($category))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            $category = new Category;
            $category->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            $category->refresh();

            return (new CategoryResource($category))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Category $category)
    {
        try {
            $data = $request->validated();

            $category->update($data);

            return (new CategoryResource($category))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response([])->setStatusCode(200);
    }
}
