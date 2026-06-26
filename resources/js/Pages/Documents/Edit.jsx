import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import TiptapEditor from '@/Components/TiptapEditor';

export default function Edit({ auth, document }) {

    const [content, setContent] = useState(document.content);

    const saveDocument = async (newContent) => {

        setContent(newContent);

        try {
            await axios.put(`/documents/${document.id}`, {
                title: document.title,
                content: newContent,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>

            <Head title={document.title} />

            <div className="max-w-7xl mx-auto py-10 px-6">

                <button
                    onClick={() => history.back()}
                    className="bg-black text-white px-5 py-2 rounded-lg"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-bold mt-8">
                    {document.title}
                </h1>

                <TiptapEditor
                    content={content}
                    onChange={saveDocument}
                />

            </div>

        </AuthenticatedLayout>
    );
}