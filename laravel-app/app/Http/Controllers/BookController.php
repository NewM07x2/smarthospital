<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $books = $request->user()->books()->latest()->get();
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

    public function show(Request $request, $id)
    {
        $book = $request->user()->books()->findOrFail($id);
        return response()->json($book);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'read_date' => 'required|date',
            'review' => 'required|string',
        ]);

        $book = $request->user()->books()->findOrFail($id);
        $book->update([
            'title' => $request->title,
            'read_date' => $request->read_date,
            'review' => $request->review,
        ]);

        return response()->json($book);
    }

    public function destroy(Request $request, $id)
    {
        $book = $request->user()->books()->findOrFail($id);
        $book->delete();

        return response()->json([
            'message' => '本を削除しました。'
        ]);
    }
}
