<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreRequest;
use App\Http\Requests\Product\UpdateRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filter = $request->all();

        $products = Product::query()
            ->when(isset($filter['id']), function ($query) use ($filter) {
                $query->whereIn('id', $filter['id']);
            })
            ->when(isset($filter['active']), function ($query) use ($filter) {
                $query->whereIn('is_active', $filter['active']);
            })
            ->when(isset($filter['author']), function ($query) use ($filter) {
                $query->whereIn('author', $filter['author']);
            })
            ->get();

        return ProductResource::collection($products)->response()->setStatusCode(200);
    }

    public function show(Product $product)
    {
        return (new ProductResource($product))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        return $this->service->store($data);
    }

    public function update(UpdateRequest $request, Product $product)
    {
        $data = $request->validated();

        return $this->service->update($data, $product);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response([])->setStatusCode(200);
    }
}
