<?php

namespace App\Events;

use App\Models\Document;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DocumentUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Document $document;

    /**
     * Create a new event instance.
     */
    public function __construct(Document $document)
    {
        $this->document = $document;
    }

    /**
     * Channel yang akan dibroadcast.
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('document.' . $this->document->id),
        ];
    }

    /**
     * Nama event di frontend.
     */
    public function broadcastAs(): string
    {
        return 'document.updated';
    }

    /**
     * Data yang dikirim ke frontend.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->document->id,
            'title' => $this->document->title,
            'content' => $this->document->content,
            'user_id' => $this->document->user_id,
            'updated_at' => $this->document->updated_at,
        ];
    }
}