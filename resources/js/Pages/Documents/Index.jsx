import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, documents }) {

    const { data, setData, post, processing } = useForm({
        title: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('documents.store'), {
            onSuccess: () => {
                setData('title', '');
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>

            <Head title="My Documents" />

            <div className="max-w-7xl mx-auto py-10 px-6">

                <h1 className="text-4xl font-bold">
                    My Documents
                </h1>

                <p className="text-gray-500 mt-2">
                    Create and collaborate in real-time
                </p>

                <form
                    onSubmit={submit}
                    className="mt-10 flex gap-4"
                >

                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="flex-1 rounded-lg border px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="Document title..."
                        value={data.title}
                        onChange={(e) =>
                            setData('title', e.target.value)
                        }
                        className="w-72 rounded-lg border px-4 py-3"
                    />

                    <button
                        disabled={processing}
                        className="rounded-lg bg-black px-6 py-3 text-white"
                    >
                        + New Document
                    </button>

                </form>

                {/* List Documents */}

                <div className="mt-10 space-y-4">

                    {documents.length === 0 ? (

                        <div className="rounded-lg border p-6 text-center text-gray-500">
                            No documents yet.
                        </div>

                    ) : (

                        documents.map((doc) => (

                            <div
                                key={doc.id}
                                className="flex items-center justify-between rounded-lg border p-5 shadow-sm"
                            >

                                <div>

                                    <h2 className="text-xl font-semibold">
                                        {doc.title}
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Document ID : {doc.id}
                                    </p>

                                </div>

                                <Link
                                    href={route('documents.edit', doc.id)}
                                    className="rounded-lg bg-blue-600 px-5 py-2 text-white"
                                >
                                    Open
                                </Link>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </AuthenticatedLayout>
    );
}