<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreRequest;
use App\Http\Requests\Product\UpdateRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;

class ProductController extends Controller
{
    public $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $products = Product::all();

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
