import { useRouter } from 'next/router';
import ErrorMessage from '../../components/error';
import Form from '../../components/editproduct';
import Loading from '../../components/loading';
import { useSession } from '../../context/session';
import { usecategoryInfo, usecategoryList } from '../../lib/hooks';
import { FormData } from '../../types';

const categoryInfo = () => {
    const router = useRouter();
    const encodedContext = useSession()?.context;
    const pid = Number(router.query?.pid);
    const { error, isLoading, list = [], mutateList } = usecategoryList();
    const { isLoading: isInfoLoading, category } = usecategoryInfo(pid, list);
    const { description, is_visible: isVisible, name, price, type } = category ?? {};
    let formData = { description, isVisible, name, price, type, page_type: 'Category' };
    formData = { ...formData, ...category };
    const handleCancel = () => router.push('/categories');

    const handleSubmit = async (data: FormData) => {
        try {
            const filteredList = list.filter(item => item.id !== pid);
            const { description, isVisible, name, price, type } = data;
            let apiFormattedData = { description, is_visible: isVisible, name, price, type };
            apiFormattedData = {...apiFormattedData, ...data};
            // Update local data immediately (reduce latency to user)
            mutateList([...filteredList, { ...category, ...data }], false);

            // Update category details
            await fetch(`/api/categories/${pid}?context=${encodedContext}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiFormattedData),
            });

            // Refetch to validate local data
            mutateList();

            router.push('/categories');
        } catch (error) {
            console.error('Error updating the category: ', error);
        }
    };

    if (isLoading || isInfoLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <Form formData={formData} onCancel={handleCancel} onSubmit={handleSubmit} />
    );
};

export default categoryInfo;
