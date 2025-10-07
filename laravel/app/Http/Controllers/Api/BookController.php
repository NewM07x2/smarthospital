<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $books = $request->user()->books()->orderBy('read_date', 'desc')->get();
        
        return response()->json($books);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'read_date' => 'required|date',
            'review' => 'required|string',
        ]);

        $book = $request->user()->books()->create([
            'title' => $request->title,
            'read_date' => $request->read_date,
            'review' => $request->review,
        ]);

        return response()->json($book, 201);
    }

    public function show(Request $request, Book $book)
    {
        // ユーザーが所有する本かチェック
        if ($book->user_id !== $request->user()->id) {
            return response()->json(['message' => 'アクセス権がありません'], 403);
        }

        return response()->json($book);
    }

    public function update(Request $request, Book $book)
    {
        // ユーザーが所有する本かチェック
        if ($book->user_id !== $request->user()->id) {
            return response()->json(['message' => 'アクセス権がありません'], 403);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'read_date' => 'sometimes|required|date',
            'review' => 'sometimes|required|string',
        ]);

        $book->update($request->only(['title', 'read_date', 'review']));

        return response()->json($book);
    }

    public function destroy(Request $request, Book $book)
    {
        // ユーザーが所有する本かチェック
        if ($book->user_id !== $request->user()->id) {
            return response()->json(['message' => 'アクセス権がありません'], 403);
        }

        $book->delete();

        return response()->json(['message' => '本を削除しました']);
    }
}