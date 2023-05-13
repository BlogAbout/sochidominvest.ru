<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreRequest;
use App\Http\Requests\Product\UpdateRequest;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public $service;

    public function __construct(ProductService $service)
    {
        return $this->service = $service;
    }

    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function show(Product $product)
    {
        return $this->service->show($product);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Product $product)
    {
        return $this->service->update($request, $product);
    }

    public function destroy(Product $product)
    {
        return $this->service->destroy($product);
    }
}
