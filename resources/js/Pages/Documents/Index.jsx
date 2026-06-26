import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, documents }) {

    const { data, setData, post, processing } = useForm({
        title: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('documents.store'));
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

            </div>

        </AuthenticatedLayout>
    );
}