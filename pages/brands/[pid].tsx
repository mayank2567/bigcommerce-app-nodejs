import { useRouter } from 'next/router';
import ErrorMessage from '../../components/error';
import Form from '../../components/editproduct';
import Loading from '../../components/loading';
import { useSession } from '../../context/session';
import { useBrandInfo, useBrandList } from '../../lib/hooks';
import { FormData } from '../../types';

const BrandInfo = () => {
    const router = useRouter();
    const encodedContext = useSession()?.context;
    const pid = Number(router.query?.pid);
    const { error, isLoading, list = [], mutateList } = useBrandList();
    const { isLoading: isInfoLoading, brand } = useBrandInfo(pid, list);
    const { description, is_visible: isVisible, name, price, type } = brand ?? {};
    let formData = { description, isVisible, name, price, type };
    formData = { ...formData, ...brand };
    const handleCancel = () => router.push('/brands');

    const handleSubmit = async (data: FormData) => {
        try {
            const filteredList = list.filter(item => item.id !== pid);
            const { description, isVisible, name, price, type } = data;
            let apiFormattedData = { description, is_visible: isVisible, name, price, type };
            apiFormattedData = {...apiFormattedData, ...data};
            // Update local data immediately (reduce latency to user)
            mutateList([...filteredList, { ...brand, ...data }], false);

            // Update brand details
            await fetch(`/api/brands/${pid}?context=${encodedContext}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiFormattedData),
            });

            // Refetch to validate local data
            mutateList();

            router.push('/brands');
        } catch (error) {
            console.error('Error updating the brand: ', error);
        }
    };

    if (isLoading || isInfoLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <Form formData={formData} onCancel={handleCancel} onSubmit={handleSubmit} />
    );
};

export default BrandInfo;
