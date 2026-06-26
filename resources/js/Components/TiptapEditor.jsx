import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

export default function TiptapEditor({ content, onChange }) {
    const editor = useEditor({
        extensions: [StarterKit],

        content: content || '<p>Mulai mengetik...</p>',

        editorProps: {
            attributes: {
                class:
                    'prose max-w-none min-h-[500px] p-5 focus:outline-none',
            },
        },

        onUpdate({ editor }) {
            if (onChange) {
                onChange(editor.getHTML());
            }
        },
    });

    useEffect(() => {
        if (!editor) return;

        if (content !== editor.getHTML()) {
            editor.commands.setContent(content || '<p></p>', false);
        }
    }, [content, editor]);

    if (!editor) {
        return <div>Loading editor...</div>;
    }

    return (
        <div className="border-2 border-black rounded-lg bg-white min-h-[500px]">
            <EditorContent editor={editor} />
        </div>
    );
}