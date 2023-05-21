<?php

namespace App\Services;

use App\Http\Requests\Product\StoreRequest;
use App\Http\Requests\Product\UpdateRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProductService
{
    private $priceService;

    public function __construct(PriceService $priceService)
    {
        $this->priceService = $priceService;
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
                $query->whereIn('author_id', $filter['author']);
            })
            ->limit($filter['limit'] ?? -1)
            ->get();

        return ProductResource::collection($products)->response()->setStatusCode(200);
    }

    public function show(Product $product)
    {
        $product->increment('views');

        return (new ProductResource($product))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $product = new Product;
            $product->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            isset($data['image_ids']) && $product->images()->attach($data['image_ids']);
            isset($data['video_ids']) && $product->videos()->attach($data['video_ids']);

            DB::commit();

            $product->refresh();

            return (new ProductResource($product))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Product $product)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            if (isset($data['cost']) && $product->cost !== $data['cost']) {
                $this->priceService->store([
                    'object_id' => $product->id,
                    'object_type' => Product::class,
                    'date_update' => now()->setTime(0, 0, 0),
                    'cost' => $data['cost']
                ]);
            }

            $product->update($data);

            isset($data['image_ids']) && $product->images()->sync($data['image_ids']);
            isset($data['video_ids']) && $product->videos()->sync($data['video_ids']);

            DB::commit();

            $product->refresh();

            return (new ProductResource($product))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response([])->setStatusCode(200);
    }
}
