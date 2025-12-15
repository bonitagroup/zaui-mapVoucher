// StepBusinessInfo.tsx
import { useAtom } from "jotai";
import LocationPicker from "@/components/LocationPicker";
import { registerStoreFormState } from "@/state";

const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 " +
    "focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none";

const labelClass =
    "text-sm font-semibold text-gray-700";

const sectionClass =
    "rounded-2xl border border-gray-200 bg-white p-5 space-y-4";

export default function StepBusinessInfo() {
    const [form, setForm] = useAtom(registerStoreFormState);

    const update = (k: string, v: any) =>
        setForm((p) => ({ ...p, [k]: v }));

    return (
        <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className={sectionClass}>
                <h4 className="text-red-600 font-bold">
                    Thông tin doanh nghiệp
                </h4>

                <div>
                    <label className={labelClass}>Tên doanh nghiệp</label>
                    <input
                        className={inputClass}
                        value={form.businessName}
                        onChange={(e) => update("businessName", e.target.value)}
                    />
                </div>

                <div>
                    <label className={labelClass}>Mã số thuế</label>
                    <input
                        className={inputClass}
                        value={form.taxCode}
                        onChange={(e) => update("taxCode", e.target.value)}
                    />
                </div>

                <div>
                    <label className={labelClass}>Lĩnh vực kinh doanh</label>
                    <select
                        className={inputClass}
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

            {/* Địa chỉ */}
            <div className={sectionClass}>
                <h4 className="text-red-600 font-bold">
                    Địa chỉ tại Thái Nguyên
                </h4>

            </div>

            {/* Người liên hệ */}
            <div className={sectionClass}>
                <h4 className="text-red-600 font-bold">
                    Thông tin liên hệ
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={labelClass}>Người liên hệ</label>
                        <input
                            className={inputClass}
                            value={form.contactPerson}
                            onChange={(e) => update("contactPerson", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Chức vụ</label>
                        <input
                            className={inputClass}
                            value={form.position}
                            onChange={(e) => update("position", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Số điện thoại</label>
                        <input
                            className={inputClass}
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
