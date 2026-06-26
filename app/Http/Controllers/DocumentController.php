<?php

namespace App\Http\Controllers;

use App\Events\DocumentUpdated;
use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Menampilkan daftar dokumen.
     */
    public function index()
    {
        $documents = Document::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
        ]);
    }

    /**
     * Membuat dokumen baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $document = Document::create([
            'title' => $request->title,
            'content' => '',
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('documents.edit', $document);
    }

    /**
     * Membuka halaman editor.
     */
    public function edit(Document $document)
    {
        return Inertia::render('Documents/Edit', [
            'document' => $document,
        ]);
    }

    /**
     * Menyimpan perubahan dokumen.
     */
    public function update(Request $request, Document $document)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
        ]);

        $document->update([
            'title' => $request->title ?? $document->title,
            'content' => $request->content ?? '',
        ]);

        broadcast(new DocumentUpdated($document))->toOthers();

        return response()->json([
            'success' => true,
            'document' => $document,
        ]);
    }
}