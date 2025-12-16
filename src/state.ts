import { atom } from "jotai";
import { Category, News, RegisterStoreForm } from "./type";

export const registerStoreFormState = atom<RegisterStoreForm>(
    {
        businessName: "",
        taxCode: "",
        lat: null,
        lng: null,
        businessField: "",

        contactPerson: "",
        position: "",
        phone: "",
        licenseImage: null,

        businessScale: "",
        yearsOperation: "",

        voucherTypes: [],
        targetCustomers: "",
        monthlyBudget: "",
        campaignGoal: "",
    }
);

export const newsState = atom<News[]>([
    {
        id: 1,
        title: "Khai trương cửa hàng cà phê mới tại Hà Nội",
        image: "https://picsum.photos/200/300",
        categoryId: 1,
        views: 120,
        content: `
            <div class="space-y-4">
                <h1 class="text-2xl font-bold text-gray-800">
                    Khai trương cửa hàng cà phê mới
                </h1>

                <p class="text-gray-600">
                    Một quán cà phê phong cách hiện đại vừa chính thức khai trương tại trung tâm Hà Nội,
                    thu hút đông đảo giới trẻ và dân văn phòng.
                </p>

                <img 
                    src="https://picsum.photos/200/300" 
                    alt="Cafe"
                    class="w-full rounded-lg shadow-md"
                />

                <p class="text-gray-700 leading-relaxed">
                    Không gian được thiết kế tối giản, kết hợp ánh sáng tự nhiên cùng nội thất gỗ,
                    mang lại cảm giác ấm cúng và thư giãn cho khách hàng.
                </p>

                <div class="bg-blue-50 p-4 rounded-lg">
                    <p class="text-blue-700 font-medium">
                        🎉 Ưu đãi khai trương: Giảm 20% cho tất cả đồ uống trong tuần đầu tiên.
                    </p>
                </div>
            </div>
        `,
    },
    {
        id: 2,
        title: "Xu hướng kinh doanh F&B năm 2025",
        image: "https://picsum.photos/200/300",
        categoryId: 2,
        views: 340,
        content: `
            <div class="space-y-4">
                <h2 class="text-xl font-semibold text-gray-800">
                    Xu hướng F&B nổi bật năm 2025
                </h2>

                <ul class="list-disc pl-5 text-gray-700 space-y-2">
                    <li>Kinh doanh xanh và bền vững</li>
                    <li>Ứng dụng công nghệ AI vào quản lý</li>
                    <li>Thanh toán không tiền mặt</li>
                    <li>Trải nghiệm khách hàng cá nhân hóa</li>
                </ul>

                <p class="text-gray-600">
                    Các doanh nghiệp cần nhanh chóng thích nghi để không bị tụt lại phía sau.
                </p>
            </div>
        `,
    },
    {
        id: 3,
        title: "5 bí quyết thu hút khách hàng cho cửa hàng nhỏ",
        image: "https://picsum.photos/200/300",
        categoryId: 3,
        views: 215,
        content: `
            <div class="space-y-4">
                <h2 class="text-xl font-bold text-gray-800">
                    5 bí quyết thu hút khách hàng
                </h2>

                <ol class="list-decimal pl-5 space-y-2 text-gray-700">
                    <li>Chăm sóc khách hàng tận tâm</li>
                    <li>Không gian sạch sẽ, gọn gàng</li>
                    <li>Chương trình khuyến mãi hấp dẫn</li>
                    <li>Marketing trên mạng xã hội</li>
                    <li>Luôn lắng nghe phản hồi</li>
                </ol>

                <p class="text-gray-600 italic">
                    “Khách hàng hài lòng là kênh marketing hiệu quả nhất.”
                </p>
            </div>
        `,
    },
    {
        id: 4,
        title: "Zalo Mini App – Giải pháp cho doanh nghiệp nhỏ",
        image: "https://picsum.photos/200/300",
        categoryId: 4,
        views: 410,
        content: `
            <div class="space-y-4">
                <h2 class="text-xl font-semibold text-gray-800">
                    Vì sao nên dùng Zalo Mini App?
                </h2>

                <p class="text-gray-700">
                    Zalo Mini App giúp doanh nghiệp tiếp cận khách hàng nhanh chóng
                    mà không cần phát triển ứng dụng riêng.
                </p>

                <div class="grid grid-cols-2 gap-4">
                    <div class="p-3 bg-gray-100 rounded-lg text-center">
                        🚀 Tốc độ nhanh
                    </div>
                    <div class="p-3 bg-gray-100 rounded-lg text-center">
                        💰 Chi phí thấp
                    </div>
                </div>
            </div>
        `,
    },
    {
        id: 5,
        title: "Cách xây dựng thương hiệu bền vững",
        image: "https://picsum.photos/200/300",
        categoryId: 5,
        views: 290,
        content: `
            <div class="space-y-4">
                <h2 class="text-xl font-bold text-gray-800">
                    Thương hiệu bền vững là gì?
                </h2>

                <p class="text-gray-700">
                    Thương hiệu bền vững không chỉ tập trung vào lợi nhuận,
                    mà còn quan tâm đến môi trường và cộng đồng.
                </p>

                <blockquote class="border-l-4 border-green-500 pl-4 italic text-gray-600">
                    “Giá trị thương hiệu được xây dựng từ sự tin tưởng.”
                </blockquote>
            </div>
        `,
    },
]);


export const categoryState = atom<Category[]>([
    { id: 1, name: "Khai trương" },
    { id: 2, name: "Xu hướng kinh doanh" },
    { id: 3, name: "Kinh nghiệm" },
    { id: 4, name: "Công nghệ" },
    { id: 5, name: "Thương hiệu" },
]);