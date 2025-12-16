// StepBusinessInfo.tsx
import { useAtom } from "jotai";
import { registerStoreFormState } from "@/state";
import {
    IoBusinessOutline,
    IoDocumentTextOutline,
    IoBriefcaseOutline,
    IoLocationOutline,
    IoPersonOutline,
    IoIdCardOutline,
    IoCallOutline,
} from "react-icons/io5";
import { useState } from "react";
import LocationPicker, { Location } from "@/components/LocationPicker";
import MapPreview from "@/components/MapPreview";

export default function Step1() {
    const [form, setForm] = useAtom(registerStoreFormState);

    const update = (k: string, v: any) =>
        setForm((p) => ({ ...p, [k]: v }));

    const [showMap, setShowMap] = useState(false);

    function MapPicker() {
        if (!showMap) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center z-[999999]">
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowMap(false)}
                />

                {/* Modal */}
                <div
                    className="
                        relative z-10
                        w-[90vw] h-[75vh]
                        bg-white rounded-2xl
                        shadow-2xl
                        overflow-hidden
                        animate-scale-in
                    "
                >

                    {/* Map */}
                    <div className="h-full">
                        <LocationPicker 
                            onConfirm={(loc: Location) => {
                                setForm((prev) => ({
                                    ...prev,
                                    lat: loc.lat,
                                    lng: loc.lng,
                                }));
                                setShowMap(false);
                            }}

                        />
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            {/* Thông tin doanh nghiệp */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
                <h4 className="text-red-600 font-bold">
                    Thông tin doanh nghiệp
                </h4>

                <div>
                    <label className="text-sm font-semibold text-gray-700">Tên doanh nghiệp</label>
                    <div className="relative">
                        <IoBusinessOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            className="w-full rounded-xl border border-gray-300 px-11 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                            value={form.businessName}
                            onChange={(e) => update("businessName", e.target.value)}
                            placeholder="Nhập tên doanh nghiệp của bạn"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-700">Mã số thuế</label>
                    <div className="relative">
                        <IoDocumentTextOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            className="w-full rounded-xl border border-gray-300 px-11 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                            value={form.taxCode}
                            onChange={(e) => update("taxCode", e.target.value)}
                            placeholder="Mã số thuế"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-700">Lĩnh vực kinh doanh</label>
                    <div className="relative">
                        <IoBriefcaseOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            className="w-full rounded-xl border border-gray-300 px-11 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                            value={form.businessField}
                            onChange={(e) => update("businessField", e.target.value)}
                        >
                            <option value="">-- Chọn lĩnh vực --</option>
                            <option value="food">Ẩm thực</option>
                            <option value="hotel">Lưu trú</option>
                            <option value="entertainment">Giải trí</option>
                            <option value="health">Sức khoẻ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Địa chỉ */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
                <h4 className="text-red-600 font-bold">
                    Địa chỉ tại Thái Nguyên
                </h4>

                {!form.lat || !form.lng ? (
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2
                                rounded-xl border border-dashed border-red-400
                                py-4 text-red-600 font-semibold
                                active:scale-95 transition"
                        onClick={() => setShowMap(true)}
                    >
                        <IoLocationOutline size={22} />
                        Chọn vị trí trên bản đồ
                    </button>
                ) : (
                    <MapPreview
                        lat={form.lat}
                        lng={form.lng}
                        onClick={() => setShowMap(true)}
                    />
                )}
            </div>


            {/* Thông tin liên hệ */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
                <h4 className="text-red-600 font-bold">
                    Thông tin liên hệ
                </h4>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Người liên hệ</label>
                        <div className="relative">
                            <IoPersonOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                className="w-full rounded-xl border border-gray-300 px-11 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                                value={form.contactPerson}
                                onChange={(e) => update("contactPerson", e.target.value)}
                                placeholder="Nhập tên người liên hệ"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Chức vụ</label>
                        <div className="relative">
                            <IoIdCardOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                className="w-full rounded-xl border border-gray-300 px-11 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                                value={form.position}
                                onChange={(e) => update("position", e.target.value)}
                                placeholder="Nhập chức vụ"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
                        <div className="relative">
                            <IoCallOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                className="w-full rounded-xl border border-gray-300 px-11 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                                value={form.phone}
                                onChange={(e) => update("phone", e.target.value)}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <MapPicker />
        </div>
    );
}
