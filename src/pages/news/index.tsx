import ContainerLayout from "@/components/container";
import { newsState } from "@/state";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom";

export default function News() {
    const { id } = useParams();
    const [news] = useAtom(newsState);

    const post = news.find(d => d.id === Number(id));

    if (!post) {
        return (
            <ContainerLayout title="Không tìm thấy bài viết" showBack pathBack="/home">
                <div className="text-center text-gray-500 mt-10">
                    <p className="text-lg font-semibold">404</p>
                    <p>Bài viết không tồn tại hoặc đã bị xoá.</p>
                </div>
            </ContainerLayout>
        );
    }

    return (
        <ContainerLayout title={post.title} showBack pathBack="/home">
            <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </ContainerLayout>
    );
}
