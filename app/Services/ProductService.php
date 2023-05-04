<?php

namespace App\Services;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $data['author_id'] = auth()->user()->id;

            if (isset($data['image_ids'])) {
                $imageIds = $data['image_ids'];
                unset($data['image_ids']);
            }

            if (isset($data['video_ids'])) {
                $videoIds = $data['video_ids'];
                unset($data['video_ids']);
            }

            $data['fields'] = isset($data['fields']) ? json_encode($data['fields']) : '';

            $product = Product::firstOrCreate($data);

            if (isset($imageIds)) {
                $product->images()->attach($imageIds);
            }

            if (isset($videoIds)) {
                $product->videos()->attach($videoIds);
            }

            DB::commit();

            return (new ProductResource($product))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }

    public function update(array $data, Product $product)
    {
        try {
            DB::beginTransaction();

            if (isset($data['image_ids'])) {
                $imageIds = $data['image_ids'];
                unset($data['image_ids']);
            }

            if (isset($data['video_ids'])) {
                $videoIds = $data['video_ids'];
                unset($data['video_ids']);
            }

            if (isset($data['fields'])) {
                $data['fields'] = json_encode($data['fields']);
            }

            $product->update($data);

            if (isset($imageIds)) {
                $product->images()->sync($imageIds);
            }

            if (isset($videoIds)) {
                $product->videos()->attach($videoIds);
            }

            DB::commit();

            return (new ProductResource($product))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
