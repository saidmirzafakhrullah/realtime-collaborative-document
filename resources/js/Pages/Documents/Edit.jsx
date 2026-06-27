import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import TiptapEditor from '@/Components/TiptapEditor';

export default function Edit({ auth, document }) {

    const [content, setContent] = useState(document.content);

    const timeoutRef = useRef(null);

    const isRemoteUpdate = useRef(false);

    const saveDocument = (newContent) => {

        setContent(newContent);

        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {

            try {

                await axios.put(`/documents/${document.id}`, {
                    title: document.title,
                    content: newContent,
                });

            } catch (error) {

                console.error(error);

            }

        }, 1000);

    };

    useEffect(() => {

        const channel = window.Echo.channel(`document.${document.id}`);

        channel.listen('.document.updated', (e) => {

            console.log('Realtime Update', e);

            isRemoteUpdate.current = true;

            setContent(e.content);

        });

        return () => {

            window.Echo.leave(`document.${document.id}`);

        };

    }, []);

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

                <p className="text-gray-500 mt-2">
                    Realtime Collaborative Document
                </p>

                <div className="mt-8">

                    <TiptapEditor
                        content={content}
                        onChange={saveDocument}
                    />

                </div>

            </div>

        </AuthenticatedLayout>
    );
}